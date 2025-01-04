const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db.config');

const signup = async (req, res) => {
  console.log('\n📝 Processing Signup:');
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('  ❌ Missing required fields');
      return res.status(400).json({ error: 'Email and password required' });
    }

    console.log('  🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('  💾 Creating new user...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    console.log('  ✅ User created successfully:', user.id);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('  ❌ Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.log('  ❌ Signup error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  console.log('\n🔐 Processing Login:');
  
  try {
    const { email, password } = req.body;

    console.log('  🔍 Finding user...');
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('  ❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('  🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('  ❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('  🎫 Generating token...');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('  🍪 Setting cookie...');
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    console.log('  ✅ Login successful');
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.log('  ❌ Login error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = (req, res) => {
  console.log('\n👋 Processing Logout:');
  console.log('  🍪 Clearing token cookie...');
  res.clearCookie('token');
  console.log('  ✅ Logout successful');
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  signup,
  login,
  logout
};