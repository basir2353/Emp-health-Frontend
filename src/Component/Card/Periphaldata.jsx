import React from "react";
import { Card, Typography, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

const PeripheralData = () => {
  return (
    <Card       style={{
        width: 670,
        minHeight: 426,
        padding: "12px",
        boxSizing: "border-box",
        marginTop: "23px",
        border: "1px solid #ddd",
       
      }}>
      <Title level={3} style={{margin:'0'}}>Peripheral Data </Title>
   
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" , marginTop:'15px' }}>
        <img style={{ width: 337 }} src="/periphal.png" alt="Course" />
        <span style={{ marginTop: 10, color: "#525252", textAlign: "center", fontSize: 14 ,width:'323px' }}>
        No Devices are connected to the system. Please connect the device to see your health data.
        </span>
        <Button type="primary" style={{ marginTop:'10px', background: "#141414", border: "1px solid #141414", borderRadius: 4 }}>
        Connect device
        </Button>
      </div>
    </Card>
  );
};

export default PeripheralData;
