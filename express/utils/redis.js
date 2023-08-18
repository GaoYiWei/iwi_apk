const redis = require('redis')
const redisClient = redis.createClient({ url: 'redis://:GYW7043710100gyw@127.0.0.1:6379' })
redisClient.connect()
redisClient.on('error', err => console.log(err))
redisClient.on('ready', () => {
  console.log('Redis is ready...')   
})
module.exports = redisClient