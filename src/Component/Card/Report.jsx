import React from "react";
import { Card, Typography, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

function Report() {
  return (
    <Card
      style={{
        width: "375px",
        height: "426px",
        padding: "12px",
        boxSizing: "border-box",
        border: "1px solid #ddd",
        marginTop: "23px",
        marginLeft: "10px",
      }}
    >
      <Title level={3} style={{ margin: "0" }}>
        Reports
      </Title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 0,
        }}
      >
        <div
          style={{
            width: 237,
            height: 207,
            backgroundImage: 'url("/report.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0px 0px",
          }}
        >
          <p
            style={{
              width: 253,
              height: 44,
              fontFamily: "Satoshi",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "22px",
              textAlign: "center",
              color: "#525252",
            }}
          >
            You are currently have no reports to track. You can enroll in
            course.
          </p>
          <Button
            type="primary"
            style={{
              width: 147,
              height: 32,
              background: "#141414",
              border: "1px solid #141414",
              borderRadius: 4,
            }}
          >
            <span
              style={{
                width: 115,
                height: 22,
                fontFamily: "Satoshi",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "22px",
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              Report an Issue
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Report;
