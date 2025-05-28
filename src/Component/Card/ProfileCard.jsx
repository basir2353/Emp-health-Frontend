import React from "react";
import { CheckCircleFilled, EditOutlined } from "@ant-design/icons";
import { Button, Progress } from "antd";

const ProfileCard = () => {
  return (
    <div
      style={{
        height: "180px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "12px",
        position: "relative",
        background: "#141414", // Background color
        color: "white", // Text color
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "88px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "12px",
            border: "2px solid #1890ff",
          }}
        >
          <img
            src="/profile.jpeg"
            alt="Profile"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            Hello john!
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ fontSize: "14px", marginBottom: "6px" }}>
              Blood Group : O -
            </div>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "6px",
                marginLeft: "10px",
              }}
            >
              Height: 171 cm
            </div>
          </div>
          <div style={{ fontSize: "14px", marginBottom: "6px" }}>
            Weight: 80 kg
          </div>
        </div>
        <Button
          style={{
            border: "none",
            borderRadius: "4px",
            padding: "6px 10px",
            marginLeft: "12px",
          }}
        >
          <EditOutlined style={{ marginRight: "5px" }} />
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <span
            style={{ fontSize: "14px", marginBottom: "10px", textAlign: "center"}}
          >
            Profile Completion
          </span>
          <Progress
          style={{padding:'1'}}
            percent={50}
            status="normal"
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#fff',
            }}
            showInfo={false} // Hides the progress text

            trailColor="#fff"
          />
        </div>

        <svg width="36" height="43" viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute", right:'5' ,marginTop:'23'}}>
          <path d="M28.3843 27.7178H8.22046V38.0854C8.22046 40.2528 10.4484 41.705 12.4314 40.8301L17.3593 38.656C18.1526 38.3061 19.0585 38.3164 19.8435 38.6844L24.111 40.6848C26.1004 41.6173 28.3843 40.1655 28.3843 37.9684V27.7178Z" fill="#D46B08"/>
          <circle cx="18.3024" cy="17.6359" r="17.4142" fill="#FFDE99"/>
          <circle cx="18.3025" cy="17.6358" r="15.5811" fill="url(#paint0_linear_332_8971)"/>
          <circle cx="18.3024" cy="17.6364" r="5.37074" fill="#D9D9D9" fillOpacity="0.15"/>
          <circle cx="18.3025" cy="17.6356" r="7.40511" fill="#D9D9D9" fillOpacity="0.15"/>
          <circle cx="18.3025" cy="17.6361" r="9.76499" fill="#D9D9D9" fillOpacity="0.15"/>
          <circle cx="18.3026" cy="17.6365" r="12.6131" fill="#D9D9D9" fillOpacity="0.15"/>
          <circle cx="18.3025" cy="17.6361" r="14.7289" fill="#D9D9D9" fillOpacity="0.15"/>
          <path d="M13.7197 17.636L16.7713 20.9967L22.8851 14.2754" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_332_8971" x1="32.5088" y1="17.6358" x2="2.72131" y2="17.6358" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFAE00"/>
              <stop offset="1" stopColor="#FF8C00"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ProfileCard;
