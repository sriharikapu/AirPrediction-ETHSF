const _ = require('lodash');

// match yesOrders and noOrders and return orderUpdates and matchedPairs
// orderUpdates: id, updatedAmount
// matchedPairs: yesUserId, noUserId, amount, yesPrice
function internalMatch(yesOrders, noOrders) {
  const oldYesOrders = _.cloneDeep(yesOrders);
  const oldNoOrders = _.cloneDeep(noOrders);
  const orderUpdates = {};
  const matchedPairs = [];

  for (let yesOrder of yesOrders) {
    if (yesOrder.amount === 0) {
      continue;
    }
    for (let noOrder of noOrders) {
      if (noOrder.amount === 0) {
        continue;
      }
      if (yesOrder.price + noOrder.price >= 1) {
        const matchedAmount = Math.min(yesOrder.amount, noOrder.amount);
        let matchedYesPrice;
        if (yesOrder.time < noOrder.time) {
          matchedYesPrice = yesOrder.price;
        } else {
          matchedYesPrice = 1 - noOrder.price;
        }

        matchedPairs.push({
          yesUser: yesOrder.user,
          noUser: noOrder.user,
          amount: matchedAmount,
          yesPrice: matchedYesPrice
        });

        yesOrder.amount = yesOrder.amount - matchedAmount;
        noOrder.amount = noOrder.amount - matchedAmount;
      } else {
        break;
      }

      if (yesOrder.amount == 0) {
        break;
      }
    }
  }

  for (let i = 0; i < yesOrders.length; i++) {
    if (oldYesOrders[i].amount > yesOrders[i].amount) {
      if (yesOrders[i].amount === 0) {
        orderUpdates[yesOrders[i].id] = null;
      } else {
        orderUpdates[`${yesOrders[i].id}/amount`] = yesOrders[i].amount;
      }
    }
  }

  for (let i = 0; i < noOrders.length; i++) {
    if (oldNoOrders[i].amount > noOrders[i].amount) {
      if (noOrders[i].amount === 0) {
        orderUpdates[noOrders[i].id] = null;
      } else {
        orderUpdates[`${noOrders[i].id}/amount`] = noOrders[i].amount;
      }
    }
  }

  return {
    orderUpdates,
    matchedPairs
  };
}

module.exports = function(allOrders) {
  const { yes, no } = _.groupBy(allOrders, 'prediction');
  const yesOrders = _.chain(yes)
    .sortBy('price')
    .reverse()
    .value();
  const noOrders = _.chain(no)
    .sortBy('price')
    .reverse()
    .value();

  return internalMatch(yesOrders, noOrders);
};
