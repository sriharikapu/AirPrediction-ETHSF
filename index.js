const axios = require('axios');
const _ = require('lodash');
const firebase = require('firebase');

const api = require('./api');
const matchOrder = require('./match-order');

firebase.initializeApp({
  databaseURL: 'https://market-7bb90.firebaseio.com/'
});
const database = firebase.database();
const marketsRef = database.ref('markets');

function sendUserPay(type, matchedPair, market) {
  console.log(`Send ${type} payment at ${new Date()}`);
  const { yesUser, noUser, amount, yesPrice } = matchedPair;
  const port = type === 'yesUser' ? yesUser.port : noUser.port;
  const dst = type === 'yesUser' ? noUser.address : yesUser.address;
  const price = type === 'yesUser' ? yesPrice : 1 - yesPrice;
  const queryResult = type === 'yesUser' ? [1] : [0];
  const finalAmount = amount * price * 10000;

  return api.sendPay(
    `http://localhost:${port}`,
    dst,
    finalAmount.toString(16),
    market.oracle,
    queryResult
  );
}

function processOrders(data) {
  const market = data.val();
  const { orderUpdates, matchedPairs } = matchOrder(
    _.chain(market.orders)
      .mapValues((order, id) => {
        order.id = id;
        return order;
      })
      .values()
      .value()
  );

  _.forEach(matchedPairs, matchedPair => {
    sendUserPay('yesUser', matchedPair, market);
    sendUserPay('noUser', matchedPair, market);
  });

  const ordersRef = database.ref(`markets/${data.key}/orders`);
  ordersRef.update(orderUpdates);

  if (_.maxBy(matchedPairs, 'yesPrice')) {
    database
      .ref(`markets/${data.key}/rate`)
      .set(_.maxBy(matchedPairs, 'yesPrice').yesPrice);
  }
}

function getStat(port) {
  api.getStat(`http://localhost:${port}`).then(({ data }) => {
    axios.put(`https://market-7bb90.firebaseio.com/${port}.json`, data);
  });
}

function resolveChannel(port) {
  console.log(`resolve payment at ${new Date()}`);

  return api.resolveChannel(`http://localhost:${port}`);
}

function main() {
  setInterval(() => {
    getStat(8081);
    getStat(8082);
    resolveChannel(8081);
    resolveChannel(8082);
  }, 10000);

  marketsRef.on('child_changed', function(data) {
    processOrders(data);
  });
}

main();
