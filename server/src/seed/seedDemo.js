import mongoose from 'mongoose';
import '../config/env.js';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';

await connectDB();

let user = await User.findOne({ email: 'demo@example.com' });
if (!user) user = await User.create({ name: 'Demo User', email: 'demo@example.com', password: 'Demo1234' });

const samples = [
  ['Cannot reset my password', 'The reset email never arrives even after several attempts.', 'Account', 'High', 'Open'],
  ['Invoice shows wrong amount', 'My March invoice charges for two seats but we only use one.', 'Billing', 'Medium', 'In Progress'],
  ['Dashboard loads slowly', 'The main dashboard takes around 15 seconds to load on office wifi.', 'Technical', 'Medium', 'Open'],
  ['Request: dark mode', 'It would help to have a dark theme for late night work.', 'Feature Request', 'Low', 'Open'],
  ['Unable to update billing address', 'The save button does nothing when I edit my billing address.', 'Billing', 'High', 'In Progress'],
  ['How do I export my data?', 'Looking for a way to export all of my records as CSV.', 'General', 'Low', 'Resolved'],
  ['Login fails on mobile Safari', 'Tapping the login button reloads the page without signing me in.', 'Technical', 'High', 'Open'],
  ['Change account email', 'I need to move my account to a new company email address.', 'Account', 'Medium', 'Resolved'],
  ['Two-factor codes rejected', 'Authenticator codes are rejected as invalid since yesterday.', 'Account', 'High', 'In Progress'],
  ['Add team member limits', 'Can we get a higher limit on team members for the starter plan?', 'Feature Request', 'Low', 'Open'],
  ['Refund for duplicate charge', 'I was charged twice for the same subscription this month.', 'Billing', 'High', 'Resolved'],
  ['Notifications not arriving', 'Email notifications for ticket replies stopped arriving last week.', 'Technical', 'Medium', 'Open'],
];

await Ticket.deleteMany({ user: user._id });
await Ticket.insertMany(
  samples.map(([title, description, category, priority, status]) => ({ title, description, category, priority, status, user: user._id }))
);

console.log(`Seeded ${samples.length} tickets for demo@example.com (password: Demo1234)`);
await mongoose.disconnect();
