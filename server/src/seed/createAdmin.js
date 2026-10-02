import mongoose from 'mongoose';
import '../config/env.js';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const name = process.env.ADMIN_NAME || 'Admin';
const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'Admin1234';

await connectDB();

const existing = await User.findOne({ email });
if (existing) {
  existing.role = 'admin';
  await existing.save();
  console.log(`Existing user ${email} promoted to admin`);
} else {
  await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin created: ${email}`);
}

await mongoose.disconnect();
