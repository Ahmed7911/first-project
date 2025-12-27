import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

// Load .env manually if needed
dotenv.config({ path: '../../.env' });
const parseEnvFile = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/MONGODB_URI\s*=\s*(.+)\s*$/m);
    return match ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
};

const setPassword = async (email, newPassword) => {
  try {
    const DB_NAME = 'into-to-backend';
    const rawUri = process.env.MONGODB_URI || parseEnvFile();
    await mongoose.connect(`${rawUri}${DB_NAME}`);
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    const result = await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hash }, { new: true }).select('+password');
    if (!result) {
      console.log('User not found');
    } else {
      console.log('Password updated for', result.email);
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error setting password:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
const newPassword = process.argv[3];
if (!email || !newPassword) {
  console.error('Usage: node setPassword.js <email> <newPassword>');
  process.exit(1);
}

setPassword(email, newPassword).then(()=>process.exit(0));
