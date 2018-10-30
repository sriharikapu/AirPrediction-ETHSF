import React from "react";
import _ from "lodash";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Progress,
  Radio,
  Row,
  Col
} from "antd";
import { database } from "../services/market";

import Orderbook from "./Orderbook";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Market extends React.Component {
  submitOrder = () => {
    const { market, form, user } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        database.ref(`markets/${market.id}/orders`).push({
          ...values,
          user,
          time: new Date()
        });
        form.resetFields();
      }
    });
  };

  render = () => {
    const { market, form } = this.props;
    const { getFieldDecorator } = form;

    const orders = _.groupBy(market.orders, "prediction");
    return (
      <>
        <Card title={market.question}>
          <Progress percent={market.rate * 100} />
        </Card>
        <Row gutter={8}>
          <Col span={12}>
            <Card title="Place Order">
              <Form>
                <FormItem label="Prediction">
                  {getFieldDecorator("prediction", {
                    rules: [{ required: true }]
                  })(
                    <RadioGroup>
                      <RadioButton value="yes">Yes</RadioButton>
                      <RadioButton value="no">No</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="Price">
                  {getFieldDecorator("price", {
                    rules: [{ required: true }]
                  })(<InputNumber min={0} max={1} step={0.001} />)}
                </FormItem>
                <FormItem label="Amount">
                  {getFieldDecorator("amount", {
                    rules: [{ required: true }]
                  })(<InputNumber min={1} />)}
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.submitOrder}>
                    Submit
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Orderbook">
              <Row gutter={8}>
                <Col span={12}>
                  <Orderbook orders={orders.yes} />
                </Col>
                <Col span={12}>
                  <Orderbook orders={orders.no} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </>
    );
  };
}

export default Form.create()(Market);
