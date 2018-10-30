import React from "react";
import _ from 'lodash'
import { Card, List, Progress } from "antd";

const MarketList = ({ markets, selectedCategory, selectMarket }) => {
  return (
    <Card title={selectedCategory}>
      <List
        itemLayout="horizontal"
        dataSource={_.values(markets) || []}
        renderItem={item => (
          <List.Item onClick={() => selectMarket(item.id)}>
            <List.Item.Meta
              title={item.question}
              description={(<Progress percent={item.rate * 100}/>)}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MarketList;
