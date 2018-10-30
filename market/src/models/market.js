import _ from "lodash";
import {  marketsRef } from "../services/market";

export default {
  namespace: "market",

  state: {},

  subscriptions: {
    setup({ dispatch }) {
      marketsRef.on("child_added", function(market) {
        dispatch({
          type: "addMarket",
          payload: market
        });
      });

      marketsRef.on("child_changed", function(market) {
        dispatch({
          type: "addMarket",
          payload: market
        });
      });
    }
  },

  effects: {
    *createMarket({ payload }, { call, put }) {
      marketsRef.push(payload);
    },
  },

  reducers: {
    addMarket(state, { payload }) {
      const newState = { ...state };
      if (!newState[payload.val().category]) {
        newState[payload.val().category] = {};
      }

      newState[payload.val().category][payload.key] = {
        id: payload.key,
        ...payload.val()
      };

      return newState;
    },

    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
