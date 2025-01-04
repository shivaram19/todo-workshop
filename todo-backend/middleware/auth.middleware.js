const jwt = require('jsonwebtoken');
const prisma = require('../config/db.config');

const authenticateUser = async (req, res, next) => {
  console.log('\n🔒 Authentication Check:');
  
  try {
    const token = req.cookies.token;
    
    if (!token) {
      console.log('  ❌ No token found in cookies');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('  🔍 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      console.log('  ❌ User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('  ✅ User authenticated:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log('  ❌ Authentication failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;