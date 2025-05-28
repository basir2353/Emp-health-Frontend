import React from 'react';
import { Form, Input, Button, Drawer, Select } from 'antd';
interface AddIncomeDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (income: { source: string; amount: string }) => void;
}

const AddIncomeDrawer: React.FC<AddIncomeDrawerProps> = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onAdd(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Drawer title="Add Income" onClose={onClose} open={visible}>
      <Form form={form} layout="vertical">
        <Form.Item name="source" label="Source" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddIncomeDrawer;
