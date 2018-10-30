import axios from 'axios';
import firebase from 'firebase';

const config = {
  databaseURL: "https://market-7bb90.firebaseio.com/",
};
firebase.initializeApp(config);
export const database = firebase.database();
export const marketsRef = database.ref('markets');

export function createMarket(data) {
  return marketsRef.push(data);
}

export function sendPay(apiBase, dst, amount, oracle) {
  return axios.post(`${apiBase}/sendPay`, {
    Dst: dst,
    Amount: amount,
    Dependency: oracle,
    QueryFinalization: [],
    QueryResult: [],
    Timeout: 10
  });
}