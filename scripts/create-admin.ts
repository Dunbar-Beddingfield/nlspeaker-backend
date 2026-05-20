/**
 * One-time script to create the first admin account.
 * Run with: npm run create-admin
 */
import * as readline from 'readline';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['super-admin', 'editor'], default: 'super-admin' },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const Admin = mongoose.model('Admin', AdminSchema);

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('\n🔐  NL Speaker Admin Account Creator\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = await prompt(rl, 'Full name:  ');
  const email = await prompt(rl, 'Email:      ');
  const password = await prompt(rl, 'Password:   ');

  rl.close();

  if (!name || !email || !password) {
    console.error('❌  All fields are required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌  Password must be at least 8 characters.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('\n✅  Connected to MongoDB');

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`❌  An admin with email "${email}" already exists.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ name, email: email.toLowerCase(), passwordHash, role: 'super-admin' });

  console.log(`\n✅  Admin account created successfully!`);
  console.log(`   Email: ${email}`);
  console.log(`   Role:  super-admin`);
  console.log(`\n   You can now log in at /admin/login\n`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
