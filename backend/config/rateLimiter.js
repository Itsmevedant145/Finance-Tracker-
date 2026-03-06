// rateLimiter.js
const redisClient = require('./redis'); // Redis client

const rateLimiter = (limit, windowInSeconds) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.ip; // fallback to IP for public endpoints
      const key = `rate:${userId}`;

      // Increment the request count
      const current = await redisClient.incr(key);

      if (current === 1) {
        // First request → set TTL
        await redisClient.expire(key, windowInSeconds);
      }

      if (current > limit) {
        return res.status(429).json({
          message: `Rate limit exceeded. Try again in ${windowInSeconds} seconds.`
        });
      }

      next(); // allow request
    } catch (err) {
      console.error('Rate limiter error:', err);
      next(); // fail open → allow request if Redis fails
    }
  };
};

module.exports = rateLimiter;