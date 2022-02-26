require("dotenv").config();
const config = {};

config.PORT = 9090 || process.env.PORT;

module.exports = config;