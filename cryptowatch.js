require('dotenv').config()
let request = require('request')
let axios = require('axios')
let fetch = require('node-fetch')

const bittrex = "https://bittrex.com/api/v1.1/"

function publicUrl(url, option){
    return url + 'public/' + option
}
module.exports = {
    getBittrexMarkets: async function(){
        const response = await fetch(publicUrl(bittrex, 'getmarkets'))
        const data = await response.json()
        return data.result
    }
}