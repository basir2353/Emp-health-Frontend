import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Callchat from "./Component/ChatBox/CallChat/Callchat";
import MessagingSection from "./Component/ChatBox/Massage";
import CreateAppointments from "./Component/CreateAppointemts/CreateAppointemnt";
import Layout from "./Component/Steps/Layout";
import StepEight from "./Component/Steps/StepEight";
import StepFive from "./Component/Steps/StepFive";
import StepFour from "./Component/Steps/StepFour";
import StepNine from "./Component/Steps/StepNine";
import StepOne from "./Component/Steps/StepOne";
import StepSeven from "./Component/Steps/StepSeven";
import StepSix from "./Component/Steps/StepSix";
import StepThree from "./Component/Steps/StepThree";
import StepTwo from "./Component/Steps/StepTwo";
import Health from "./components/DashboardCard/Health/Health";
import Insurance from "./components/DashboardCard/InsurancePlan/Insurance";
import Notification from "./components/DashboardCard/Notification/Notification";
import ScheduleAppointments from "./components/DashboardCard/ScheduleAppointment/ScheduleAppointments";
import ScheduleCalnder from "./components/DashboardCard/ScheduleCalnder/ScheduleCalnder";
import SafetyDashboard from "./components/Saftey/SafetyDashboard/SafetyDashboard";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Doctors } from "./components/dashboard/Doctors";
import { ChatBoxLayout } from "./layout/chatbox";
import { DashboardLayout } from "./layout/dashboard";
import Wallnessdashboard from "./components/Wellness/Wellnessdashboard/WallnesDashboard";
import CourseDesign from "./Component/CourseCreation/Design";
import CourseCreate from "./Component/CourseCreation/Create";
import CourseView from "./Component/CourseCreation/View";
import Wellness from "./components/Wellness/WellnessMain/WellnesMain";
import HealthForum from "./Component/Health Forum/Healthforum";
import BudgetPlanner from "./Component/Budget Planner/Budgetplanner";
import FilesTable from "./Component/DocumentRepository/Documentrepository";
import Polls from "./Component/Polls/Polls";
import Challenges from "./Component/Challenges/Challenges";
import MyBoard from "./Component/MyBoard/Myboard";
import Login from "./Component/Login/Login"; // You'll need to create this component
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import NotificationProvider from "./components/Notification/NotificationProvider";

import RegisterForm from "./Component/RegisterForm/RegisterForm";
import Call from "./Call/Call";
import CallTest from "./Call/CallTest";
import ForgetPassword from "./Component/Login/ForgetPassword";
import ResetPassword from "./Component/Login/ResetPassword";
import RoomWrapper from "./Call/RoomWrapper";
import UserMessage from "./Component/ChatBox/Massage";

const App: React.FC = () => (
  
  <div className="App mx-auto">
    <div>
      <Router>
        <NotificationProvider>
          <Routes>
          {/* Auth Routes */}
          {/* Register */}
           <Route path="/room/:id" element={<RoomWrapper />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path='/forget-password' element={<ForgetPassword/>}/>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute requiredRole={"employee"}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<StepOne />} />
                    <Route path="/step-2" element={<StepTwo />} />
                    <Route path="/step-3" element={<StepThree />} />
                    <Route path="/step-4" element={<StepFour />} />
                    <Route path="/step-5" element={<StepFive />} />
                    <Route path="/step-6" element={<StepSix />} />
                    <Route path="/step-7" element={<StepSeven />} />
                    <Route path="/step-8" element={<StepEight />} />
                    <Route path="/step-9" element={<StepNine />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Health Dashboard - accessible by employees */}
          <Route
            path="/health/*"
            element={
              <ProtectedRoute requiredRole="employee">
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/doctors" element={<Doctors />} />
                      <Route path="/schedule-appointments" element={<CreateAppointments />} />
                    <Route path="/schedule" element={<ScheduleCalnder />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/notification" element={<Notification />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* CAll */}

          {/* Chat/Inbox Routes */}
          <Route
            path="/inbox/*"
            element={
              <ProtectedRoute>
                <ChatBoxLayout>
                  <Routes>
                    <Route path="/" element={<UserMessage />} />
                    <Route path="/messages" element={<MessagingSection />} />
                    <Route path="/call2" element={<Callchat />} />
                    <Route path="/call" element={<Call />}/>
                    <Route path="/call-test" element={<CallTest />}/>

                  </Routes>
                </ChatBoxLayout>
              </ProtectedRoute>
            }
          />

          {/* Safety Dashboard */}
          <Route
            path="/safety/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<SafetyDashboard />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Wellness Routes */}
          <Route
            path="/wellness/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Wellness />} />
                    <Route path="/course" element={<Wallnessdashboard />} />
                    <Route path="/course/design" element={<CourseDesign />} />
                    <Route path="/course/create" element={<CourseCreate />} />
                    <Route path="/course/view" element={<CourseView />} />
                    <Route path="/forum" element={<HealthForum />} />
                    <Route path="/expense" element={<BudgetPlanner />} />
                    <Route path="/poll" element={<Polls />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/board" element={<MyBoard />} />
                    <Route path="/document" element={<FilesTable />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    {/* <Route path="/schedule-appointments" element={<CreateAppointments />} /> */}
                    <Route path="/schedule-appointments" element={<ScheduleAppointments />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/appointments" element={<Health />} />
                    <Route path="/schedule" element={<ScheduleCalnder />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/notification" element={<Notification />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Doctor Dashboard */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/schedule-appointments" element={<ScheduleAppointments />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/appointments" element={<Health />} />
                    <Route path="/schedule" element={<ScheduleCalnder />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/notification" element={<Notification />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </Router>
    </div>
  </div>
);

export default App;