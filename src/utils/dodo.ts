// Simple mock payment processing
export const processPayment = async (amount: number) => {
  return new Promise((resolve, reject) => {
    // Simulate payment processing
    setTimeout(() => {
      if (amount > 0) {
        resolve({ success: true, transactionId: Math.random().toString(36).substring(7) });
      } else {
        reject(new Error('Invalid payment amount'));
      }
    }, 1500);
  });
};