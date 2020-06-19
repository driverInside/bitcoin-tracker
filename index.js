/**
 * index.js
 */
const fs = require('fs')
const rp = require('request-promise')

const uri = 'https://index-api.bitcoin.com/api/v0/history'
const opts = {
  json: true,
  uri
}

const init = async () => {
  const dataJson = await rp(opts)
    .then(response => {
      return response
        .map(item => {
          return {
            date: new Date(item[0]).toISOString(),
            value: item[1]
          }
        })
        .sort((a, b) => a.date - b.date)
    })
  const header = 'date, value \n'

  fs.appendFileSync('./data.csv', header)

  dataJson.forEach(el => {
    fs.appendFileSync('./data.csv', el.date + ', ' + el.value + ' \n')
  })
}

Promise.resolve(init())
  .then(result => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
