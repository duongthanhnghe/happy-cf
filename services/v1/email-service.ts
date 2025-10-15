import type { OrderDTO } from "@/server/types/dto/v1/order.dto";
const configRuntime = useRuntimeConfig()

export const sendOrderEmail = async (email: string, order: OrderDTO) => {
  try {
    const data = {
      to: email,
      subject: `Đơn hàng ${order.id}: từ ${order.fullname} - ${order.phone}`,
      orderDetails: order,
    };
    
    const response = await fetch(`${configRuntime.public.siteUrl}/send-order-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};