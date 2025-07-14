import React, { useState, useEffect } from "react";
import { InfoCircleOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Report {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  time?: string;      // add if your API provides this
  location?: string;  // add if your API provides this
}

const NotifictionSaftey: React.FC<{ canModify: boolean }> = ({ canModify }) => {
  const [closed, setClosed] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const allEndpoint = "https://empolyee-backedn.onrender.com/api/reports/all";
        const userEndpoint = "https://empolyee-backedn.onrender.com/api/reports";

        const endpoint = canModify ? allEndpoint : userEndpoint;

        const response = await axios.get(endpoint, {
          headers: { "x-auth-token": token },
        });

        const reports = response.data.reports || response.data;

        if (reports.length === 0) {
          setError("No reports found.");
          return;
        }

        const latestReport = reports.reduce((a: Report, b: Report) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );

        setReport(latestReport);

        setTimeout(() => setClosed(true), 30000);
      } catch (err: any) {
        if (err.response?.status === 403 && canModify) {
          try {
            const token = localStorage.getItem("token");
            const fallbackResponse = await axios.get("https://empolyee-backedn.onrender.com/api/reports", {
              headers: { "x-auth-token": token || "" },
            });

            const fallbackReports = fallbackResponse.data.reports || fallbackResponse.data;

            if (fallbackReports.length === 0) {
              setError("No reports found.");
              return;
            }

            const latestReport = fallbackReports.reduce((a: Report, b: Report) =>
              new Date(a.createdAt) > new Date(b.createdAt) ? a : b
            );

            setReport(latestReport);
            setTimeout(() => setClosed(true), 30000);
          } catch (fallbackErr) {
            setError("Failed to fetch reports.");
            console.error(fallbackErr);
          }
        } else {
          setError("Failed to fetch reports.");
          console.error(err);
        }
      }
    };

    fetchReports();
  }, [canModify]);

  if (closed || !report) return null;

  return (
    <div className="flex z-50 flex-row items-start p-4 w-[372px] h-[180px] absolute right-4 top-24 bg-white shadow-xl rounded-lg">
      {/* Main icon */}
      <div className="flex-none flex text-yellow-400 mt-2">
        <InfoCircleOutlined style={{ fontSize: "28px" }} />
      </div>

      <div className="flex flex-col ml-3 w-full">
        <div className="flex justify-between items-center">
          <p className="text-lg text-yellow-400 font-semibold">Pending Incident</p>
          <button onClick={() => setClosed(true)} className="text-gray-500 text-sm font-bold">
            ✕
          </button>
        </div>

        <p className="font-normal text-xs text-black mt-2">
          Incident <span className="font-semibold">#{report._id.slice(0, 6)}</span> is pending to be
          investigated. Please review and proceed forward.
        </p>

        {/* Time & Location row */}
        <div className="flex items-center gap-4 mt-2 text-gray-700 text-xs">
          {report.time && (
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>{report.time}</span>
            </div>
          )}
          {report.location && (
            <div className="flex items-center gap-1">
              <EnvironmentOutlined />
              <span>{report.location}</span>
            </div>
          )}
        </div>

        {/* View button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/safety")}
            className="px-4 py-2 bg-black text-white font-semibold rounded-md text-sm"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotifictionSaftey;
