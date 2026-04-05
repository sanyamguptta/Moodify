// for connecting server to the redis

const Redis = require('ioredis');
// const Redis = require('ioredis').default();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", () => {
    console.log('Server is connected to Redis')
})
// handling error if occurs
redis.on('error', (err) => {
    console.log(err)
})

module.exports = redis;