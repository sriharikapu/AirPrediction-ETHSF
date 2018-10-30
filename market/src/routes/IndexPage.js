import React from "react";
import { connect } from "dva";
import styles from "./IndexPage.css";
import { Layout, Menu, Icon } from "antd";

import UserModal from "../components/UserModal";
import MarketModal, { CATEGORIES } from "../components/MarketModal";
import MarketList from "../components/MarketList";
import Market from "../components/Market";
import { database } from "../services/market";

const { Header, Content, Sider } = Layout;

class IndexPage extends React.Component {
  state = {
    selectedCategory: CATEGORIES[0],
    balance: {}
  };

  saveUser = user => {
    const { dispatch } = this.props;
    dispatch({
      type: "market/save",
      payload: { user }
    });
    database.ref(user.port).on("value", data => {
      this.setState({
        balance: data.val()
      });
    });
  };

  toggleMarketModal = () => {
    this.setState({
      showMarketModal: !this.state.showMarketModal
    });
  };

  createMarket = payload => {
    const { dispatch, market } = this.props;
    payload.creator = market.user;
    payload.rate = "0.5";
    dispatch({
      payload,
      type: "market/createMarket"
    });
  };

  selectCategory = category => {
    this.setState({
      selectedMarket: null,
      selectedCategory: category
    });
  };

  selectMarket = market => {
    this.setState({
      selectedMarket: market
    });
  };

  render = () => {
    const {
      balance,
      selectedCategory,
      selectedMarket,
      showMarketModal
    } = this.state;
    const { market } = this.props;
    return (
      <Layout>
        <Header className={styles.header}>
          Predict
          <span className={styles.status}>
            Free Balance: {balance.free} Locked Balance: {balance.locked}
          </span>
        </Header>
        <Layout className={styles.content}>
          <Sider>
            <Menu
              mode="inline"
              style={{ height: "100%" }}
              defaultSelectedKeys={[CATEGORIES[0]]}
            >
              {CATEGORIES.map(categeory => (
                <Menu.Item
                  key={categeory}
                  onClick={() => this.selectCategory(categeory)}
                >
                  {categeory}
                </Menu.Item>
              ))}
            </Menu>
            <div
              className="ant-layout-sider-trigger"
              style={{ width: 200 }}
              onClick={this.toggleMarketModal}
            >
              <Icon type="plus" />
            </div>
          </Sider>
          <Content>
            <UserModal user={market.user} save={this.saveUser} />
            <MarketModal
              visible={showMarketModal}
              createMarket={this.createMarket}
              toggleMarketModal={this.toggleMarketModal}
            />

            {selectedMarket ? (
              <Market
                market={market[selectedCategory][selectedMarket]}
                user={market.user}
              />
            ) : (
              <MarketList
                markets={market[selectedCategory]}
                selectedCategory={selectedCategory}
                selectMarket={this.selectMarket}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    );
  };
}

function mapStateToProps({ market }) {
  return { market };
}

export default connect(mapStateToProps)(IndexPage);
