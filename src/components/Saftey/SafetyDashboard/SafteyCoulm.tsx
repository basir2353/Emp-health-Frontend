import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Card, Drawer, Space, Table, Tag, Modal, message, Select, Spin } from "antd";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RedoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DrMaria from "../../../public/images/Maria.svg";
import DrAkhtar from "../../../public/images/Akhtar.svg";
import DrAndrew from "../../../public/images/Andrew.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Report } from "../../../redux/appointments/appointmentSlice";
import axios from "axios";

interface Incident {
  key: string;
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
    <Tag color={color} icon={icon} style={{ minWidth: 80, textAlign: "center" }}>
      {status}
    </Tag>
  );
};

const SafetyBox: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<"Detail" | "ActivityLog">("Detail");
  const [apiReports, setApiReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canModify = user?.role === "admin" || user?.role === "doctor";

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please log in.");
        return;
      }

      const endpoint = canModify
        ? "https://e-health-backend-production.up.railway.app/api/reports/all"
        : "https://e-health-backend-production.up.railway.app/api/reports";

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

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async (reportId: string, newStatus: string, incidentID: string) => {
    confirm({
      title: "Update Status",
      content: `Are you sure you want to change the status of incident ${incidentID} to ${newStatus}?`,
      onOk: async () => {
        setUpdatingStatus(reportId);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            message.error("Authentication token missing");
            return;
          }

          const response = await axios.patch(
            `http://localhost:5000/api/reports/${reportId}/status`,
            { status: newStatus },
            {
              headers: {
                "x-auth-token": token,
                "Content-Type": "application/json",
              },
            }
          );

          message.success(`Report ${incidentID} status updated to ${newStatus}`);
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
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setDeleting(reportId);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            message.error("Authentication token missing");
            return;
          }

          await axios.delete(`https://e-health-backend-production.up.railway.app/api/reports/${reportId}`, {
            headers: { "x-auth-token": token },
          });

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

  const toggleSidebar = (incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarVisible(!sidebarVisible);
  };

  const transformReports = useMemo(() => {
    return (reports: Report[]): Incident[] => {
      if (!Array.isArray(reports)) return [];

      return reports.map((report, index) => ({
        key: `r-${index}`,
        incidentID: `R-${index + 1000}`,
        status: (report as any).status || "Pending",
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
          (report as any).user?.name && (report as any).user?.email
            ? {
                name: (report as any).user.name,
                email: (report as any).user.email,
              }
            : undefined,
        _id: (report as any)._id || (report as any).id,
      }));
    };
  }, []);

  const allIncidents = transformReports(apiReports);
  const sortedReports = [...allIncidents].sort((a, b) =>
    a.incidentID.localeCompare(b.incidentID)
  );

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
          scroll={{ x: 800 }}
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
                      handleUpdateStatus(record._id!, newStatus, record.incidentID)
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
            render={(location) => (
              <span title={location}>
                {location.length > 15 ? location.slice(0, 15) + "..." : location}
              </span>
            )}
          />
          <Column
            title="Type"
            dataIndex="type"
            key="type"
            render={(type) => (
              <Tag color={type === "Hazard" ? "gold" : "red"} style={{ color: "black" }}>
                {type}
              </Tag>
            )}
          />
          <Column title="Date & Time" dataIndex="dateTime" key="dateTime" />
          <Column
            title="Action"
            key="action"
            render={(_, record: Incident) => (
              <Button onClick={() => toggleSidebar(record)} icon={<EyeOutlined />} />
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
                      : message.warning("Cannot delete this report - missing ID")
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
              <span>Incident # {selectedIncident?.incidentID}</span>
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
                  {selectedIncident?.anonymous && (
                    <>
                      <h2>Reported anonymously</h2>
                      <Card
                        style={{
                          width: 280,
                          padding: "10px 16px",
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ExclamationCircleOutlined
                          style={{ color: "#FFA500", fontSize: 20, marginRight: 5 }}
                        />
                        <span style={{ flexGrow: 1, fontSize: 14 }}>
                          {user.name || "Admin"} is asking for your identity
                        </span>
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#000000",
                              borderColor: "#000000",
                              borderRadius: 8,
                            }}
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
                          >
                            Deny
                          </Button>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
                {selectedIncident?.reportToHR && <h2>Reported to HR</h2>}
                {!selectedIncident?.reportToHR && selectedIncident?.key.startsWith("r-") && (
                  <h2>Reported to Manager</h2>
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
              {(canModify && selectedIncident?.reportedBy && !selectedIncident.anonymous) && (
                <div className="mt-4 mb-4">
                  <h2 className="text-base mb-1 font-semibold">Reported By</h2>
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
                        Started the investigation based on the evidence provided <br /> by the reported.
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