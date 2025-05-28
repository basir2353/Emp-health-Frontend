import React, { useEffect, useState } from "react";
import { Button, Card, Drawer, Space, Table, Tag, Modal, message, Select, Popconfirm } from "antd";
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  RedoOutlined,
  UpCircleOutlined,
  DeleteOutlined,
  EditOutlined,
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
  _id?: string; // Add MongoDB ID for API operations
}

const { Column } = Table;
const { confirm } = Modal;
const { Option } = Select;

const sampleData: Incident[] = [
  {
    key: "1",
    incidentID: "0023",
    status: "Pending",
    location: "4th Floor Marketing Dept...",
    type: "Safety",
    dateTime: "12-Feb-2022, 12:00 PM ",
    action: <EyeOutlined />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    involvedParties: ["Party 1", "Party 2"],
  },
  {
    key: "2",
    incidentID: "0024",
    status: "Escalated",
    location: "3rd Floor Product Dept.",
    type: "Hazzard",
    dateTime: "09-Jan-2022, 11:00 PM ",
    action: <EyeOutlined />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    involvedParties: ["Party 3", "Party 4"],
  },
  {
    key: "3",
    incidentID: "0025",
    status: "Being Investigated",
    location: "Lobby",
    type: "Safety",
    dateTime: "09-Jan-2022, 11:00 PM ",
    action: <EyeOutlined />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    involvedParties: ["Party 5", "Party 6"],
  },
  {
    key: "4",
    incidentID: "0026",
    status: "Closed",
    location: "Lobby",
    type: "Hazzard",
    dateTime: "12-Feb-2022, 12:00 PM  ",
    action: <EyeOutlined />,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    involvedParties: ["Party 7", "Party 8"],
  },
];

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
      color = "yellow";
      icon = <ClockCircleOutlined />;
      break;
    case "Being Investigated":
      color = "skyblue";
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
    <Tag color={color} icon={icon}>
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
  const [apiReports, setApiReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Get reports from Redux store
  const reports = useSelector((state: RootState) => state.appointments.report);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Determine correct endpoint based on role
      const isAdminOrDoctor = user?.role === "admin" || user?.role === "doctor";
      const endpoint = isAdminOrDoctor
        ? "https://e-health-backend-production.up.railway.app/api/reports/all"
        : "https://e-health-backend-production.up.railway.app/api/reports";

      const response = await axios.get(endpoint, {
        headers: {
          "x-auth-token": token || "",
        },
      });

      if (isAdminOrDoctor) {
        setApiReports(response.data.reports);
      } else {
        setApiReports(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      message.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string, incidentID: string) => {
    setUpdatingStatus(reportId);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.patch(
        `https://e-health-backend-production.up.railway.app/api/reports/${reportId}/status`,
        { status: newStatus },
        {
          headers: {
            "x-auth-token": token || "",
            "Content-Type": "application/json",
          },
        }
      );

      message.success(`Report ${incidentID} status updated to ${newStatus}`);
      
      // Refresh the reports list
      await fetchReports();
      
      // Update the selected incident if it's the one being updated
      if (selectedIncident?._id === reportId) {
        setSelectedIncident({
          ...selectedIncident,
          status: newStatus
        });
      }
    } catch (error: any) {
      console.error("Failed to update report status:", error);
      
      if (error.response?.status === 403) {
        message.error('Access denied. Only admin or doctor can update report status.');
      } else if (error.response?.status === 404) {
        message.error('Report not found.');
      } else if (error.response?.status === 400) {
        message.error('Invalid status provided.');
      } else {
        message.error('Failed to update report status. Please try again.');
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteReport = async (reportId: string, incidentID: string) => {
    confirm({
      title: 'Delete Report',
      content: `Are you sure you want to delete incident ${incidentID}? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          
          await axios.delete(`https://e-health-backend-production.up.railway.app/api/reports/${reportId}`, {
            headers: {
              "x-auth-token": token || "",
            },
          });

          message.success('Report deleted successfully');
          
          // Refresh the reports list
          await fetchReports();
          
          // Close sidebar if the deleted report was selected
          if (selectedIncident?._id === reportId) {
            setSidebarVisible(false);
            setSelectedIncident(null);
          }
        } catch (error: any) {
          console.error("Failed to delete report:", error);
          
          if (error.response?.status === 403) {
            message.error('Access denied. Only admin or doctor can delete reports.');
          } else if (error.response?.status === 404) {
            message.error('Report not found.');
          } else {
            message.error('Failed to delete report. Please try again.');
          }
        }
      },
    });
  };

  const toggleSidebar = (incident: Incident) => {
    setSelectedIncident(incident);
    setSidebarVisible(!sidebarVisible);
  };
  
  const toggleTab = (tab: "Detail" | "ActivityLog") => {
    setActiveTab(tab);
  };

  // Transform reports from API to Incident format
  const transformReports = (reports: Report[]): Incident[] => {
    if (!Array.isArray(reports)) return [];

    return reports.map((report, index) => {
      const reporter = (report as any).user; // Use `as any` if 'user' isn't in the TypeScript type

      return {
        key: `r-${index}`,
        incidentID: `R-${index + 1000}`,
        status: (report as any).status || "Pending", // Get status from API
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
          reporter && reporter.name && reporter.email
            ? {
                name: reporter.name,
                email: reporter.email,
              }
            : undefined,
        _id: (report as any)._id || (report as any).id, // Add the MongoDB ID
      };
    });
  };

  // Combine sample data with user-submitted reports
  const allIncidents = [...transformReports(apiReports)];

  localStorage.setItem("allIncidents", JSON.stringify(reports));
  
  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canModify = user?.role === "admin" || user?.role === "doctor";

  const sortedReports = [...allIncidents].sort((a, b) =>
    a.incidentID.localeCompare(b.incidentID)
  );

  return (
    <div className="px-9">
      <div className="flex max-lg:flex-col items-center justify-between p-2">
        <h1 className="text-2xl">Reports Submitted</h1>
      </div>
      <div style={{ overflowX: "auto" }}>
        <Table
          key={allIncidents.length} // <- forces re-render if data size changes
          dataSource={sortedReports}
          rowKey="key"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10 }}
          loading={loading}
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
                    {STATUS_OPTIONS.map(option => (
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
              <Tag
                color={type === "Hazard" ? "yellow" : "red"}
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
            render={(text, record: Incident) => (
              <Space>
                <Button onClick={() => toggleSidebar(record)} icon={<EyeOutlined />} />
              </Space>
            )}
          />
          
          {canModify && (
            <Column
              title="Delete"
              key="delete"
              render={(text, record: Incident) => (
                <Button 
                  type="text" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    if (record._id) {
                      handleDeleteReport(record._id, record.incidentID);
                    } else {
                      message.warning('Cannot delete this report - missing ID');
                    }
                  }}
                  disabled={!record._id} // Disable if no ID (for sample data)
                />
              )}
            />
          )}
        </Table>
      </div>
      
      <Drawer
        title={
          <div className="flex max-lg:flex-col justify-between items-center">
            <div>
              <Button
                type="text"
                onClick={() => setSidebarVisible(false)}
                icon={<CloseCircleOutlined />}
              />
              <span className="-mb-2">
                Incident # {selectedIncident?.incidentID}
              </span>
            </div>
            <Space>          
              <Button type="default" onClick={() => setSidebarVisible(false)}>
                Close
              </Button>
            </Space>
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
            <div className="mb-4 gap-2 underline border-b">
              <button
                className={
                  activeTab === "Detail"
                    ? "text-lg border-b-2 border-black"
                    : "text-lg "
                }
                onClick={() => toggleTab("Detail")}
              >
                Detail
              </button>
            </div>
            <div>
              <button
                className={
                  activeTab === "ActivityLog"
                    ? "text-lg border-b-2 border-black "
                    : "text-lg  "
                }
                onClick={() => toggleTab("ActivityLog")}
              >
                Activity Log
              </button>
            </div>
          </div>

          {activeTab === "Detail" && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Tag>
                  <div className="flex max-lg:flex-col items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{
                        backgroundColor:
                          selectedIncident?.status === "Pending"
                            ? "yellow"
                            : selectedIncident?.status === "Being Investigated"
                            ? "skyblue"
                            : selectedIncident?.status === "Escalated"
                            ? "red"
                            : "green",
                      }}
                    ></div>
                    {selectedIncident?.status}
                  </div>
                </Tag>
                
                {canModify && selectedIncident?._id && (
                  <Select
                    value={selectedIncident.status}
                    style={{ width: 180 }}
                    onChange={(newStatus) => 
                      handleUpdateStatus(selectedIncident._id!, newStatus, selectedIncident.incidentID)
                    }
                    loading={updatingStatus === selectedIncident._id}
                    disabled={updatingStatus === selectedIncident._id}
                    placeholder="Change Status"
                    size="small"
                  >
                    {STATUS_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="flex max-lg:flex-col justify-between text-lg font-semibold mt-4 mb-4">
                <div className='flex flex-col'>
                  {selectedIncident?.anonymous && (
                    <>
                      <h2>Reported anonymously</h2>
                      <Card
                        style={{
                          width: 280, 
                          padding: '10px 16px',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ExclamationCircleOutlined style={{ color: '#FFA500', fontSize: 20, marginRight: 5 }} />
                        <span style={{ flexGrow: 1, fontSize: 14 }}>{'{Name} is asking for your identity'}</span>
                        
                        <div style={{ display: 'flex', gap: '8px', marginTop:'10px' }}>
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: '#000000',
                              borderColor: '#000000',
                              borderRadius: 8,
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            type="default"
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderColor: '#D9D9D9',
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
                {!selectedIncident?.reportToHR && selectedIncident?.key.startsWith('r-') && <h2>Reported to Manager</h2>}
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
                  {selectedIncident?.involvedParties && selectedIncident.involvedParties.length > 0 ? (
                    selectedIncident.involvedParties.map((party, index) => (
                      <Tag key={index}>{party}</Tag>
                    ))
                  ) : (
                    <span>No involved parties listed</span>
                  )}
                </div>
                <div></div>
                <div>
                  <div>
                    <h2 className="text-base mb-2 mr-20">Incident Type</h2>
                    <Tag>{selectedIncident?.type}</Tag>
                  </div>
                </div>
              </div>
              
              {/* Only show attachments for sample data since user-submitted reports might not have them */}
              {!selectedIncident?.key.startsWith('r-') && (
                <div>
                  <div>
                    <h2 className="text-base mb-2 mr-20">Attachments</h2>
                    <div className="flex">
                      <a className="flex flex-col border border-black w-[114px] h-[114px] pb-2 pt-1 px-2">
                        <img
                          src={DrAkhtar}
                          alt="Attachment 1"
                          className="w-[104px] h-[104px]"
                        />
                      </a>
                      <a className="flex flex-col border border-black w-[114px] h-[114px] pb-2 pt-1 px-2 ml-5">
                        <img
                          src={DrMaria}
                          alt="Attachment 2"
                          className="w-[104px] h-[104px]"
                        />
                      </a>
                      <a className="flex flex-col border border-black w-[114px] h-[114px] pb-2 pt-1 px-2 ml-5">
                        <img
                          src={DrAndrew}
                          alt="Attachment 3"
                          className="w-[104px] h-[104px]"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h2 className="text-base mb-2 mr-20">Description</h2>
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
              
              {selectedIncident?.key.startsWith('r-') ? (
                <div className="flex items-center justify-center h-32">
                  <p>No activity logs yet for this new report.</p>
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
                        <span className="text-black font-bold text-base mt-3">
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

                  <div className="flex items-center mt-4 ml-1">
                    <UpCircleOutlined className="text-2xl" />

                    <div className="flex flex-col">
                      <span className="font-semibold text-xl ml-3">
                        Issue was escalated.
                      </span>
                      <span className="ml-3">{selectedIncident?.dateTime}</span>
                    </div>
                  </div>
                  <div className="mt-4 pb-4 gap-3">
                    <div className="flex items-center mt-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <img
                          src={DrAndrew}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="ml-2">
                          <span className="text-black font-bold text-base mt-3">
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
                  </div>
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