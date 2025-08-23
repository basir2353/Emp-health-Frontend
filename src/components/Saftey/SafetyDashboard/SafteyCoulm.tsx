import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Card,
  Drawer,
  Table,
  Tag,
  Modal,
  message,
  Select,
  Spin,
} from "antd";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RedoOutlined,
  DeleteOutlined,
  BellOutlined,
} from "@ant-design/icons";
import DrAkhtar from "../../../public/images/Akhtar.svg";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "user";
}

interface Incident {
  key: string;
  name: string;
  incidentID: string;
  status: string;
  location: string;
  type: string;
  dateTime: string;
  action: React.ReactNode;
  description: string;
  involvedParties: string[];
  reportToHR?: boolean;
  anonymous?: boolean;
  reportedBy?: {
    name: string;
    email: string;
  };
  _id?: string;
  user: string;
  identityStatus?: "provided" | "declined" | null;
}

interface Notification {
  _id: string;
  message: string;
  timestamp: string;
  read: boolean;
  deny: boolean;
}

const { Column } = Table;
const { confirm } = Modal;
const { Option } = Select;

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Being Investigated", label: "Being Investigated" },
  { value: "Escalated", label: "Escalated" },
  { value: "Closed", label: "Closed" },
];

const getStatusTag = (status: string) => {
  let color, icon;
  switch (status) {
    case "Pending":
      color = "gold";
      icon = <ClockCircleOutlined />;
      break;
    case "Being Investigated":
      color = "cyan";
      icon = <RedoOutlined />;
      break;
    case "Escalated":
      color = "red";
      icon = <ArrowUpOutlined />;
      break;
    case "Closed":
      color = "green";
      icon = <CheckCircleOutlined />;
      break;
    default:
      color = "default";
      break;
  }
  return (
    <Tag
      color={color}
      icon={icon}
      style={{ minWidth: 80, textAlign: "center" }}
    >
      {status}
    </Tag>
  );
};

const SafetyBox: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"Detail" | "ActivityLog">(
    "Detail"
  );
  const [apiReports, setApiReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deny, SetIsDeny] = useState<boolean | null>(false);
  const [identityPopupVisible, setIdentityPopupVisible] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notif, setNotif] = useState<Notification[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [showAnonymousSection, setShowAnonymousSection] =
    useState<boolean>(true);
  const user = useMemo((): User => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser
        ? (JSON.parse(storedUser) as User)
        : {
            _id: "",
            name: "",
            email: "",
            role: "user",
          };
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return {
        _id: "",
        name: "",
        email: "",
        role: "user",
      };
    }
  }, []);

  const canModify = user.role === "admin" || user.role === "doctor";
  const isAdmin = user.role === "admin";
  const userEmail = user.email;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token_real");
      if (!token) {
        message.error("Authentication token missing. Please log in.");
        return;
      }

      const endpoint = canModify
        ? "https://empolyee-backedn.onrender.com/api/reports/all"
        : "https://empolyee-backedn.onrender.com/api/reports";

      const response = await axios.get(endpoint, {
        headers: { "x-auth-token": token },
      });
      setApiReports(response.data.reports || response.data);
      message.success("Reports fetched successfully");
    } catch (error: any) {
      console.error("Failed to fetch reports:", error);
      message.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [canModify]);

  const fetchNotifications = useCallback(
    async (incident: any) => {
      try {
        const token = localStorage.getItem("token_real");
        const rep_id = incident?._id;
        if (!token || !userEmail) {
          return;
        }

        const response = await axios.get(
          `https://empolyee-backedn.onrender.com/api/${userEmail}/notifications`,
          {
            headers: { "x-auth-token": token },
            params: { rep_id },
          }
        );
        console.log(response, "thttths");
        setNotif(response?.data?.notifications);
        const newNotifications: Notification[] =
          response.data.notifications || [];
        // setNotifications(newNotifications);

        const unreadNotification = newNotifications.find(
          (notif) => !notif.read
        );
        const isDeny = newNotifications.find((notif) => notif?.deny);
        if (isDeny) {
          const notificationToShow = unreadNotification || newNotifications[0];
          console.log(notificationToShow, "this is show");

          setNotificationMessage("you have already notify to admin");
          setIdentityPopupVisible(!!notificationToShow);
        } else {
          const notificationToShow = unreadNotification || newNotifications[0];
          setNotificationMessage(notificationToShow?.message || "");
          setIdentityPopupVisible(!!notificationToShow);
        }
      } catch (error: any) {
        console.error("Failed to fetch notifications:", error);
        message.error(
          error.response?.data?.message || "Failed to fetch notifications"
        );
      }
    },
    [userEmail]
  );

  const fetchNotificationsForAdmin = useCallback(
    async (daata: any) => {
      try {
        console.log(daata, "this data");
        const email = daata?.reportedBy?.email;
        const rep_id = daata?._id;

        const token = localStorage.getItem("token_real");
        if (!token || !userEmail) {
          return;
        }

        const response = await axios.get(
          `https://empolyee-backedn.onrender.com/api/${email}/notifications_admin`,
          {
            headers: { "x-auth-token": token },
            params: { rep_id },
          }
        );
        const newNotifications: Notification[] =
          response.data.notifications || [];
        setNotifications(newNotifications);

        const unreadNotification = newNotifications.find(
          (notif) => !notif.read
        );
        console.log(response, "thi888");
        const isDeny = newNotifications.find((notif) => notif?.deny);
        if (isDeny) {
          handleViewNotification();
          SetIsDeny(true);
        } else {
          const notificationToShow = unreadNotification || newNotifications[0];
          setNotificationMessage(notificationToShow?.message || "");
          setIdentityPopupVisible(!!notificationToShow);
        }
      } catch (error: any) {
        console.error("Failed to fetch notifications:", error);
        message.error(
          error.response?.data?.message || "Failed to fetch notifications"
        );
      }
    },
    [userEmail]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: string,
    incidentID: string
  ) => {
    confirm({
      title: "Update Status",
      content: `Are you sure you want to change the status of incident ${incidentID} to ${newStatus}?`,
      onOk: async () => {
        setUpdatingStatus(reportId);
        try {
          const token = localStorage.getItem("token_real");
          if (!token) {
            message.error("Authentication token missing");
            return;
          }

          await axios.patch(
            `https://empolyee-backedn.onrender.com/api/reports/${reportId}/status`,
            { status: newStatus },
            {
              headers: {
                "x-auth-token": token,
                "Content-Type": "application/json",
              },
            }
          );

          message.success(
            `Report ${incidentID} status updated to ${newStatus}`
          );
          await fetchReports();

          if (selectedIncident?._id === reportId) {
            setSelectedIncident({ ...selectedIncident, status: newStatus });
          }
        } catch (error: any) {
          console.error("Failed to update report status:", error);
          message.error(
            error.response?.data?.message || "Failed to update report status"
          );
        } finally {
          setUpdatingStatus(null);
        }
      },
    });
  };

  const handleDeleteReport = (reportId: string, incidentID: string) => {
    confirm({
      title: "Delete Report",
      content: `Are you sure you want to delete incident ${incidentID}? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeleting(reportId);
        try {
          const token = localStorage.getItem("token_real");
          if (!token) {
            message.error("Authentication token missing");
            return;
          }

          await axios.delete(
            `https://empolyee-backedn.onrender.com/api/reports/${reportId}`,
            {
              headers: { "x-auth-token": token },
            }
          );

          message.success("Report deleted successfully");
          await fetchReports();

          if (selectedIncident?._id === reportId) {
            setSidebarVisible(false);
            setSelectedIncident(null);
          }
        } catch (error: any) {
          console.error("Failed to delete report:", error);
          message.error(
            error.response?.data?.message || "Failed to delete report"
          );
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const handleIdentityResponse = async (approve: boolean) => {
    try {
      const token = localStorage.getItem("token_real");
      if (!token) {
        message.error("Authentication token missing");
        return;
      }

      const userId = selectedIncident?.reportedBy?.email;
      if (!userId) {
        message.error("User email not found");
        return;
      }

      await axios.patch(
        `https://empolyee-backedn.onrender.com/api/${userId}/identity`,
        { identityApproved: approve },
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      message.success(
        `Identity ${approve ? "provided" : "declined"} successfully`
      );
      await fetchReports();

      if (selectedIncident?.user === userId && selectedIncident) {
        setSelectedIncident({
          ...selectedIncident,
          identityStatus: approve ? "provided" : "declined",
        });
      }

      const notificationId = notifications.find(
        (n) => n.message === notificationMessage
      )?._id;
      if (notificationId) {
        await axios.patch(
          `https://empolyee-backedn.onrender.com/api/notifications/${notificationId}`,
          { read: true },
          { headers: { "x-auth-token": token } }
        );
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }

      setIdentityPopupVisible(false);
      setNotificationMessage("");
    } catch (error: any) {
      console.error("Failed to update identity status:", error);
      message.error(
        error.response?.data?.message || "Failed to update identity status"
      );
    }
  };

  const handleAskForIdentity = async () => {
    try {
      const token = localStorage.getItem("token_real");
      if (!token) {
        message.error("Authentication token missing");
        return;
      }

      const userId = selectedIncident?.reportedBy?.email;
      console.log(selectedIncident, "this is selected");
      if (!userId) {
        message.error("User email not found");
        return;
      }

      await axios.post(
        `https://empolyee-backedn.onrender.com/api/${userId}/notify`,
        {
          message: `${
            user.name || "Admin"
          } has pinged you to provide your identity for incident ${
            selectedIncident?.incidentID
          }.`,
          timestamp: new Date().toISOString(),
          reportId: selectedIncident?._id,
        },
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Notification sent to user");
    } catch (error: any) {
      console.error("Failed to send identity request:", error);
      message.error(
        error.response?.data?.message || "Failed to send identity request"
      );
    }
  };

  const handleSend = async (selectedIncident: Incident | null) => {
    console.log(selectedIncident, "this is data");

    try {
      const token = localStorage.getItem("token_real");
      if (!token) {
        message.error("Authentication token missing");
        return;
      }

      const userEmail = selectedIncident?.reportedBy?.email;
      const userName = selectedIncident?.reportedBy?.name;

      if (!userEmail) {
        message.error("User email not found");
        return;
      }

      await axios.post(
        `https://empolyee-backedn.onrender.com/api/${encodeURIComponent(
          userEmail
        )}/notify_admin`,
        {
          message: `${
            user.name || "Admin"
          } has pinged you to provide your identity for incident ${
            selectedIncident?.incidentID
          }.`,
          timestamp: new Date().toISOString(),
          userName: userName,
          reportId: selectedIncident?._id,
        },
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Notification sent to Admin");
      message.success(`${userName} has been approved`);
    } catch (error: any) {
      console.error("Failed to send identity request:", error);
      message.error(
        error.response?.data?.message || "Failed to send identity request"
      );
    }
  };

  const handleNotSend = async (data: any) => {
    setShowAnonymousSection(false);
    try {
      console.log(data, "this data");
      const email = data?.reportedBy?.email;
      const rep_id = data?._id;

      const token = localStorage.getItem("token_real");
      if (!token || !userEmail) {
        return;
      }

      const response = await axios.put(
        `https://empolyee-backedn.onrender.com/api/${email}/deny`,
        {},
        {
          headers: { "x-auth-token": token },
          params: { rep_id },
        }
      );

      const newNotifications: Notification[] =
        response.data.notifications || [];
      setNotifications(newNotifications);
      setNotificationMessage("Success: notification deleted");
    } catch (error: any) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Error deleting notification"
      );
    }
  };

  const [userName, setUserName] = useState<string>("");

// 👇 state add karo
// State
const [viewNotificationUI, setViewNotificationUI] = useState<React.ReactNode>(null);

// Function to open notification view
const handleViewNotification = () => {
  message.info(`${userName} Viewing notification...`);

  setViewNotificationUI(
    <>
      {!isAdmin ? (
        notificationMessage ? (
          <Card
            style={{
              width: 280,
              padding: "10px 16px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ExclamationCircleOutlined
                style={{
                  color: "#FFA500",
                  fontSize: 20,
                  marginRight: 5,
                }}
              />
              <span style={{ flexGrow: 1, fontSize: 14 }}>
                {notificationMessage}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: "#000000",
                  borderColor: "#000000",
                  borderRadius: 8,
                }}
                onClick={() => handleSend(selectedIncident)}
              >
                Approve
              </Button>
              <Button
                type="default"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D9D9",
                  borderRadius: 8,
                }}
                onClick={() => handleNotSend(selectedIncident)}
              >
                Deny
              </Button>
            </div>
          </Card>
        ) : (
          <span>No notifications available.</span>
        )
      ) : (
        <span>Admin view goes here</span>
      )}
    </>
  );
};


  const handleEyeClick = async (incident: Incident) => {
    console.log(incident, "this is ");
    setSelectedIncident(incident);
    // Fix: Handle undefined name by providing fallback
    setUserName(incident?.reportedBy?.name || "");
    setSidebarVisible(true);
    setShowAnonymousSection(true); // Reset the anonymous section visibility
    if (isAdmin) {
      await fetchNotificationsForAdmin(incident);
    } else {
      await fetchNotifications(incident);
    }
  };

  const transformReports = useMemo(() => {
    return (reports: any[]): Incident[] => {
      if (!Array.isArray(reports)) return [];

      return reports.map((report, index) => ({
        key: report._id || report.id || `r-${index}`,
        name: report.name || "Unknown",
        incidentID: report._id
          ? `#${report._id.slice(0, 6)}`
          : report.id
          ? `#${report.id.slice(0, 6)}`
          : `#R${index + 1000}`,
        status: report.status || "Pending",
        location: report.location || "N/A",
        type:
          report.type === "option1"
            ? "Hazard"
            : report.type === "option2"
            ? "Safety"
            : report.type || "General",
        dateTime: `${report.date || "N/A"}, ${report.time || "N/A"}`,
        action: <EyeOutlined />,
        description: report.description || "No description provided.",
        involvedParties: report.involvedParties || [],
        reportToHR: report.reportToHR,
        anonymous: report.anonymous,
        reportedBy:
          report.user?.name && report.user?.email
            ? {
                name: report.user.name,
                email: report.user.email,
              }
            : undefined,
        _id: report._id || report.id,
        user: report.user?.id || "",
        identityStatus: report.identityStatus || null,
      }));
    };
  }, []);

  const allIncidents = transformReports(apiReports);
  const sortedReports = [...allIncidents].sort((a, b) =>
    a.incidentID.localeCompare(b.incidentID)
  );
  
  const [DenyNotif, setIsDenying] = useState(false);

  useEffect(() => {
    if (notif[0]?.deny === true) {
      console.log(DenyNotif);
      console.log(notif[0]?.deny);
      
      setIsDenying(true);
      console.log('after',DenyNotif);
      
    } else {
      setIsDenying(false);
    }
    // Optionally keep the logs for debugging
    console.log(notif[0]?.deny);
    console.log(notif?.length, "this length");
    console.log(notif, "this is notifications");
  }, [notif]);
  return (
    <div className="px-9">
      <div className="flex max-lg:flex-col items-center justify-between p-2">
        <h1 className="text-2xl">Reports Submitted</h1>
        <Button
          onClick={fetchReports}
          disabled={loading}
          icon={<RedoOutlined />}
          type="primary"
        >
          Refresh
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={sortedReports}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        >
          <Column title="Incident ID" dataIndex="incidentID" key="incidentID" />
          <Column
            title="Status"
            dataIndex="status"
            key="status"
            render={(status, record: Incident) => (
              <div className="flex items-center gap-2">
                {getStatusTag(status)}
                {canModify && record._id && (
                  <Select
                    value={status}
                    style={{ width: 150 }}
                    onChange={(newStatus) =>
                      handleUpdateStatus(
                        record._id!,
                        newStatus,
                        record.incidentID
                      )
                    }
                    loading={updatingStatus === record._id}
                    disabled={updatingStatus === record._id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
            )}
          />
          <Column
            title="Location"
            dataIndex="location"
            key="location"
            render={(location: string) => (
              <span title={location}>
                {location && location.length > 15
                  ? location.slice(0, 15) + "..."
                  : location}
              </span>
            )}
          />
          <Column
            title="Type"
            dataIndex="type"
            key="type"
            render={(type: string) => (
              <Tag
                color={type === "Hazard" ? "gold" : "red"}
                style={{ color: "black" }}
              >
                {type}
              </Tag>
            )}
          />
          <Column title="Date & Time" dataIndex="dateTime" key="dateTime" />
          <Column
            title="Action"
            key="action"
            render={(_, record: Incident) => (
              <Button
                onClick={() => handleEyeClick(record)}
                icon={<EyeOutlined />}
              />
            )}
          />
          {canModify && (
            <Column
              title="Delete"
              key="delete"
              render={(_, record: Incident) => (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    record._id
                      ? handleDeleteReport(record._id, record.incidentID)
                      : message.warning(
                          "Cannot delete this report - missing ID"
                        )
                  }
                  disabled={!record._id || deleting === record._id}
                  loading={deleting === record._id}
                />
              )}
            />
          )}
        </Table>
      </Spin>
      <Drawer
        title={
          <div className="flex max-lg:flex-col justify-between items-center">
            <div>
              <Button
                type="text"
                onClick={() => setSidebarVisible(false)}
                icon={<CloseCircleOutlined />}
              />
              <span>Incident {selectedIncident?.incidentID}</span>
            </div>
            <Button type="default" onClick={() => setSidebarVisible(false)}>
              Close
            </Button>
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => setSidebarVisible(false)}
        open={sidebarVisible}
        width={520}
      >
        <div>
          <div className="flex max-lg:flex-col text-base gap-6 font-semibold">
            <button
              className={
                activeTab === "Detail"
                  ? "text-lg border-b-2 border-black"
                  : "text-lg"
              }
              onClick={() => setActiveTab("Detail")}
            >
              Detail
            </button>
            <button
              className={
                activeTab === "ActivityLog"
                  ? "text-lg border-b-2 border-black"
                  : "text-lg"
              }
              onClick={() => setActiveTab("ActivityLog")}
            >
              Activity Log
            </button>
          </div>

          {activeTab === "Detail" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                {getStatusTag(selectedIncident?.status || "")}
                {canModify && selectedIncident?._id && (
                  <Select
                    value={selectedIncident.status}
                    style={{ width: 180 }}
                    onChange={(newStatus) =>
                      handleUpdateStatus(
                        selectedIncident._id!,
                        newStatus,
                        selectedIncident.incidentID
                      )
                    }
                    loading={updatingStatus === selectedIncident._id}
                    disabled={updatingStatus === selectedIncident._id}
                    placeholder="Change Status"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
              <div className="flex max-lg:flex-col justify-between text-lg font-semibold mt-4 mb-4">
                <div className="flex flex-col">
                  {selectedIncident?.anonymous && showAnonymousSection && (
                    <>
                      <h2>Reported anonymously</h2>
                      {selectedIncident.identityStatus === "provided" ? (
                        <Card
                          style={{
                            width: 280,
                            padding: "10px 16px",
                            backgroundColor: "#F6FFED",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleOutlined
                            style={{
                              color: "#52C41A",
                              fontSize: 20,
                              marginRight: 5,
                            }}
                          />
                          <span style={{ flexGrow: 1, fontSize: 14 }}>
                            Identity Provided
                          </span>
                        </Card>
                      ) : selectedIncident.identityStatus === "declined" ? (
                        <Card
                          style={{
                            width: 280,
                            padding: "10px 16px",
                            backgroundColor: "#FFF1F0",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CloseCircleOutlined
                            style={{
                              color: "#FF4D4F",
                              fontSize: 20,
                              marginRight: 5,
                            }}
                          />
                          <span style={{ flexGrow: 1, fontSize: 14 }}>
                            Identity Declined
                          </span>
                        </Card>
                      ) : (
                        <>
                          {!isAdmin ? (
                            notificationMessage ? (
                              <Card
                                style={{
                                  width: 280,
                                  padding: "10px 16px",
                                  backgroundColor: "#FFFFFF",
                                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                                  borderRadius: 8,
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <ExclamationCircleOutlined
                                    style={{
                                      color: "#FFA500",
                                      fontSize: 20,
                                      marginRight: 5,
                                    }}
                                  />
                                  <span style={{ flexGrow: 1, fontSize: 14 }}>
                                    {notificationMessage}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    marginTop: "10px",
                                  }}
                                >
                                  <Button
                                    type="primary"
                                    style={{
                                      backgroundColor: "#000000",
                                      borderColor: "#000000",
                                      borderRadius: 8,
                                    }}
                                    onClick={() => handleSend(selectedIncident)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    type="default"
                                    style={{
                                      backgroundColor: "#FFFFFF",
                                      borderColor: "#D9D9D9",
                                      borderRadius: 8,
                                    }}
                                    onClick={() => handleNotSend(selectedIncident)}
                                  >
                                    Deny
                                  </Button>
                                </div>
                              </Card>
                            ) : (
                              <span>No notifications available.</span>
                            )
                          ) : DenyNotif ? (
                            <Button type="primary" danger disabled>
                              Rejected
                            </Button>
                          ) : notif.length > 0 ? (
                            <Button disabled>Notification Received</Button>
                          ) : (
                            <Button onClick={handleAskForIdentity}>Ask for Identity</Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                {selectedIncident?.reportToHR ? (
                  <h2>Reported to HR</h2>
                ) : (
                  selectedIncident?.key?.startsWith("r-") && (
                    <h2>Reported to Manager</h2>
                  )
                )}
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-base">Date & Time</h2>
                  {selectedIncident?.dateTime}
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-base">Location</h2>
                  {selectedIncident?.location}
                </div>
              </div>
              <div className="flex mt-4 mb-4 justify-between">
                <div className="gap-5">
                  <h2 className="text-base mb-2">Involved Parties</h2>
                  {selectedIncident?.involvedParties?.length ? (
                    selectedIncident.involvedParties.map((party, index) => (
                      <Tag key={index}>{party}</Tag>
                    ))
                  ) : (
                    <span>No involved parties listed</span>
                  )}
                </div>
                <div>
                  <h2 className="text-base mb-2">Incident Type</h2>
                  <Tag>{selectedIncident?.type}</Tag>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-base mb-2">Description</h2>
                <p>{selectedIncident?.description}</p>
              </div>
              {canModify &&
                selectedIncident?.reportedBy &&
                !selectedIncident.anonymous && (
                  <div className="mt-4 mb-4">
                    <h2 className="text-base mb-1 font-semibold">
                      Reported By
                    </h2>
                    <div>
                      <p>Name: {selectedIncident.reportedBy.name}</p>
                      <p>Email: {selectedIncident.reportedBy.email}</p>
                    </div>
                  </div>
                )}
            </>
          )}

          {activeTab === "ActivityLog" && (
            <div className="mt-4 pb-4 gap-3">
              <h2 className="text-lg font-semibold">Investigation Logs</h2>
              {selectedIncident?.key.startsWith("r-") ? (
                <div className="flex items-center justify-center h-32">
                  <p>No activity logs yet for this report.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center mt-4">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <img
                        src={DrAkhtar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="ml-2">
                        <span className="text-black font-bold text-base">
                          John Doe
                        </span>{" "}
                        added a new entry
                      </span>
                      <span className="ml-2">{selectedIncident?.dateTime}</span>
                    </div>
                  </div>
                  <div className="mt-3 ml-10">
                    <Tag className="mt-5 space-x-8 w-[428px] h-[52px]">
                      <span className="text-base inline-block max-w-full">
                        Started the investigation based on the evidence provided{" "}
                        <br /> by the reported.
                      </span>
                    </Tag>
                  </div>
                  <div className="w-2 border-l-2 absolute border-black h-[98px] ml-4 -mt-[69px]"></div>
                </>
              )}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default SafetyBox;
