function calculatePayment(amount, feePercent = 10) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  if (feePercent < 0 || feePercent > 100) {
    throw new Error("Invalid service fee percent");
  }

  const serviceFee = (amount * feePercent) / 100;
  const taskerReceives = amount - serviceFee;
  const buyerPays = amount; // Buyer always pays full offer price

  return {
    clientPays: parseFloat(buyerPays.toFixed(2)),
    serviceFee: parseFloat(serviceFee.toFixed(2)),
    jobSeekerReceives: parseFloat(taskerReceives.toFixed(2)),
  };
}

export default calculatePayment;