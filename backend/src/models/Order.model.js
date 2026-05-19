import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  packageType: { type: String, enum: ['document', 'parcel', 'fragile', 'heavy'], required: true },
  weight: { type: Number, required: true, min: 0.1 },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  estimatedDeliveryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model('Order', orderSchema);
