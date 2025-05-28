import React, { useState } from 'react';
import { Table, Drawer } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import UserDetailsSidebar from './UserDetailsSidebar'; // Import the sidebar component

interface User {
  name: string;
  avatar: string;
}

interface DataSourceItem {
  key: string;
  name: string;
  department: string;
  manager: User;
  points: string;
}

const BoardTable = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null);

  const showDrawer = (person: User) => {
    setSelectedPerson(person);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DataSourceItem) => (
        <div className="flex items-center" onClick={() => showDrawer(record.manager)}>
          <span className="">{text}</span>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: User) => (
        <div className="flex items-center">
          <span className="ml-2">{manager.name}</span>
        </div>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
  ];

  const dataSource: DataSourceItem[] = [
    {
      key: '1',
      name: 'Jane Doe',
      department: 'Sales',
      manager: { name: 'John Doe', avatar: 'https://zos.alipay.com/v2/avatar_signin.svg' },
      points: '560',
    },
    {
      key: '2',
      name: 'John Smith',
      department: 'Marketing',
      manager: { name: 'Alice Johnson', avatar: 'https://zos.alipay.com/v2/avatar_signin.svg' },
      points: '720',
    },
    {
      key: '3',
      name: 'Emily Brown',
      department: 'Finance',
      manager: { name: 'David Miller', avatar: 'https://zos.alipay.com/v2/avatar_signin.svg' },
      points: '480',
    },
    {
      key: '4',
      name: 'Michael Lee',
      department: 'Operations',
      manager: { name: 'Sarah Wilson', avatar: 'https://zos.alipay.com/v2/avatar_signin.svg' },
      points: '630',
    },
  ];

  return (
    <div className="mx-10 mt-10 max-lg:mx-1">
      <div className="container mx-auto">
        <Table
          columns={columns}
          pagination={false}
          dataSource={dataSource}
    scroll={{ x: true }} // Enable horizontal scrolling

        />
      </div>
      <Drawer
        title="User Details"
        placement="right"
        width={500}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        {selectedPerson && <UserDetailsSidebar user={selectedPerson} visible={drawerVisible} onClose={closeDrawer} />}
      </Drawer>
    </div>
  );
};

export default BoardTable;
