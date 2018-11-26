const dev = require("./development")
const prod = require("./production")
const getCofig = isProd => {
  return isProd ? prod : dev
}
module.exports = getCofig
