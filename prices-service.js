var rp = require('request-promise');

const getPriceByTicker = function (ticker, start, end) {
  let parameters = `ticker=${ticker}&start=${start}&end=${end}`;
  let url = `https://statusinvest.com.br/category/tickerpricerange?${parameters}`;
  var options = {
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
        dataItem = await getPriceByTicker(ticker, start, end);
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