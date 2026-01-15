import { UserModel } from "../../../models/v1/user.entity";
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity";
import { MembershipBenefitModel } from "../../../models/v1/membership-benefit.entity";
import { toUserDTO, toUserListDTO } from "../../../mappers/v1/user.mapper";
import type { Request, Response } from "express";
import { toMembershipLevelListDTO, toMembershipLevelDTO } from "../../../mappers/v1/membership-level.mapper"
import { toMembershipBenefitDTO, toMembershipBenefitListDTO } from "../../../mappers/v1/membership-benefit.mapper"
import { OrderEntity } from "../../../models/v1/order.entity";
import { toOrderDTO } from "../../../mappers/v1/order.mapper";
import { ORDER_STATUS } from "../../../shared/constants/order-status";

export const deleteUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserModel.findByIdAndDelete(id);
  res.json({ code: 200, message: "Delete success" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const search = (req.query.search as string)?.trim();
    const membershipLevel = req.query.membershipLevel as string;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (membershipLevel) {
      filter["membership.level"] = membershipLevel;
    }

    if (limit === -1) {
      const users = await UserModel
        .find(filter)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        code: 0,
        data: toUserListDTO(users),
        pagination: {
          total: users.length,
          totalPages: 1,
          page: 1,
          limit: users.length,
        },
      });
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const result = await (UserModel as any).paginate(filter, options);

    return res.status(200).json({
      code: 0,
      data: toUserListDTO(result.docs),
      pagination: {
        total: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error: any) {
    console.error("getAllUsers error:", error);

    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) return res.status(404).json({ code: 404, message: "Not found" });
  res.json({ code: 0, data: toUserDTO(user) });
};

export const getAllMembershipLevel = async (_: Request, res: Response) => {
  try {
    const data = await MembershipLevelModel.find().populate("benefits")
    return res.status(200).json({
      code: 0,
      data: toMembershipLevelListDTO(data),
    })
  } catch (error: any) {
    console.error("getAllMembershipLevel error:", error)

    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export const getMembershipLevelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const level = await MembershipLevelModel.findById(id).populate("benefits");

    if (!level) {
      return res.status(404).json({
        code: 1,
        message: "Membership level không tồn tại",
      });
    }

    return res.json({
      code: 0,
      data: toMembershipLevelDTO(level),
    });
  } catch (error: any) {
    console.error("getMembershipLevelById error:", error);
    return res.status(500).json({
      code: 1,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateMembershipLevel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updated = await MembershipLevelModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('benefits')

    if (!updated) {
      return res.status(404).json({
        code: 1,
        message: 'Membership level not found',
      })
    }

    return res.json({
      code: 0,
      message: 'Membership level updated successfully',
      data: updated,
    })
  } catch (error: any) {
    console.error('updateMembershipLevel error:', error)
    return res.status(500).json({
      code: 1,
      message: 'Internal server error',
      error: error.message,
    })
  }
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await UserModel.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "User không tồn tại" })
    }

    item.active = !item.active
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toUserDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createMembershipBenefit = async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body

    const existing = await MembershipBenefitModel.findOne({ name })
    if (existing) {
      return res.status(400).json({ code: 1, message: "Benefit đã tồn tại" })
    }

    const benefit = await MembershipBenefitModel.create({ name, description, icon })
    return res.status(201).json({
      code: 0,
      message: "Tạo benefit thành công",
      data: toMembershipBenefitDTO(benefit),
    })
  } catch (err: any) {
    console.error("createMembershipBenefit error:", err)
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message })
  }
}

export const getAllMembershipBenefits = async (_: Request, res: Response) => {
  try {
    const benefits = await MembershipBenefitModel.find().sort({ createdAt: -1 })
    return res.json({
      code: 0,
      data: toMembershipBenefitListDTO(benefits),
    })
  } catch (err: any) {
    console.error("getAllMembershipBenefits error:", err)
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message })
  }
}

export const getMembershipBenefitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const benefit = await MembershipBenefitModel.findById(id)
    if (!benefit) return res.status(404).json({ code: 1, message: "Benefit không tồn tại" })

    return res.json({ code: 0, data: toMembershipBenefitDTO(benefit) })
  } catch (err: any) {
    console.error("getMembershipBenefitById error:", err)
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message })
  }
}

export const updateMembershipBenefit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const benefit = await MembershipBenefitModel.findByIdAndUpdate(id, updateData, { new: true })
    if (!benefit) return res.status(404).json({ code: 1, message: "Benefit không tồn tại" })

    return res.json({
      code: 0,
      message: "Cập nhật benefit thành công",
      data: toMembershipBenefitDTO(benefit),
    })
  } catch (err: any) {
    console.error("updateMembershipBenefit error:", err)
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message })
  }
}

export const deleteMembershipBenefit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const benefit = await MembershipBenefitModel.findById(id);
    if (!benefit) {
      return res.status(404).json({ code: 1, message: "Benefit không tồn tại" });
    }

    const levelUsing = await MembershipLevelModel.findOne({ benefits: id });

    if (levelUsing) {
      return res.status(400).json({
        code: 1,
        message: `Không thể xóa Benefit vì đang được sử dụng trong cấp độ thành viên "${levelUsing.name}"`,
      });
    }

    await MembershipBenefitModel.findByIdAndDelete(id);

    return res.json({ code: 0, message: "Xóa benefit thành công" })
  } catch (err: any) {
    console.error("deleteMembershipBenefit error:", err)
    return res.status(500).json({ code: 1, message: "Internal server error", error: err.message })
  }
}


    // let history = result.docs.map((order: any) => {
    //   let type = "";
    //   let points = 0;

    //   if (order.usedPoints > 0 && order.pointsRefunded) {
    //     type = "refunded";
    //     points = order.usedPoints;
    //   } else if (order.usedPoints > 0) {
    //     type = "used";
    //     points = order.usedPoints;
    //   } else if (order.reward?.points > 0 && order.reward.awarded) {
    //     type = "earned";
    //     points = order.reward.points;
    //   } else if (order.reward?.points > 0 && !order.reward.awarded) {
    //     type = "pending_reward";
    //     points = order.reward.points;
    //   } else {
    //     type = "none";
    //   }

    //   return {
    //     orderId: order._id,
    //     code: order.code,
    //     createdAt: order.createdAt,
    //     user: order.userId
    //       ? {
    //           id: order.userId._id,
    //           fullname: order.userId.fullname,
    //           email: order.userId.email,
    //           phone: order.userId.phone,
    //           currentPoint: order.userId.membership?.balancePoint || 0,
    //         }
    //       : null,
    //     historyType: type,
    //     points,
    //   };
    // });

const buildHistory = (order: any, type: string, points: number) => ({
  orderId: order._id,
  code: order.code,
  createdAt: order.createdAt,
  user: order.userId
    ? {
        id: order.userId._id,
        fullname: order.userId.fullname,
        email: order.userId.email,
        phone: order.userId.phone,
        currentPoint: order.userId.membership?.balancePoint || 0,
      }
    : null,
  historyType: type,
  points,
});


export const getRewardHistory = async (req: Request, res: Response) => {
  try {
    let {
      page = 1,
      limit = 20,
      userId,
      search,
      historyType,
      fromDate,
      toDate,
    } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);

    const query: any = {
      $or: [
        { "reward.points": { $gt: 0 } },
        { usedPoints: { $gt: 0 } },
        { pointsRefunded: true },
      ],
    };

    if (userId) {
      query.userId = userId;
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate as string);
      if (toDate) query.createdAt.$lte = new Date(toDate as string);
    }

    if (search) {
      const users = await UserModel.find({
        $or: [
          { fullname: { $regex: search as string, $options: "i" } },
          { email: { $regex: search as string, $options: "i" } },
          { phone: { $regex: search as string, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map(u => u._id);

      if (userIds.length === 0) {
        return res.json({
          code: 0,
          data: [],
          pagination: {
            page: numPage,
            limit: numLimit,
            totalPages: 0,
            total: 0,
          },
        });
      }

      query.userId = { $in: userIds };
    }

    const result = await OrderEntity.paginate(query, {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [
        { path: "userId", model: "User", select: "fullname email phone membership.balancePoint" },
        { path: "paymentId", model: "Payment" },
        { path: "status", model: "OrderStatus" },
        { path: "transaction", model: "PaymentTransaction" },
      ],
    });


    let history = result.docs.flatMap((order: any) => {
      const records: any[] = [];
      const isCancelled = order.status?.id === ORDER_STATUS.CANCELLED;

      switch (true) {
        case order.usedPoints > 0 && order.pointsRefunded:
          records.push(buildHistory(order, "refunded", order.usedPoints));
          break;

        case order.usedPoints > 0:
          records.push(buildHistory(order, "used", order.usedPoints));
          break;
      }

      switch (true) {
        case order.reward?.points > 0 && order.reward.awarded:
          records.push(buildHistory(order, "earned", order.reward.points));
          break;

        case order.reward?.points > 0 && !isCancelled:
          records.push(buildHistory(order, "pending_reward", order.reward.points));
          break;
      }

      return records;
    });


    if (historyType) {
      history = history.filter(item => item.historyType === historyType);
    }

    return res.json({
      code: 0,
      message: "Lấy lịch sử tích điểm thành công",
      data: history,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs,
      },
    });
  } catch (err: any) {
    console.error("💥 getRewardHistory error:", err);
    return res.status(500).json({
      code: 1,
      message: "Lỗi server khi lấy lịch sử tích điểm",
    });
  }
};
