import type { Request, Response } from "express";
import { OrderEntity } from "../../../models/v1/order.entity"
import { ORDER_STATUS } from "../../../shared/constants/order-status"
import { OrderShippingEntity } from "../../../models/v1/order.entity"
import { Types } from "mongoose"
import { UserModel } from "@/server/models/v1/user.entity";
import { PaymentTransactionEntity } from "../../../models/v1/payment-transaction.entity"
import { PAYMENT_TRANSACTION_STATUS } from "@/shared/constants/payment-transaction-status"

const parseDateRange = (req: Request) => {
  const fromDate = req.query.fromDate
    ? new Date(req.query.fromDate as string)
    : new Date(new Date().setHours(0, 0, 0, 0))

  const toDate = req.query.toDate
    ? new Date(req.query.toDate as string)
    : new Date()

  return { fromDate, toDate }
}

const getPreviousRange = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime()
  return {
    prevFrom: new Date(from.getTime() - diff),
    prevTo: new Date(to.getTime() - diff),
  }
}

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = parseDateRange(req)
    const { prevFrom, prevTo } = getPreviousRange(fromDate, toDate)

    const completedStatusId = new Types.ObjectId(ORDER_STATUS.COMPLETED)
    const cancelledStatusId = new Types.ObjectId(ORDER_STATUS.CANCELLED)

    /* ========= TRANSACTION AGGREGATES ========= */
    const revenueAggQuery = PaymentTransactionEntity.aggregate([
      {
        $match: {
          status: PAYMENT_TRANSACTION_STATUS.paid.status,
          paidAt: { $exists: true, $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])

    const prevRevenueAggQuery = PaymentTransactionEntity.aggregate([
      {
        $match: {
          status: PAYMENT_TRANSACTION_STATUS.paid.status,
          paidAt: { $exists: true, $gte: prevFrom, $lte: prevTo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])

    const paidTransactionCountAggQuery = PaymentTransactionEntity.aggregate([
      {
        $match: {
          status: PAYMENT_TRANSACTION_STATUS.paid.status,
          paidAt: { $exists: true, $gte: fromDate, $lte: toDate }
        }
      },
      { $count: "count" }
    ])

    const [
      totalOrders,
      completedOrders,
      cancelledOrders,

      revenueAgg,
      prevRevenueAgg,
      paidTransactionCountAgg,

      totalCustomers,
      activeCustomersAgg,
      repeatCustomersAgg,
      newCustomersAgg,
    ] = await Promise.all([
      // orders
      OrderEntity.countDocuments({
        createdAt: { $gte: fromDate, $lte: toDate }
      }),

      OrderEntity.countDocuments({
        status: completedStatusId,
        createdAt: { $gte: fromDate, $lte: toDate }
      }),

      OrderEntity.countDocuments({
        status: cancelledStatusId,
        createdAt: { $gte: fromDate, $lte: toDate }
      }),

      // revenue
      revenueAggQuery,
      prevRevenueAggQuery,
      paidTransactionCountAggQuery,

      // customers
      UserModel.countDocuments({
        createdAt: { $gte: fromDate, $lte: toDate }
      }),

      // active customers
      OrderEntity.aggregate([
        { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
        { $group: { _id: "$userId" } },
        { $count: "count" }
      ]),

      // repeat customers
      OrderEntity.aggregate([
        { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
        {
          $group: {
            _id: "$userId",
            orders: { $sum: 1 }
          }
        },
        { $match: { orders: { $gte: 2 } } },
        { $count: "count" }
      ]),

      // new customers
      OrderEntity.aggregate([
        {
          $group: {
            _id: "$userId",
            firstOrder: { $min: "$createdAt" }
          }
        },
        {
          $match: {
            firstOrder: { $gte: fromDate, $lte: toDate }
          }
        },
        { $count: "count" }
      ])
    ])

    const totalRevenue = revenueAgg[0]?.total || 0
    const prevRevenue = prevRevenueAgg[0]?.total || 0
    const paidTransactions = paidTransactionCountAgg[0]?.count || 0

    const activeCustomers = activeCustomersAgg[0]?.count || 0
    const repeatCustomers = repeatCustomersAgg[0]?.count || 0
    const newCustomers = newCustomersAgg[0]?.count || 0

    return res.json({
      code: 0,
      data: {
        // order
        totalOrders,
        completedOrders,
        cancelledOrders,

        // revenue
        totalRevenue,

        // customers
        totalCustomers,
        activeCustomers,
        repeatCustomers,
        newCustomers,

        // order metrics
        avgOrderValue: paidTransactions
          ? Math.round(totalRevenue / paidTransactions)
          : 0,

        completionRate: totalOrders
          ? +(completedOrders / totalOrders * 100).toFixed(2)
          : 0,

        cancelRate: totalOrders
          ? +(cancelledOrders / totalOrders * 100).toFixed(2)
          : 0,

        // revenue metrics
        revenuePerOrder: paidTransactions
          ? Math.round(totalRevenue / paidTransactions)
          : 0,

        revenueGrowth: prevRevenue
          ? +(((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2)
          : 0,

        // customer metrics
        newCustomersRate: activeCustomers
          ? +(newCustomers / activeCustomers * 100).toFixed(2)
          : 0,

        conversionRate: totalCustomers
          ? +(activeCustomers / totalCustomers * 100).toFixed(2)
          : 0,

        ordersPerCustomer: activeCustomers
          ? +(totalOrders / activeCustomers).toFixed(2)
          : 0,
      }
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message
    })
  }
}


export const getRevenueChart = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = parseDateRange(req)

    const data = await PaymentTransactionEntity.aggregate([
      {
        $match: {
          status: PAYMENT_TRANSACTION_STATUS.paid.status,
          paidAt: { $gte: fromDate, $lte: toDate }
        }
      },

      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$paidAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 },
          orders: { $addToSet: "$order._id" }
        }
      },

      {
        $project: {
          _id: 1,
          revenue: 1,
          transactions: 1,
          orders: { $size: "$orders" }
        }
      },

      { $sort: { _id: 1 } }
    ])

    return res.json({ code: 0, data })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getOrderStatusChart = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = parseDateRange(req)

    const data = await OrderEntity.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "order_status",
          localField: "_id",
          foreignField: "_id",
          as: "status"
        }
      },
      { $unwind: "$status" },
      {
        $project: {
          _id: 0,
          statusId: "$status._id",
          name: "$status.name",
          code: "$status.status",
          icon: "$status.icon",
          index: "$status.index",
          count: 1
        }
      },
      { $sort: { index: 1 } }
    ])

    return res.json({ code: 0, data })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}
export const getShippingStatusChart = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = parseDateRange(req)

    const data = await OrderShippingEntity.aggregate([
      {
        $addFields: {
          statusTime: {
            $switch: {
              branches: [
                // pending
                {
                  case: { $eq: ["$status", "pending"] },
                  then: "$createdAt"
                },

                // picked
                {
                  case: { $eq: ["$status", "picked"] },
                  then: {
                    $max: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$logs",
                            as: "log",
                            cond: { $eq: ["$$log.status", "picked"] }
                          }
                        },
                        as: "log",
                        in: "$$log.time"
                      }
                    }
                  }
                },

                // shipping
                {
                  case: { $eq: ["$status", "shipping"] },
                  then: "$shippedAt"
                },

                // delivered
                {
                  case: { $eq: ["$status", "delivered"] },
                  then: "$deliveredAt"
                },

                // returned
                {
                  case: { $eq: ["$status", "returned"] },
                  then: {
                    $max: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$logs",
                            as: "log",
                            cond: { $eq: ["$$log.status", "returned"] }
                          }
                        },
                        as: "log",
                        in: "$$log.time"
                      }
                    }
                  }
                },

                // cancelled
                {
                  case: { $eq: ["$status", "cancelled"] },
                  then: {
                    $max: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$logs",
                            as: "log",
                            cond: { $eq: ["$$log.status", "cancelled"] }
                          }
                        },
                        as: "log",
                        in: "$$log.time"
                      }
                    }
                  }
                }
              ],
              default: "$createdAt"
            }
          }
        }
      },

      // chỉ lấy record có statusTime hợp lệ
      {
        $match: {
          statusTime: {
            $gte: fromDate,
            $lte: toDate
          }
        }
      },

      // group theo status
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },

      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ])

    return res.json({ code: 0, data })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message
    })
  }
}

export const getCustomerMembershipChart = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = parseDateRange(req)

    const data = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: "$membership.level",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          level: "$_id",
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ])

    return res.json({ code: 0, data })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}