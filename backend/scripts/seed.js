import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { Order } from '../src/models/Order.model.js';
import { User } from '../src/models/User.model.js';

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Order.deleteMany({})]);

  const [adminHash, customerHash] = await Promise.all([
    bcrypt.hash('Admin@123', 12),
    bcrypt.hash('Customer@123', 12)
  ]);

  const admin = await User.create({
    name: 'Logistics Admin',
    email: 'admin@logistics.com',
    passwordHash: adminHash,
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Sample Customer',
    email: 'customer@logistics.com',
    passwordHash: customerHash,
    role: 'customer'
  });

  await Order.insertMany([
    { userId: customer._id, pickupAddress: '12 Park Street', deliveryAddress: '45 Lake Road', packageType: 'document', weight: 0.5, status: 'PENDING', estimatedDeliveryDate: daysFromNow(2) },
    { userId: customer._id, pickupAddress: '88 Market Lane', deliveryAddress: '21 Hill View', packageType: 'parcel', weight: 2, status: 'CONFIRMED', estimatedDeliveryDate: daysFromNow(4) },
    { userId: customer._id, pickupAddress: '9 Central Ave', deliveryAddress: '74 River Side', packageType: 'fragile', weight: 1.2, status: 'SHIPPED', estimatedDeliveryDate: daysFromNow(1) },
    { userId: customer._id, pickupAddress: '33 Station Road', deliveryAddress: '16 Garden Square', packageType: 'heavy', weight: 9, status: 'DELIVERED', estimatedDeliveryDate: daysFromNow(-1) },
    { userId: customer._id, pickupAddress: '19 Tech Park', deliveryAddress: '5 Sunrise Colony', packageType: 'parcel', weight: 3.4, status: 'CANCELLED', estimatedDeliveryDate: daysFromNow(5) }
  ]);

  console.log(`Seeded users: ${admin.email}, ${customer.email}`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
