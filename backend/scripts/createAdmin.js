const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  const email = 'admin@anas.dev'; // Default admin email
  const password = 'AdminPassword123'; // Default admin password

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.deleteMany({ email });
    await User.create({ email, password: hashedPassword });

    console.log('Admin User Created Successfully');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
