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

const API_BASE_URL = 'https://e-health-backend-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Dynamically add token to each request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosErrorWithResponse) => {
    if (error.response?.status === 401) {
      message.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      // Optional: redirect to login
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

  const dispatch = useDispatch();

  const handleChange = (e: any) => setValue(e.target.value);

  const submitReport = async (report: Report): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (report.type && report.date && report.time && report.location && report.description) {
      try {
        const hideLoading = message.loading('Saving report...', 0);
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/report', report);
        hideLoading();

        if (response.data.success) {
          message.success("Report generated and saved successfully");
          return { success: true, data: response.data.data };
        } else {
          message.error(response.data.message || "Failed to save report");
          return { success: false, error: response.data.message };
        }
      } catch (error: any) {
        const err = error as AxiosErrorWithResponse;
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
    } else {
      message.error("Please fill all required fields");
      return { success: false, error: "Missing required fields" };
    }
  };

  const handleSubmit = async () => {
    if (value && selectedDate && selectedTime && inputValue && description) {
      const newReport: Report = {
        type: value,
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedTime.format('HH:mm'),
        reportToHR: switch1,
        anonymous: switch2,
        location: inputValue,
        description,
        involvedParties: involvedParties, // always a string[]
      };

      dispatch(addReport({ ...newReport, involvedParties: involvedParties ?? [] }));
      const result = await submitReport(newReport);

      if (result.success) {
        setValue(""); setSelectedDate(null); setSelectedTime(null); setSwitch1(false); setSwitch2(false);
        setInputValue(""); setDescription(""); setInvolvedParties([]);
        onClose();
      }
    } else {
      message.error("Please fill all required fields");
    }
  };

  return (
    <Drawer
      open={visible}
      title={
        <div className="flex justify-between items-center">
          <span>Create Report</span>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
            <Button type="primary" style={{ background: "black" }} onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
    >
      <Radio.Group onChange={handleChange} value={value}>
        <div className="flex space-x-6">
          <div className="w-[215px] h-[118px] p-[12px] border-2 border-black">
            <Radio value={"option1"}><span className="text-lg font-bold">Hazard Incident</span></Radio>
            <p className="text-xs mt-4">Any issue with your environment in the office e.g. broken equipment</p>
          </div>
          <div className="w-[215px] h-[118px] p-[12px] border-2 border-black">
            <Radio value={"option2"}><span className="text-lg font-bold">Safety Incident</span></Radio>
            <p className="text-xs mt-4">Issues within your personal space e.g. bullying.</p>
          </div>
        </div>
      </Radio.Group>

      <hr className="my-5" />
      <h3 className="mb-2 text-lg">Date & Time</h3>
      <div className="flex">
        <DatePicker value={selectedDate} onChange={setSelectedDate} className="w-[255px] mr-4" />
        <TimePicker value={selectedTime} onChange={setSelectedTime} className="w-[255px]" />
      </div>

      <SafteyUpload involvedParties={involvedParties} setInvolvedParties={setInvolvedParties} />

      <div className="flex justify-between items-center p-4">
        <div>
          <Switch checked={switch1} onChange={setSwitch1} style={{ backgroundColor: switch1 ? "black" : "gray" }} />
          <span className="ml-2">Report directly to HR</span>
        </div>
        <div>
          <Switch checked={switch2} onChange={setSwitch2} style={{ backgroundColor: switch2 ? "black" : "gray" }} />
          <span className="ml-2">Report anonymously</span>
        </div>
      </div>

      <div className="h-[64px] bg-[#E6F7FF] flex items-center p-4">
        <InfoCircleOutlined className="mr-4" />
        <span>This report is submitted anonymously unless you toggle it off.</span>
      </div>

      <div className="mb-4 mt-4">
        <h2 className="text-xl mb-2">Location</h2>
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter Location..." />
      </div>

      <div className="mb-4 mt-4">
        <h2 className="text-xl mb-2">Description</h2>
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>
    </Drawer>
  );
};

export default ReportSidebar;
