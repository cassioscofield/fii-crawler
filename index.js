let pricesService = require('./prices-service');
let earningsService = require('./earnings-service');
let totalReturnService = require('./total-return-service');
const jsonexport = require('jsonexport');
const fs = require('fs').promises;
const moment = require('moment');

let arg = process.argv[2];
if (!arg) {
  console.log('é necessário passar o nome do arquivo a ser analisado com extensão .json');
  return;
}

let filename = arg;
let tickers = require('./input/' + filename);
let start = '2010-01-01';
let end = new Date().toISOString();

const toFlatCSV = function (data) {
  return new Promise(async (resolve, reject) => {
    for (ticker of Object.keys(data)) {
      data[ticker].ticker = ticker;
      for (i of data[ticker]) {
        i.date = moment(i.date).format('YYYY-MM-DD');
      }
    }
    jsonexport(Object.values(data[ticker]), {rowDelimiter: ';'}, function(err, csv){
      if (err) {
        return reject(err);
      }
      resolve(csv);
    });
  });
};

const totalReturnToCSV = async function (totalReturnForTickers) {
  const totalReturnForTickersAsCSV = await toFlatCSV(totalReturnForTickers);
  return fs.writeFile('./output/total-return-'+filename.replace('.json','.csv'), totalReturnForTickersAsCSV, 'utf8');
}

const getDataFromTickers = function (tickers, start, end) {
  return new Promise(async (resolve, reject) => {
    const priceForTickers = await pricesService.getPriceByTickerBatch(tickers, start, end);
    const priceForTickersAsString = JSON.stringify(priceForTickers, null, 2);
    await fs.writeFile('./output/price-'+filename, priceForTickersAsString, 'utf8');
    const earningsForTickers = await earningsService.getEarningsByTickerBatch(tickers);
    const earningsForTickersAsString = JSON.stringify(earningsForTickers, null, 2);
    await fs.writeFile('./output/earnings-'+filename, earningsForTickersAsString, 'utf8');
    const totalReturnForTickers = totalReturnService.getTotalReturnByTickerBatch(tickers, priceForTickers, earningsForTickers);
    const totalReturnForTickersAsString = JSON.stringify(totalReturnForTickers, null, 2);
    await fs.writeFile('./output/total-return-'+filename, totalReturnForTickersAsString, 'utf8', resolve);
    resolve(totalReturnForTickers)
  });
};

getDataFromTickers(tickers, start, end).then(result => {
  console.log('getDataFromTickers.result', result);
  totalReturnToCSV(result);
}).catch(error => {
  console.error('getDataFromTickers.error', error);
});
