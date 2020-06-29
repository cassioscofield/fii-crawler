const rp = require('request-promise');
const sleep = require('sleep');
const SLEEP_IN_SECONDS = parseInt(process.env.SLEEP_IN_SECONDS, 10) || 5;
console.info('SLEEP_IN_SECONDS', SLEEP_IN_SECONDS);

const getPriceByTicker = function (ticker, start, end) {
  let parameters = `ticker=${ticker}&start=${start}&end=${end}`;
  let url = `https://statusinvest.com.br/category/tickerpricerange?${parameters}`;
  const options = {
    method: 'GET',
    uri: url,
    body: {},
    json: true
  };
  console.log('getPriceByTicker.options', options);
  return new Promise((resolve, reject) => {
    rp(options).then(body => {
      console.log('getPriceByTicker.then', {body, options});
      resolve(body.data.prices);
    }).catch(error => {
      console.error('getPriceByTicker.catch', {error, options});
      reject(error);
    });
  });
}

const getPriceByTickerBatch = function (tickers, start, end) {
  return new Promise(async (resolve, reject) => {
    let prices = {};
    for (ticker of tickers) {
      try {
        let dataItem = await getPriceByTicker(ticker, start, end);
        sleep.sleep(SLEEP_IN_SECONDS);
        prices[ticker] = dataItem;
      } catch (error) {
        console.error('getPriceByTickerBatch.error', {ticker, error})
      }
    }
    console.log('getPriceByTickerBatch.prices', JSON.stringify(prices, null, 2));
    resolve(prices);
  });
}

module.exports = {
  getPriceByTicker,
  getPriceByTickerBatch
}