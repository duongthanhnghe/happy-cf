export const sendOrderEmail = async (email, order) => {
  try {
    const data = {
      to: email,
      subject: `Đơn hàng ${order.idOrder}: từ ${order.fullname} - ${order.phone}`,
      orderDetails: order,
    };
    
    const response = await fetch("http://localhost:3001/send-order-email", {
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
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};