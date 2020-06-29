let pricesService = require('./prices-service');
let earningsService = require('./earnings-service');
let fs = require('fs');
let arg = process.argv[2];

const getDataFromTickers = function (tickers, start, end) {
  return new Promise(async (resolve, reject) => {
    // const priceForTickers = await pricesService.getPriceByTickerBatch(tickers, start, end);
    // const priceForTickersAsString = JSON.stringify(priceForTickers, null, 2);
    // fs.writeFile('./output/price-'+filename, priceForTickersAsString, 'utf8', resolve);
    const earningsForTickers = await earningsService.getEarningsByTickerBatch(tickers);
    const earningsForTickersAsString = JSON.stringify(earningsForTickers, null, 2);
    fs.writeFile('./output/earnings-'+filename, earningsForTickersAsString, 'utf8', resolve);
  });
};

if (!arg) {
  console.log('é necessário passar o nome do arquivo a ser analisado com extensão .json');
  return;
}
let filename = arg;
let tickers = require('./input/' + filename);
let start = '2010-01-01';
let end = new Date().toISOString();

getDataFromTickers(tickers, start, end).then(result => {
  console.log('getDataFromTickers.result', result);
}).catch(error => {
  console.error('getDataFromTickers.error', error);
});
