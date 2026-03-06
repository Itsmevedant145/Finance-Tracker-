const redis = require('redis');

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

client.connect()
  .then(() => console.log('Connected to Redis!'))
  .catch(err => console.error('Redis connection error:', err));

module.exports = client;