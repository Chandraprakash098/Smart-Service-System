exports.generateInvoiceNumber = () => {
  const prefix = "INV";
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

exports.calculateLateFee = (dueDate, amount) => {
  const today = new Date();
  const due = new Date(dueDate);
  if (today > due) {
    const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return Math.min(amount * 0.1, daysLate * (amount * 0.01));
  }
  return 0;
};

exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

exports.validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};
