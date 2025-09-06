import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from "../../../redux/store";
import axios from "axios";

function SafteyBox() {
  const reports = useSelector((state: RootState) => state.appointments.report);

  useEffect(() => {
    console.log('Reports from Redux:', reports);
  }, [reports]);

  const [loading, setLoading] = useState(false);
  const [apiReports, setApiReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const isAdminOrDoctor = user?.role === 'admin' || user?.role === 'doctor'

        const endpoint = isAdminOrDoctor
          ? 'https://empolyee-backedn.onrender.com/api/reports/all'
          : 'https://empolyee-backedn.onrender.com/api/reports'

        const response = await axios.get(endpoint, {
          headers: {
            'x-auth-token': token || '',
          },
        })

        setApiReports(response.data.reports)
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Normalize statuses for consistency
  const normalizeStatus = (status: string) => {
    if (!status) return "";
    return status.toLowerCase().replace(/\s+/g, "");
  };

  // Count incidents by normalized status
  const totalCount = apiReports.length; // total incidents
  const pendingCount = apiReports.filter(r => normalizeStatus(r.status) === "pending").length;
  const investigatingCount = apiReports.filter(
    r => normalizeStatus(r.status) === "beinginvestigated" || normalizeStatus(r.status) === "investigating"
  ).length;
  const closedCount = apiReports.filter(r => normalizeStatus(r.status) === "closed").length;

  return (
    <div>
      <div className="flex max-lg:flex-col gap-6 justify-center pb-10">
        {/* Total */}
        <div className="flex items-center h-[111px] justify-between px-2 py-4 w-[344px] max-lg:w-auto bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-gray-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">
                Total Incidents
              </h2>
              <p className="text-6xl font-bold text-black">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center  h-[111px]  justify-between max-lg:w-auto px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-blue-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">
                Pending Incidents
              </h2>
              <p className="text-6xl font-bold text-black">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Being Investigated */}
        <div className="flex items-center justify-between h-[111px]  max-lg:w-auto px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-blue-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">
                Being Investigated
              </h2>
              <p className="text-6xl font-bold text-black">{investigatingCount}</p>
            </div>
          </div>
        </div>

        {/* Closed */}
        <div className="flex items-center  justify-between h-[111px] max-lg:w-auto  px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-blue-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">Closed</h2>
              <p className="text-6xl font-bold text-black">{closedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafteyBox
