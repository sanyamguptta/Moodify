// connecting server with the redis
const Redis = require('ioredis') // .default -> it is used for getting redis suggestions

// for creating redis on redis
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
//   tls: {}, // 🔥 REQUIRED for Redis Cloud
});

redis.on("connect", () => {
    console.log('Server is connected to redis')
})

redis.on("error", (err) => {
    console.log(err)
})

module.exports = redis;