let pricesService = require('./prices-service');
let fs = require('fs');
let arg = process.argv[2];

const getDataFromTickers = function (tickers, start, end) {
  return new Promise(async (resolve, reject) => {
    const priceForTickers = await pricesService.getPriceByTickerBatch(tickers, start, end);
    fs.writeFile('./output/'+filename, JSON.stringify(priceForTickers, null, 2), 'utf8', resolve);
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

getDataFromTickers(tickers, start, end);
