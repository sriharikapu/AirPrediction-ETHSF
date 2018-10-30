import React from "react";
import { Select, Form, Modal, Input } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

export const CATEGORIES = ["Sports", "Cryptocurrencies", "Weather"];

const MarketModal = ({ form, visible, createMarket, toggleMarketModal }) => {
  const { getFieldDecorator, validateFields } = form;

  const onConfirm = () => {
    validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      createMarket(values);
      toggleMarketModal()
    });
  };

  return (
    <Modal title="Creaet Market" visible={visible} onOk={onConfirm} onCancel={toggleMarketModal}>
      <Form>
        <FormItem label="Question">
          {getFieldDecorator("question", {
            rules: [{ required: true }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Category">
          {getFieldDecorator("category", {
            rules: [{ required: true }]
          })(
            <Select onChange={this.handleSelectChange}>
              {CATEGORIES.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="Oracle">
          {getFieldDecorator("oracle", {
            rules: [{ required: true }]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(MarketModal);
