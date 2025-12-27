export function buildBillHTML(order: any, qrUrl: string, siteName: string) {
  const money = (v: number) => v.toLocaleString("vi-VN")
  const date = (d: Date) => new Date(d).toLocaleString("vi-VN")

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>Bill ${order.code}</title>
    <style>
    body { width:280px;font-family:Arial;font-size:12px }
    .center{text-align:center}
    .bold{font-weight:bold}
    .line{border-top:1px dashed #000;margin:6px 0}
    table{width:100%}
    td{padding:2px 0}
    .right{text-align:right}
    </style>
    </head>

    <body onload="window.print()">

    <div class="center bold">${siteName}</div>
    <div class="center">Hóa đơn bán hàng</div>

    <div class="line"></div>

    <div>Mã đơn: <b>${order.code}</b></div>
    <div>Ngày: ${date(order.createdAt)}</div>
    <div>Khách: ${order.fullname}</div>

    <div class="line"></div>

    <table>
    <tr class="bold">
    <td>Sản phẩm</td>
    <td class="right">SL</td>
    <td class="right">Giá</td>
    </tr>

    ${order.cartItems.map((i: any) => `
    <tr>
    <td>${i.idProduct?.productName}</td>
    <td class="right">${i.quantity}</td>
    <td class="right">${money(i.price)}</td>
    </tr>
    `).join("")}
    </table>

    <div class="line"></div>

    <table>
    <tr>
    <td>Tạm tính</td>
    <td class="right">${money(order.totalPriceCurrent)}</td>
    </tr>
    <td>Phí vận chuyển</td>
    <td class="right">${money(order.shippingFee)}</td>
    </tr>
    <td>Giảm giá</td>
    <td class="right">${money(order.totalPriceSave)}</td>
    </tr>
    <tr class="bold">
    <td>Thanh toán</td>
    <td class="right">${money(order.totalPrice)}</td>
    </tr>
    </table>

    <div class="line"></div>

    <div>Thanh toán: ${order.paymentId?.name}</div>

    <div class="line"></div>

    <div class="center bold">QUÉT QR THANH TOÁN</div>
    <img src="${qrUrl}" style="width:180px;display:block;margin:8px auto" />

    <div class="center">
    Cảm ơn quý khách!
    </div>

    </body>
    </html>
  `
}
