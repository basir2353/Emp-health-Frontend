import React from "react";
import { Card, Typography, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

const Course = () => {
  return (
    <Card style={{ width: 670, height: 418 }}>
      <Title level={3} style={{margin:'0'}}>Enrolled Courses</Title>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E0E0E0" }}>
        <span>Report Number</span>
        <span>Status</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" , marginTop:'15px' }}>
        <img style={{ width: 337 }} src="/course.png" alt="Course" />
        <span style={{ marginTop: 10, color: "#525252", textAlign: "center", fontSize: 14 }}>
          You are currently not enrolled in any courses. You can enroll in a course.
        </span>
        <Button type="primary" style={{ marginTop: 27, background: "#141414", border: "1px solid #141414", borderRadius: 4 }}>
          Enroll Now
        </Button>
      </div>
    </Card>
  );
};

export default Course;
