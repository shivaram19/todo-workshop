const requestLogger = (req, res, next) => {
  console.log('\n📥 Incoming Request:');
  console.log(`  📍 ${req.method} ${req.path}`);
  // console.log(`  📦 Body:`, req.body);
  console.log(`  🍪 Cookies:`, req.cookies);
  next();
};

const responseLogger = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    console.log('\n📤 Outgoing Response:');
    console.log(`  📍 ${req.method} ${req.path}`);
    console.log(`  📦 Data:`, data);
    return originalJson.call(this, data);
  };
  next();
};

module.exports = {
  requestLogger,
  responseLogger
};