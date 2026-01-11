// Check NextAuth environment variables
import { config } from 'dotenv';

// Load environment variables
config();

console.log('🔐 NextAuth Environment Check');
console.log('===============================');

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'DATABASE_URL'
];

const optionalVars = [
  'NODE_ENV',
  'RESEND_API_KEY'
];

console.log('\n📋 Required Variables:');
requiredVars.forEach(varName => {
  const exists = process.env[varName] ? true : false;
  const value = process.env[varName];
  const masked = value ? (value.length > 10 ? value.substring(0, 10) + '...' : value) : 'NOT SET';

  console.log(`${varName}: ${exists ? '✅ EXISTS' : '❌ MISSING'} (${masked})`);

  if (varName === 'NEXTAUTH_SECRET' && value && value.length < 32) {
    console.log(`   ⚠️  WARNING: NEXTAUTH_SECRET should be at least 32 characters long`);
  }

  if (varName === 'NEXTAUTH_URL' && value) {
    try {
      const url = new URL(value);
      if (!url.protocol.startsWith('http')) {
        console.log(`   ⚠️  WARNING: NEXTAUTH_URL should be a valid HTTP/HTTPS URL`);
      }
    } catch {
      console.log(`   ⚠️  WARNING: NEXTAUTH_URL is not a valid URL`);
    }
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const exists = process.env[varName] ? true : false;
  console.log(`${varName}: ${exists ? '✅ EXISTS' : '⚠️  NOT SET'}`);
});

console.log('\n🔧 Production Setup Instructions:');
console.log('----------------------------------');
console.log('For Netlify deployment, set these environment variables:');
console.log('1. NEXTAUTH_SECRET: Generate a secure random string (at least 32 chars)');
console.log('2. NEXTAUTH_URL: Your production domain (https://marketdottcom.netlify.app)');
console.log('3. DATABASE_URL: Your MongoDB connection string');

console.log('\n🛠️  To generate a secure NEXTAUTH_SECRET:');
console.log('openssl rand -base64 32');
console.log('OR');
console.log('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');