const moment  = require('moment');
const getTotalReturnByTicker = function (ticker, prices, earnings) {
  let dates = {};
  for (earning of earnings) {
    date = moment(earning.ed, "DD/MM/YYYY").format();
    dates[date] = {
      date: new Date(date),
      ticker: ticker,
      earning: earning.v
    }
  }
  for (price of prices) {
    date = moment(price.date, "DD/MM/YY").format();
    dates[date] = dates[date] || { ticker: ticker, date: new Date(date) };
    dates[date].price = price.price;
  }
  for (date in dates) {
  }
  let values = Object.values(dates).sort((a, b) => a.date - b.date)
  values[0].totalReturnFactor = 1.0;
  values[0].adjustmentFactor = 1.0;
  values[0].totalEarnings = values[0].earning || 0.0;
  values[0].totalReturn = values[0].price;
  values[0].earningsReinvestedFactor = 1.0;
  for (var i=1;i<values.length;i++) {
    value = values[i];
    previousValue = values[i-1];
    if (value.earning) {
      value.adjustmentFactor = 1 + value.earning/value.price;
      value.totalEarnings = previousValue.totalEarnings + value.earning;
      value.earningsReinvestedFactor = previousValue.earningsReinvestedFactor * value.adjustmentFactor;
    } else {
      value.adjustmentFactor = 1.0
      value.totalEarnings = previousValue.totalEarnings;
      value.earningsReinvestedFactor = previousValue.earningsReinvestedFactor;
    }
    value.priceFactor = value.price / previousValue.price;
    value.totalReturnFactor = value.earningsReinvestedFactor * value.priceFactor;
    value.totalReturn = value.price * value.totalReturnFactor;
  }
  return values;
}

const getTotalReturnByTickerBatch = function (tickers, prices, earnings) {
  let totalReturn = {};
  for (ticker of tickers) {
    try {
      totalReturn[ticker] = getTotalReturnByTicker(ticker, prices[ticker], earnings[ticker]);
    } catch (error) {
      console.error('getTotalReturnByTickerBatch.error', {ticker, error})
    }
  }
  console.log('getTotalReturnByTickerBatch.prices', JSON.stringify(totalReturn, null, 2));
  return totalReturn;
}

module.exports = {
  getTotalReturnByTicker,
  getTotalReturnByTickerBatch
}