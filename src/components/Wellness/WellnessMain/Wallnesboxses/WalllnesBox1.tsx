import React, { useState } from 'react';
import { FileTextOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Input, DatePicker } from 'antd';

function DynamicGoalsComponent() {
  const [goals, setGoals] = useState([
    { title: 'Read for 100 pages daily', description: 'Lorem ipsum.....', date: '20/12/2023' },
    { title: 'Drink 15 glasses of water daily', description: 'Lorem ipsum.....', date: '' },
    { title: 'Meeting with Dane', description: 'Meet with Dane on the health appointment issue', date: '' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', date: '' });

  const addGoal = () => {
    setGoals([...goals, newGoal]);
    setNewGoal({ title: '', description: '', date: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="justify-between flex flex-col">
      <Card className="w-[379px] h-full max-lg:w-auto border border-gray-300">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-normal text-[#8F8F8F]">Your Goals</h3>
          <Button
            type="default"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Goal
          </Button>
        </div>

        {goals.map((goal, index) => (
          <div key={index} className="flex flex-col px-4 border-b border-gray-200 pb-3 ml-3 mt-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <FileTextOutlined className="text-3xl" />
                <div className="flex flex-col gap-2">
                  <h5 className="font-medium text-base text-black">{goal.title}</h5>
                  <p className="font-normal text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>
              <input type="checkbox" className="w-6 h-6" />
            </div>
            {goal.date && <p className="font-normal text-xs text-gray-600">{goal.date}</p>}
          </div>
        ))}

        <Modal
          title="Add New Goal"
          open={isModalOpen}
          onOk={addGoal}
          onCancel={() => setIsModalOpen(false)}
        >
          <Input
            placeholder="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <Input.TextArea
            rows={3}
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date, dateString) =>
              setNewGoal({ ...newGoal, date: typeof dateString === 'string' ? dateString : '' })
            }
          />
        </Modal>
      </Card>
    </div>
  );
}

export default DynamicGoalsComponent;
