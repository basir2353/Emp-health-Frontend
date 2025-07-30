import React, { useState } from "react";
import { Button, DatePicker, TimePicker, Space, Typography } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

interface Break {
  id: string;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
}

interface ScheduleData {
  date: dayjs.Dayjs | null;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
  breaks: Break[];
}

interface UploadManualPopUpProps {
  closePopup: () => void;
  onSubmit: (data: ScheduleData) => void;
}

const UploadManualPopUp: React.FC<UploadManualPopUpProps> = ({
  closePopup,
  onSubmit,
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    date: null,
    startTime: null,
    endTime: null,
    breaks: [],
  });

  const addBreak = () => {
    setScheduleData(prev => ({
      ...prev,
      breaks: [...prev.breaks, {
        id: Date.now().toString(),
        startTime: null,
        endTime: null,
      }]
    }));
  };

  const removeBreak = (breakId: string) => {
    setScheduleData(prev => ({
      ...prev,
      breaks: prev.breaks.filter(breakItem => breakItem.id !== breakId)
    }));
  };

  const updateBreak = (breakId: string, field: 'startTime' | 'endTime', value: dayjs.Dayjs | null) => {
    setScheduleData(prev => ({
      ...prev,
      breaks: prev.breaks.map(breakItem =>
        breakItem.id === breakId ? { ...breakItem, [field]: value } : breakItem
      )
    }));
  };

  const handleSubmit = () => {
    onSubmit(scheduleData);
    closePopup();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <Title level={4} className="mb-0">Uploading Schedule</Title>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date:
            </label>
            <DatePicker
              value={scheduleData.date}
              onChange={(date) => setScheduleData(prev => ({ ...prev, date }))}
              placeholder="Select date"
              className="w-full"
              format="YYYY-MM-DD"
            />
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time:
              </label>
              <TimePicker
                value={scheduleData.startTime}
                onChange={(time) => setScheduleData(prev => ({ ...prev, startTime: time }))}
                placeholder="Select Time"
                className="w-full"
                format="HH:mm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time:
              </label>
              <TimePicker
                value={scheduleData.endTime}
                onChange={(time) => setScheduleData(prev => ({ ...prev, endTime: time }))}
                placeholder="Select Time"
                className="w-full"
                format="HH:mm"
              />
            </div>
          </div>

          {/* Breaks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breaks:
            </label>
            <div className="space-y-3">
              {scheduleData.breaks.map((breakItem) => (
                <div key={breakItem.id} className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                    <TimePicker
                      value={breakItem.startTime}
                      onChange={(time) => updateBreak(breakItem.id, 'startTime', time)}
                      placeholder="Select Time"
                      className="w-full"
                      format="HH:mm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End time</label>
                    <TimePicker
                      value={breakItem.endTime}
                      onChange={(time) => updateBreak(breakItem.id, 'endTime', time)}
                      placeholder="Select Time"
                      className="w-full"
                      format="HH:mm"
                    />
                  </div>
                  <button
                    onClick={() => removeBreak(breakItem.id)}
                    className="col-span-2 text-red-500 text-sm hover:text-red-700"
                  >
                    Remove Break
                  </button>
                </div>
              ))}
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={addBreak}
                className="w-full"
                style={{ borderColor: 'black', color: 'black' }}
              >
                Add Break
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button onClick={closePopup}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: 'black', borderColor: 'black' }}
          >
            Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadManualPopUp;