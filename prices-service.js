const rp = require('request-promise');
function sleep(ms) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
const SLEEP_IN_SECONDS = parseInt(process.env.SLEEP_IN_SECONDS, 10) || 5;
console.info('SLEEP_IN_SECONDS', SLEEP_IN_SECONDS);
const PERIOD_5_YEARS = 4;

const getPriceByTicker = function (ticker) {
  let url = `https://statusinvest.com.br/fii/tickerprice`
  const options = {
    method: 'POST',
    headers: {
      'user-agent': 'X',
    },
    uri: url,
    form: {
      ticker,
      type: PERIOD_5_YEARS,
      currences: 1,
    },
    json: true
  };
  console.log('getPriceByTicker.options', options);
  return new Promise((resolve, reject) => {
    rp(options).then(body => {
      console.log('getPriceByTicker.then', {body, options});
      resolve(body[0].prices);
    }).catch(error => {
      console.error('getPriceByTicker.catch', {error, options});
      reject(error);
    });
  });
}

const getPriceByTickerBatch = function (tickers) {
  return new Promise(async (resolve, reject) => {
    let prices = {};
    for (let ticker of tickers) {
      try {
        let dataItem = await getPriceByTicker(ticker);
        sleep(SLEEP_IN_SECONDS);
        prices[ticker] = dataItem;
      } catch (error) {
        console.error('getPriceByTickerBatch.error', {ticker, error});
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
