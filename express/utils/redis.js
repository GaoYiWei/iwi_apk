const redis = require('redis')
const redisClient = redis.createClient({ url: 'redis://:GYW7043710100gyw@192.168.0.137:6379' })
redisClient.connect()
redisClient.on('error', err => console.log(err))
redisClient.on('ready', () => {
  console.log('Redis is ready...')   
})
module.exports = redisClient