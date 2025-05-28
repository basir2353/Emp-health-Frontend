import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import ProfileCard from "./ProfileCard";
import StatsBox from "./Stats";
import HealthyLeadBoard from "./LeaderBoard";
import Apponiments from "./Apponiments";
import Course from "./Course";
import Periphaldata from "./Periphaldata";
import Report from "./Report";

// Remove the duplicate import statement
// import { Layout } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const Dashboard: React.FC = () => {
  return (
    <Layout 
    style={{ background: "#fff" ,marginBottom: "10px" }}
    
    >
      <Sider
        width={391}
        style={{ background: "#fff", marginLeft: "20px", marginTop: "22px" }}
      >
        <ProfileCard />
        <StatsBox />
        <HealthyLeadBoard />
      </Sider>
      <Content style={{ padding: "0 24px", marginTop: "25px" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{}}>
            <Apponiments />
          </div>
          <div>
            <Course />
          </div>
          <div>
            <Periphaldata />
          </div>
          <div>
            <Report />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
