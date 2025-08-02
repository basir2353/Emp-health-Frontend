import React, { useState } from "react";
import { Button, Drawer, Radio, DatePicker, TimePicker, Switch, Input, message } from "antd";
import { Dayjs } from "dayjs";
import SafteyUpload from "./safteyUpload";
import axios, { AxiosResponse } from 'axios';
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addReport } from "../../../redux/appointments/appointmentSlice";

interface ReportSidebarProps {
  visible: boolean;
  onClose: () => void;
}

export interface Report {
  title: string;
  type: string;
  date: string;
  time: string;
  reportToHR: boolean;
  anonymous: boolean;
  location: string;
  description: string;
  involvedParties?: string[];
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

interface AxiosErrorWithResponse extends Error {
  code: string;
  response?: {
    status: number;
    data: { message?: string };
  };
  request?: any;
}

const API_BASE_URL = 'https://empolyee-backedn.onrender.com//api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_real');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosErrorWithResponse) => {
    if (error.response?.status === 401) {
      message.error('Session expired. Please login again.');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

const ReportSidebar: React.FC<ReportSidebarProps> = ({ visible, onClose }) => {
  const [value, setValue] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [involvedParties, setInvolvedParties] = useState<string[]>([]);
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e: any) => setValue(e.target.value);

  const submitReport = async (report: Report): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const hideLoading = message.loading('Saving report...', 0);
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/report', report);
      hideLoading();

      if (response.data.success || response.data) {
        message.success("Report generated and saved successfully");
        return { success: true, data: response.data.data };
      } else {
        message.error("Failed to save report");
        return { success: false};
      }
    } catch (error: any) {
      const err = error as AxiosErrorWithResponse;
      console.error("Report submission error:", err);

      if (err.code === 'ECONNABORTED') {
        message.error('⏱️ Request timed out. Server may be slow.');
      } else if (err.response) {
        message.error(err.response.data.message || '⚠️ Server error occurred');
      } else if (err.request) {
        message.error('📡 Network error. Please check your connection.');
      } else {
        message.error('❗ Unexpected error occurred');
      }
      return { success: false, error: err.message };
    }
  };

  const handleSubmit = async () => {
    if (!title || !value || !selectedDate || !selectedTime || !inputValue || !description) {
      message.error("Please fill all required fields");
      return;
    }

    const newReport: Report = {
      title,
      type: value,  // <--- FIXED: send the exact value ('hazard' or 'safety')
      date: selectedDate.format('YYYY-MM-DD'),
      time: selectedTime.format('HH:mm'),
      reportToHR: switch1,
      anonymous: switch2,
      location: inputValue,
      description,
      involvedParties: involvedParties ?? [],
    };

    setIsSubmitting(true);
    const result = await submitReport(newReport);
    if (result.success) {
      dispatch(addReport({ ...newReport, involvedParties: involvedParties ?? [] }));
      setValue("");
      setSelectedDate(null);
      setSelectedTime(null);
      setSwitch1(false);
      setSwitch2(false);
      setInputValue("");
      setDescription("");
      setTitle("");
      setInvolvedParties([]);
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <Drawer
      open={visible}
      title={
        <div className="flex justify-between items-center">
          <span>Create Report</span>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
            <Button
              type="primary"
              style={{ background: "black" }}
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
    >
      <Radio.Group onChange={handleChange} value={value} className="flex space-x-4">
        <div className={`w-1/2 border p-4 rounded ${value === "hazard" ? "border-black" : "border-gray-300"}`}>
          <Radio value="hazard"><span className="text-lg font-semibold">Hazard</span></Radio>
          <p className="text-sm mt-2">Hazard like broken equipment or unsafe work environment.</p>
        </div>
        <div className={`w-1/2 border p-4 rounded ${value === "safety" ? "border-black" : "border-gray-300"}`}>
          <Radio value="safety"><span className="text-lg font-semibold">Safety</span></Radio>
          <p className="text-sm mt-2">Issues like bullying or personal safety threats.</p>
        </div>
      </Radio.Group>
      <div className="mb-4 mt-4">
        <label className="block text-md mb-1 font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for the report"
          disabled={isSubmitting}
        />
      </div>
      <div className="my-4">
        <label className="block text-md mb-1 font-medium">Date & Time</label>
        <div className="flex gap-4">
          <DatePicker value={selectedDate} onChange={setSelectedDate} className="w-1/2" disabled={isSubmitting} />
          <TimePicker value={selectedTime} onChange={setSelectedTime} className="w-1/2" disabled={isSubmitting} />
        </div>
      </div>
      <SafteyUpload involvedParties={involvedParties} setInvolvedParties={setInvolvedParties} />
      <div className="flex items-center justify-between my-4">
        <label className="flex items-center gap-2">
          <Switch checked={switch1} onChange={setSwitch1} disabled={isSubmitting} />
          Report to HR
        </label>
        <label className="flex items-center gap-2">
          <Switch checked={switch2} onChange={setSwitch2} disabled={isSubmitting} />
          Report Anonymously
        </label>
      </div>
      <div className="flex items-center gap-2 bg-blue-50 p-3 rounded mb-4">
        <InfoCircleOutlined />
        <span className="text-sm">This report will be submitted anonymously unless toggled off.</span>
      </div>
      <div className="mb-4">
        <label className="block text-md mb-1 font-medium">Location</label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Location"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-md mb-1 font-medium">Description</label>
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident"
          rows={4}
          disabled={isSubmitting}
        />
      </div>
    </Drawer>
  );
};

export default ReportSidebar;
