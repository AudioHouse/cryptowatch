require('dotenv').config()
let fetch = require('node-fetch')
let crypto = require('crypto')

const markets = {
  bittrex: {
    urls: {
      v1: 'https://bittrex.com/api/v1.1/',
    },
    api: {
      key: process.env.BITTREX_API,
      secret: process.env.BITTREX_SECRET,
    }
  }
}

function publicUrl(url, option){
  return url + 'public/' + option
}

function marketUrl(url, option){
  return url + 'market/' + option
}

function accountUrl(url, option){
  return url + 'account/' + option
}

async function publicBittrexCall(option){
  const bittrex = markets.bittrex.urls.v1
  const response = await fetch(publicUrl(bittrex, option))
  const data = await response.json()
  return data.result
}

async function accountBittrexCall(option){
  const bittrex = markets.bittrex.urls.v1
  const uri = await accountUrl(bittrex, option)
  let sign = crypto.createHmac('sha512', process.env.BITTREX_SECRET)
  sign.update(uri)
  const apisign = sign.digest('hex')
  let x = await fetch(uri, { headers: { apisign: apisign}})
  return x.json()
}

module.exports = {
  getBittrexMarkets() {
    // https://bittrex.com/api/v1.1/public/getmarkets
    return publicBittrexCall('getmarkets')
  },
  getBittrexCurrencies() {
    // https://bittrex.com/api/v1.1/public/getcurrencies
    return publicBittrexCall('getcurrencies')
  },
  getBittrexTicker() {
    // https://bittrex.com/api/v1.1/public/getticker
    return publicBittrexCall('getticker')
  },
  getBittrexMarketSummaries() {
    // https://bittrex.com/api/v1.1/public/getmarketsummaries
    return publicBittrexCall('getmarketsummaries')
  },
  getBittrexMarketSummary(market) {
    // https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-ltc
    return publicBittrexCall(`getmarketsummary?market=${market}`)
  },
  getBittrexOrderbook(market, type) {
    // https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-LTC&type=both
    // required	buy, sell or both to identify the type of orderbook to return.
    return publicBittrexCall(`getorderbook?market=${market}&type=${type}`)
  },
}
