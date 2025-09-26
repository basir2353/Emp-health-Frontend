import { Space } from "antd";
import NotificationCard from "../../Component/Notificationcard/NotificationCard";
import Appointment from "../DashboardCard/DataAppointment/Appointment";
import DataCourse from "../DashboardCard/DataAppointment/DataCourse";
import DataReport from "../DashboardCard/DataAppointment/DataReport";
import LeadboardCard from "../DashboardCard/LeadboardCard";
import PeriphalCard from "../DashboardCard/PeriphalCard";
import ProfileCard from "../DashboardCard/ProfileCard";
import StatsCard from "../DashboardCard/StatsCard";
import { useEffect } from "react";

export const Dashboard = () => {


  const getUser = localStorage.getItem("loggedInUser");
  const extractNineStep = localStorage.getItem("onboardingSteps");

  let extractNineStepData: any = null;
  let extractUser: any = null;
  let extractUserId: any = null;
  
  try {
    extractNineStepData = extractNineStep ? JSON.parse(extractNineStep) : null;
    extractUser = getUser ? JSON.parse(getUser) : null;
    extractUserId = extractUser ? extractUser.id : null;
  } catch (error) {
    console.error("Failed to parse onboardingSteps:", error);
    extractNineStepData = null;
  }
  
  console.log("this is the nine step data:", extractNineStepData);
  // Function to store a single step
const storeOnboardingStep = async (userId:any, stepData:any) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        step: stepData.step,
        data: stepData
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Step stored successfully:', result.data);
      return result.data;
    } else {
      console.error('Error storing step:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to store onboarding step:', error);
    throw error;
  }
};
  


useEffect(()=>{
  storeOnboardingStep(extractUserId, extractNineStepData)
},[extractUserId])
  return (
    <div className="justify-start pt-2 items-center bg-gray-100 h-screen px-10 max-lg:px-1">
      <NotificationCard />

      <Space direction="vertical" size={1} className="w-full">
        {/* Row 1 */}
        <Space
          direction="horizontal"
          size={24}
          wrap
          className="max-lg:!flex max-lg:!flex-col -"
        >
          <Space
            direction="vertical"
            size={5}
            style={{ background: "#ececec" }}
            className=" max-lg:!w-full "
          >
            <ProfileCard />
            <StatsCard />
          </Space>

          <div className="max-lg:w-full flex align-middle justify-center gap-4 max-lg:flex-col -mb-14">
            <Appointment />
            <DataCourse />
          </div>
        </Space>

        {/* Row 2 */}
        <Space
          direction="horizontal"
          size={24}
          className="flex max-lg:flex-col mt-14"
        >
          <div className="max-lg:w-full">
            <LeadboardCard />
          </div>
          <div className="max-lg:w-full">
            <PeriphalCard />
          </div>
          <div className="max-lg:w-full">
            <DataReport />
          </div>
        </Space>
      </Space>
    </div>
  );
};
