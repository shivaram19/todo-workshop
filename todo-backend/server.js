const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { requestLogger, responseLogger } = require('./middleware/logger.middleware');
const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');

const app = express();

// Middleware Configuration
console.log('🔧 Configuring middleware...');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(responseLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('\n❌ Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n🚀 Server Started:');
  console.log(`  📡 Running on port ${PORT}`);
  console.log(`  🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🌐 CORS enabled for: http://localhost:5173`);
});

// Handle server shutdown
process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});