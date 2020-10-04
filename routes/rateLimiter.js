const rateLimit = require("express-rate-limit")
const limiter = rateLimit({
  
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: "Limit has reacheds",
    header: true
  });

  module.exports = limiter