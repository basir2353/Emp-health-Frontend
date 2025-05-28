import React from 'react';
import { Form, Input, Button, Drawer, Select } from 'antd';

interface AddExpenseDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (expense: { name: string; amount: string; category: string }) => void;
}

const AddExpenseDrawer: React.FC<AddExpenseDrawerProps> = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onAdd(values);
      form.resetFields();
      onClose();
    });
  };

  const headerButtons = (
    <>
      <Button onClick={onClose} style={{ marginRight: 8 }}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} type="primary" style={{background:'black'}}>
        Add
      </Button>
    </>
  );

  return (
    <Drawer
      title="Add New Expense"
      width={500}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 20 }}
      extra={headerButtons}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Expense Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter expense name" />
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select placeholder="Select a category">
            <Select.Option value="utilities">Utilities</Select.Option>
            <Select.Option value="rent">Rent</Select.Option>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="transport">Transport</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddExpenseDrawer;