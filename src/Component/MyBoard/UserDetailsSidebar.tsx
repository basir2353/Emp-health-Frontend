import React from 'react';
import { Drawer, Avatar, Button } from 'antd';

interface User {
  name: string;
  avatar: string;
}

interface UserDetailsProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

const UserDetailsSidebar: React.FC<UserDetailsProps> = ({ user, visible, onClose }) => {
  return (
    <Drawer
      title="User Details"
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={500}
    >
      <div>
        <div className="flex flex-col items-center mt-4 justify-between">
          <div className="w-full flex flex-col p-4">
            <div className="flex items-center justify-between">
              <div className='flex items-center'>
                <Avatar src={user.avatar} size={54} alt={`${user.name} avatar`} />
                <div className="ml-2">
                  <div className="text-lg font-bold">{user.name}</div>
                  <div className="text-sm font-bold">Restaurant</div>
                </div>
              </div>
              <div className="flex items-end mt-3">
                <img src="/dot1.png" className="w-6" alt="Points icon" />
                <div className="flex items-center ml-1 text-[#FA541C]">
                  <p className="mr-1">400</p>
                  <p>points</p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Button style={{ background: 'black', color: 'white' }} className='w-full'>Redeem</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4 justify-between opacity-20">
          <div className="w-full flex flex-col p-4">
            <div className="flex items-center justify-between">
              <div className='flex items-center'>
                <Avatar src='/many2.png' size={54} alt="Vacation package avatar" />
                <div className="ml-2">
                  <div className="text-lg font-bold">Vacation package to XYZ city</div>
                  <div className="text-sm font-bold">+ free food vouchers</div>
                </div>
              </div>
              <div className="flex items-end mt-3">
                <img src="/dot1.png" className="w-6" alt="Points icon" />
                <div className="flex items-center ml-1 text-[#FA541C]">
                  <p className="mr-1">560</p>
                  <p>points</p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Button className='w-full'>Redeem</Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default UserDetailsSidebar;
