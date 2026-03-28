const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
