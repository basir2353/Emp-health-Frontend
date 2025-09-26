import { Button, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DataReport = () => {
  type Report = {
    id: string;
    type: string;
    status: string;
    description: string;
    createdAt?: string;
  };

  const [apiReports, setApiReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token_real");
      const isAdminOrDoctor = user?.role === "admin" || user?.role === "doctor";

      const endpoint = isAdminOrDoctor
        ? "http://empolyee-backedn.onrender.com/api/reports/all"
        : "http://empolyee-backedn.onrender.com/api/reports";

      const response = await axios.get(endpoint, {
        headers: {
          "x-auth-token": token || "",
        },
      });

      setApiReports(response.data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      // message.error("Failed to fetch reports1");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Closed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "No Action":
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="w-[355px] h-[426px] max-lg:w-auto max-lg:h-auto mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-neutral-400 text-2xl font-normal leading-loose pl-3">
            Reports
          </div>
          {(userRole === "admin" || userRole === "doctor") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              className="text-sm font-normal text-white bg-black rounded-lg"
              style={{ backgroundColor: "black", color: "white" }}
              onClick={() => navigate("/safety")}
            >
              Create Report
            </Button>
          )}
        </div>

        {/* Reports List */}
        <div className="max-h-96 overflow-y-auto divide-y">
          {apiReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
                        <img src="/report.png" alt="No appointments" className="w-[15rem] h-[15rem] mb-4" />
                        <p className="text-center text-gray-500 mb-4">No reports yet. Create your first report!</p>
                        <Button
                          type="default"
                          style={{ backgroundColor: "black", color: "white" }}
                          className="text-sm font-normal text-white bg-black rounded-lg mt-2 sm:mt-0"
                          onClick={() => navigate("/safety")}
                        >
                          Report an Issue
                        </Button>
                      </div>
          ) : (
            apiReports.slice(0, 4).map((report: any, index) => (
              <Card
                key={report.id + index}
                className="mx-2 mt-2 w-[339px] flex flex-col h-[72px] justify-center px-3 gap-10 bg-[#F5F5F5] border border-[#E0E0E0] rounded-md"
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="font-medium text-base text-black">
                    {report.id}
                  </div>
                  <div className="text-center text-base text-black">
                    Type: {report.type}
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    ></div>
                    <div className="ml-1 text-base text-black">
                      {report.status}
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/safety")}
                  className="flex items-center justify-center w-full mr-10 cursor-pointer mt-2 bg-white h-[24px] border border-solid border-neutral-5 shadow-button-secondary rounded-md"
                >
                  <div className="text-sm font-normal text-neutral-800">
                    View
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {apiReports.length > 4 && (
          <div className="text-center py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium cursor-pointer transition">
            See All ({apiReports.length})
          </div>
        )}
      </div>
    </div>
  );
};

export default DataReport;
