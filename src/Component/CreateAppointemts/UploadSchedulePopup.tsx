import { Button, DatePicker, Form, Input, Modal, TimePicker } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface UploadSchedulePopupProps {
  closePopup: () => void;
  onSubmit: (scheduleData: any) => Promise<void>;
}

const UploadSchedulePopup: React.FC<UploadSchedulePopupProps> = ({
  closePopup,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [breaks, setBreaks] = useState([{ startTime: null, endTime: null }]);

  const handleAddBreak = () => {
    setBreaks([...breaks, { startTime: null, endTime: null }]);
  };

  const handleBreakChange = (index: number, field: string, value: any) => {
    const newBreaks = [...breaks];
    // newBreaks[index][field] = value ? value.format("HH:mm") : null;
    setBreaks(newBreaks);
  };

  const onFinish = async (values: any) => {
    const scheduleData = {
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      breaks: breaks.filter((b) => b.startTime && b.endTime),
    };
    await onSubmit(scheduleData);
    form.resetFields();
    setBreaks([{ startTime: null, endTime: null }]);
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
          Neurologist
        </div>
      }
      open={true}
      onCancel={closePopup}
      footer={null}
      width={400}
      style={{ top: 20 }} // Adjust position to match the design
      bodyStyle={{ padding: "20px" }} // Match padding from design
    >
      <Form
        form={form}
        name="uploadSchedule"
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: "100%" }}
      >
        <Form.Item
          name="date"
          label={<span style={{ fontWeight: "bold" }}>Date:</span>}
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            style={{ width: "100%", height: "32px" }} // Match input height
            placeholder="Select date"
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <Form.Item
            name="startTime"
            label={<span style={{ fontWeight: "bold" }}>Start Time:</span>}
            rules={[{ required: true, message: "Please select a start time" }]}
            style={{ width: "48%" }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: "100%", height: "32px" }}
              placeholder="Select Time"
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label={<span style={{ fontWeight: "bold" }}>End Time:</span>}
            rules={[{ required: true, message: "Please select an end time" }]}
            style={{ width: "48%" }}
          >
            <TimePicker
              format="HH:mm"
              style={{ width: "100%", height: "32px" }}
              placeholder="Select Time"
            />
          </Form.Item>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold" }}>Breaks:</span>
            <Button
              type="primary"
              icon={null}
              onClick={handleAddBreak}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                padding: "0 12px",
                height: "32px",
                fontSize: "14px",
              }}
            >
              + Add Break
            </Button>
          </div>
          {breaks.map((breakItem, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>Start Time</span>}
                rules={[{ required: true, message: "Please select a start time" }]}
                style={{ width: "48%" }}
              >
                <TimePicker
                  format="HH:mm"
                  value={breakItem.startTime ? dayjs(breakItem.startTime, "HH:mm") : null}
                  onChange={(value) => handleBreakChange(index, "startTime", value)}
                  style={{ width: "100%", height: "32px" }}
                  placeholder="Select Time"
                />
              </Form.Item>
              <Form.Item
                label={<span style={{ fontWeight: "bold" }}>End time</span>}
                rules={[{ required: true, message: "Please select an end time" }]}
                style={{ width: "48%" }}
              >
                <TimePicker
                  format="HH:mm"
                  value={breakItem.endTime ? dayjs(breakItem.endTime, "HH:mm") : null}
                  onChange={(value) => handleBreakChange(index, "endTime", value)}
                  style={{ width: "100%", height: "32px" }}
                  placeholder="Select Time"
                />
              </Form.Item>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button
            onClick={closePopup}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "0 16px",
              height: "32px",
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "0 16px",
              height: "32px",
            }}
          >
            Add Entry
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UploadSchedulePopup;