let ips = {}
const rateLimitIps = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    ip in ips ? ips[ip]++ : ips[ip] = 0
    ips[ip] > 5 ? res.status(429).send("429 - Too Many Requests") : next()
}
setInterval(() => ips = {}, 5000)

module.exports = {
    rateLimitIps
}
