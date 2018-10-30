import React from "react";
import { Form, Modal, Input } from "antd";

const FormItem = Form.Item;

const UserModal = ({ form, user, save }) => {
  const { getFieldDecorator, validateFields } = form;

  const onConfirm = () => {
    validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
      save(values);
    });
  };

  return (
    <Modal title="User Info" visible={!user} onOk={onConfirm}>
      <Form>
        <FormItem label="Port">
          {getFieldDecorator("port", {
            rules: [{ required: true, message: "Please input your port!" }]
          })(<Input />)}
        </FormItem>
        <FormItem label="Address">
          {getFieldDecorator("address", {
            rules: [{ required: true, message: "Please input your address!" }]
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(UserModal);
