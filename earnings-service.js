const rp = require('request-promise');
const sleep = require('sleep');
const SLEEP_IN_SECONDS = parseInt(process.env.SLEEP_IN_SECONDS, 10) || 5;
console.info('SLEEP_IN_SECONDS', SLEEP_IN_SECONDS);

const getEarningsByTicker = function (ticker) {
  let parameters = `ticker=${ticker}&chartProventsType=1`;
  let url = `https://statusinvest.com.br/fii/companytickerprovents?${parameters}`;
  const options = {
    method: 'GET',
    uri: url,
    body: {},
    json: true
  };
  console.log('getEarningsByTicker.options', options);
  return new Promise((resolve, reject) => {
    rp(options).then(body => {
      console.log('getEarningsByTicker.then', {body, options});
      resolve(body.assetEarningsModels);
    }).catch(error => {
      console.error('getEarningsByTicker.catch', {error, options});
      reject(error);
    });
  });
}

const getEarningsByTickerBatch = function (tickers) {
  return new Promise(async (resolve, reject) => {
    let prices = {};
    for (ticker of tickers) {
      try {
        let dataItem = await getEarningsByTicker(ticker);
        sleep.sleep(SLEEP_IN_SECONDS);
        prices[ticker] = dataItem;
      } catch (error) {
        console.error('getEarningsByTickerBatch.error', {ticker, error})
      }
    }
    console.log('getEarningsByTickerBatch.prices', JSON.stringify(prices, null, 2));
    resolve(prices);
  });
}

module.exports = {
  getEarningsByTicker,
  getEarningsByTickerBatch
}