const moment  = require('moment');
const getTotalReturnByTicker = function (ticker, prices, earnings) {
  let dates = {};
  for (let earning of earnings) {
    date = moment(earning.ed, "DD/MM/YYYY").format();
    dates[date] = {
      date: new Date(date),
      ticker: ticker,
      earning: earning.v
    };
  }
  for (let price of prices) {
    date = moment(price.date, "DD/MM/YY").format();
    dates[date] = dates[date] || { ticker: ticker, date: new Date(date) };
    dates[date].price = price.price;
  }

  let values = Object.values(dates)
    .sort((a, b) => a.date - b.date)
    .filter(a => a.earning && a.price);

  value = values[0];
  value.totalReturnFactor = 1.0;
  value.adjustmentFactor = 1.0;
  value.cumulativeEarningsPerShare = value.earning;
  value.totalReturn = value.price;
  value.earningsReinvestedFactor = 1.0;
  value.totalEarnings =  value.earning || 0.0;
  value.totalShares = 1.0;
  value.priceFactor = 1.0;

  for (let i = 1;i<values.length;i++) {
    let value = values[i];
    let previousValue = values[i-1];
    if (value.earning) {
      value.totalShares = previousValue.totalShares + value.earning/value.price;
      value.adjustmentFactor = 1 + value.earning/value.price;
      value.cumulativeEarningsPerShare = previousValue.cumulativeEarningsPerShare + value.earning;
      value.totalEarnings = previousValue.totalEarnings + value.earning * value.totalShares;
      value.earningsReinvestedFactor = previousValue.earningsReinvestedFactor * value.adjustmentFactor;
    } else {
      value.totalShares = previousValue.totalShares;
      value.adjustmentFactor = 1.0;
      value.cumulativeEarningsPerShare = previousValue.cumulativeEarningsPerShare;
      value.earningsReinvestedFactor = previousValue.earningsReinvestedFactor;
      value.totalEarnings = previousValue.totalEarnings;
    }
    value.priceFactor = value.price / previousValue.price;
    value.totalReturnFactor = value.earningsReinvestedFactor * value.priceFactor;
    value.totalReturn = value.priceFactor * value.totalShares;
  }
  return values;
};

const getTotalReturnByTickerBatch = function (tickers, prices, earnings) {
  let totalReturn = {};
  for (let ticker of tickers) {
    try {
      totalReturn[ticker] = getTotalReturnByTicker(ticker, prices[ticker], earnings[ticker]);
    } catch (error) {
      console.error('getTotalReturnByTickerBatch.error', {ticker, error})
    }
  }
  console.log('getTotalReturnByTickerBatch.prices', JSON.stringify(totalReturn, null, 2));
  return totalReturn;
};

module.exports = {
  getTotalReturnByTicker,
  getTotalReturnByTickerBatch
};
