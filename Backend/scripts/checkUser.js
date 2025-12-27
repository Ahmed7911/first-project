import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

// Try dotenv first (fallback to manual parse)
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

const checkUser = async (email) => {
  try {
    const DB_NAME = 'into-to-backend';
    // quick sanity checks
    const rawUri = process.env.MONGODB_URI || parseEnvFile();
    console.log('MONGODB_URI present:', !!rawUri);
    console.log('constructed URI sample startsWith mongodb:', rawUri ? `${rawUri}${DB_NAME}`.startsWith('mongodb') : false);
    await mongoose.connect(`${rawUri}${DB_NAME}`);
    const bcrypt = await import('bcrypt');
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:');
      console.log({ id: user._id.toString(), email: user.email, username: user.username, hasPassword: !!user.password });
      if (user.password) console.log('Password hash sample (first 10 chars):', user.password.slice(0, 10));
      // test password compare
      const isMatch = await bcrypt.compare(email === 'test' ? 'test' : process.argv[3] || 'asdasdasd', user.password);
      console.log('bcrypt compare result for provided password:', isMatch);
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.error('Provide an email as argument');
  process.exit(1);
}
checkUser(email).then(()=>process.exit(0));
