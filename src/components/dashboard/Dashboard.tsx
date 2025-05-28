import { Space } from "antd";
import NotificationCard from "../../Component/Notificationcard/NotificationCard";
import Appointment from "../DashboardCard/DataAppointment/Appointment";
import DataCourse from "../DashboardCard/DataAppointment/DataCourse";
import DataReport from "../DashboardCard/DataAppointment/DataReport";
import LeadboardCard from "../DashboardCard/LeadboardCard";
import PeriphalCard from "../DashboardCard/PeriphalCard";
import ProfileCard from "../DashboardCard/ProfileCard";
import StatsCard from "../DashboardCard/StatsCard";

export const Dashboard = () => {
  return (
    <div className="justify-start pt-2 items-center  bg-gray-100 h-screen px-10 max-lg:px-1">
      <NotificationCard />

      <Space direction="vertical" size={1}>
        <Space direction="horizontal" size={24} wrap>
          <Space
            direction="vertical"
            size={5}
            style={{ marginBottom: "20px", background: "#ececec" }}
            className="-mt-80"
          >
            <ProfileCard />
            <StatsCard />
          </Space>
          {/* <AppointmentCard /> */}
          <Appointment />
          {/* <CourseCard /> */}
          <DataCourse />
        </Space>
        <Space
          direction="horizontal"
          size={24}
          className="flex max-lg:flex-col"
        >
          <LeadboardCard />
          <PeriphalCard />
          <DataReport />
          {/* <ReportCard /> */}
        </Space>
      </Space>
    </div>
  );
};
