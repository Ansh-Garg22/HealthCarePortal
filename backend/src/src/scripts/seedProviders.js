require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const { hashPassword } = require('../utils/password');

const providersToSeed = [
  {
    email: 'doctor1@example.com',
    password: 'Doctor@123',
    fullName: 'Dr. Ananya Sharma',
    specialization: 'General Physician',
    clinicName: 'City Health Clinic',
    contactNumber: '9999990001',
    registrationNumber: 'REG-001'
  },
  {
    email: 'doctor2@example.com',
    password: 'Doctor@123',
    fullName: 'Dr. Rohan Verma',
    specialization: 'Cardiologist',
    clinicName: 'Heart Care Center',
    contactNumber: '9999990002',
    registrationNumber: 'REG-002'
  },
  {
    email: 'doctor3@example.com',
    password: 'Doctor@123',
    fullName: 'Dr. Neha Gupta',
    specialization: 'Dietician',
    clinicName: 'Wellness Hub',
    contactNumber: '9999990003',
    registrationNumber: 'REG-003'
  }
];

async function seed() {
  try {
    await connectDB();

    for (const p of providersToSeed) {
      let user = await User.findOne({ email: p.email });

      if (!user) {
        const passwordHash = await hashPassword(p.password);
        user = await User.create({
          email: p.email,
          passwordHash,
          role: 'provider'
        });
        console.log(`Created provider user: ${p.email}`);
      } else {
        console.log(`User already exists: ${p.email}`);
      }

      const existingProfile = await ProviderProfile.findOne({ userId: user._id });

      if (!existingProfile) {
        await ProviderProfile.create({
          userId: user._id,
          fullName: p.fullName,
          specialization: p.specialization,
          clinicName: p.clinicName,
          contactNumber: p.contactNumber,
          registrationNumber: p.registrationNumber
        });
        console.log(`Created provider profile for: ${p.fullName}`);
      } else {
        console.log(`Provider profile already exists for user: ${p.email}`);
      }
    }

    console.log('Provider seeding complete.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
