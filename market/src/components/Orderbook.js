import React from "react";
import _ from "lodash";
import { Table } from "antd";

const columns = [
  {
    title: "Price",
    dataIndex: "price",
    key: "price"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  }
];

const Orderbook = ({ orders }) => {
  const data = _.chain(orders)
    .groupBy("price")
    .mapValues(values => _.sumBy(values, "amount"))
    .mapValues((amount, price) => ({
      amount,
      price
    }))
    .sortBy(['price'])
    .reverse()
    .value();
  return <Table columns={columns} dataSource={data} />;
};

export default Orderbook;
