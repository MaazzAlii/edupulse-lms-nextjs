const dns = require('dns');
// Set DNS servers to avoid querySrv ECONNREFUSED on some Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set custom DNS servers, using defaults:', e.message);
}

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Parse MONGO_URI from .env.local
let mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith('MONGO_URI=')) {
          mongoUri = line.substring('MONGO_URI='.length).trim();
          // Remove potential wrapping quotes
          if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
            mongoUri = mongoUri.slice(1, -1);
          } else if (mongoUri.startsWith("'") && mongoUri.endsWith("'")) {
            mongoUri = mongoUri.slice(1, -1);
          }
          break;
        }
      }
    }
  } catch (e) {
    console.warn('Could not read .env.local file:', e.message);
  }
}

if (!mongoUri) {
  console.error('ERROR: MONGO_URI is not defined. Please define it in your environment or in a .env.local file.');
  process.exit(1);
}

// 2. Define Mongoose User Schema directly
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Parse CLI arguments
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
Usage:
  Create or promote an admin user:
    node scripts/create-admin.js <email> [password] [name]

Examples:
  Create new admin:
    node scripts/create-admin.js admin@edupulse.com MySecretPassword "Admin Name"
  
  Promote existing user to admin:
    node scripts/create-admin.js admin@edupulse.com
  `);
  process.exit(0);
}

const email = args[0].toLowerCase().trim();
const password = args[1] || null;
const name = args[2] || 'EduPulse Admin';

async function main() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    let user = await User.findOne({ email });

    if (user) {
      console.log(`\nUser with email "${email}" already exists.`);
      user.role = 'admin';
      user.isActive = true;
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        console.log('-> Updating password');
      }
      if (args[2]) {
        user.name = name;
        console.log(`-> Updating name to "${name}"`);
      }

      await user.save();
      console.log(`User "${user.name}" has been promoted to "admin" successfully! 👑`);
    } else {
      if (!password) {
        console.error('\nERROR: User does not exist. To create a new admin, you must specify a password.');
        console.log('Usage: node scripts/create-admin.js <email> <password> [name]');
        process.exit(1);
      }

      console.log(`\nCreating new user with email "${email}"...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });

      console.log(`Admin user "${user.name}" created successfully! 👑`);
    }
  } catch (error) {
    console.error('ERROR:', error.message || error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

main();
