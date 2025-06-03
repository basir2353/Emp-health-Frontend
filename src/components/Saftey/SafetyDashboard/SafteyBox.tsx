import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from "../../../redux/store";
import { useState } from "react";
import axios from "axios";
import { message } from "antd";
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
          ? 'https://e-health-backend-production.up.railway.app/api/reports/all'
          : 'https://e-health-backend-production.up.railway.app/api/reports'

        const response = await axios.get(endpoint, {
          headers: {
            'x-auth-token': token || '',
          },
        })

        setApiReports(response.data.reports)
      } catch (error) {
        console.error('Failed to fetch reports:', error)
        message.error('Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])


  // Count incidents by status
  const activeCount = apiReports.filter(r => r.status === "active").length;
  const pendingCount = apiReports.filter(r => r.status === "pending").length;
  const investigatingCount = apiReports.filter(r => r.status === "investigating").length;
  const closedCount = apiReports.filter(r => r.status === "closed").length;
  return (
    <div>
         <div className="flex max-lg:flex-col gap-6 justify-center pb-10">
        <div className="flex items-center h-[111px] justify-between px-2 py-4 w-[344px] max-lg:w-auto bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-gray-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">
                Active Incidents
              </h2>
              <p className="text-6xl font-bold text-black">{activeCount}</p>
            </div>
          </div>
          <svg
            width="56"
            height="57"
            viewBox="0 0 56 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.5" width="56" height="56" rx="8" fill="#F5F5F5" />
            <path
              d="M36.0859 21.6797V16.9688H39.1094C39.2641 16.9688 39.3906 16.8422 39.3906 16.6875V14.7188C39.3906 14.5641 39.2641 14.4375 39.1094 14.4375H16.8906C16.7359 14.4375 16.6094 14.5641 16.6094 14.7188V16.6875C16.6094 16.8422 16.7359 16.9688 16.8906 16.9688H19.9141V21.6797C19.9141 24.5449 21.4047 27.0656 23.6547 28.5C21.4047 29.9344 19.9141 32.4551 19.9141 35.3203V40.0312H16.8906C16.7359 40.0312 16.6094 40.1578 16.6094 40.3125V42.2812C16.6094 42.4359 16.7359 42.5625 16.8906 42.5625H39.1094C39.2641 42.5625 39.3906 42.4359 39.3906 42.2812V40.3125C39.3906 40.1578 39.2641 40.0312 39.1094 40.0312H36.0859V35.3203C36.0859 32.4551 34.5953 29.9344 32.3453 28.5C34.5953 27.0656 36.0859 24.5449 36.0859 21.6797Z"
              fill="#434343"
            />
          </svg>
        </div>

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
          <svg
            width="56"
            height="57"
            viewBox="0 0 56 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.5" width="56" height="56" rx="8" fill="#FFFBE6" />
            <path
              d="M28 12.75C19.3023 12.75 12.25 19.8023 12.25 28.5C12.25 37.1977 19.3023 44.25 28 44.25C36.6977 44.25 43.75 37.1977 43.75 28.5C43.75 19.8023 36.6977 12.75 28 12.75ZM34.2051 33.341L33.1996 34.7121C33.1777 34.742 33.1502 34.7672 33.1185 34.7864C33.0869 34.8055 33.0517 34.8183 33.0152 34.8238C32.9786 34.8294 32.9412 34.8277 32.9053 34.8187C32.8694 34.8098 32.8356 34.7939 32.8059 34.7719L26.991 30.532C26.9548 30.506 26.9253 30.4717 26.9052 30.4319C26.885 30.3921 26.8746 30.3481 26.875 30.3035V20.625C26.875 20.4703 27.0016 20.3438 27.1562 20.3438H28.8473C29.002 20.3438 29.1285 20.4703 29.1285 20.625V29.3262L34.1418 32.9508C34.2684 33.0387 34.2965 33.2145 34.2051 33.341Z"
              fill="#FAAD14"
            />
          </svg>
        </div>
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
          <svg
            width="56"
            height="57"
            viewBox="0 0 56 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.5" width="56" height="56" rx="8" fill="#F0F5FF" />
            <path
              d="M37.8926 41.6399C41.6533 38.6988 44.0721 34.1185 44.0721 28.9756C44.0721 20.1002 36.9002 12.9203 28.0247 12.9082C19.1372 12.8962 11.9292 20.0921 11.9292 28.9756C11.9292 34.006 14.2395 38.4939 17.8596 41.439C18.0002 41.5515 18.2051 41.5274 18.3176 41.3868L19.9006 39.3578C20.0091 39.2212 19.985 39.0243 19.8524 38.9118C19.527 38.6466 19.2136 38.3613 18.9122 38.06C17.7375 36.8893 16.8014 35.5016 16.156 33.9738C15.481 32.3948 15.1435 30.7113 15.1435 28.9756C15.1435 27.2399 15.481 25.5564 16.152 23.9734C16.7988 22.4426 17.727 21.0685 18.9082 19.8872C20.0895 18.706 21.4636 17.7779 22.9944 17.131C24.5814 16.46 26.2649 16.1225 28.0006 16.1225C29.7363 16.1225 31.4198 16.46 33.0029 17.131C34.5337 17.7779 35.9078 18.706 37.089 19.8872C38.2703 21.0685 39.1984 22.4426 39.8453 23.9734C40.5163 25.5564 40.8538 27.2399 40.8538 28.9756C40.8538 30.7113 40.5163 32.3948 39.8453 33.9779C39.1999 35.5056 38.2638 36.8934 37.089 38.064C36.7154 38.4377 36.3216 38.7872 35.9118 39.1087L34.2765 37.0154C34.2395 36.9675 34.1897 36.9311 34.1329 36.9102C34.0761 36.8894 34.0146 36.8851 33.9554 36.8976C33.8962 36.9102 33.8418 36.9393 33.7984 36.9814C33.755 37.0236 33.7243 37.0771 33.71 37.1359L32.1189 43.6529C32.0707 43.8538 32.2234 44.0506 32.4283 44.0506L39.1381 44.0828C39.4073 44.0828 39.56 43.7734 39.3913 43.5645L37.8926 41.6399Z"
              fill="#2F54EB"
            />
          </svg>
        </div>
        <div className="flex items-center  justify-between h-[111px] max-lg:w-auto  px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-24 bg-blue-700 rounded-full"></div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-black">Closed</h2>
              <p className="text-6xl font-bold text-black">{closedCount}</p>
            </div>
          </div>
          <svg
            width="56"
            height="57"
            viewBox="0 0 56 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="0.5" width="56" height="56" rx="8" fill="#F6FFED" />
            <path
              d="M28 12.75C19.3023 12.75 12.25 19.8023 12.25 28.5C12.25 37.1977 19.3023 44.25 28 44.25C36.6977 44.25 43.75 37.1977 43.75 28.5C43.75 19.8023 36.6977 12.75 28 12.75ZM34.8027 23.3566L27.3988 33.6223C27.2953 33.7667 27.1589 33.8844 27.0009 33.9656C26.8428 34.0468 26.6677 34.0891 26.49 34.0891C26.3124 34.0891 26.1372 34.0468 25.9792 33.9656C25.8211 33.8844 25.6847 33.7667 25.5813 33.6223L21.1973 27.5473C21.0637 27.3609 21.1973 27.1008 21.4258 27.1008H23.0746C23.4332 27.1008 23.7742 27.273 23.9852 27.5684L26.4883 31.0418L32.0148 23.3777C32.2258 23.0859 32.5633 22.9102 32.9254 22.9102H34.5742C34.8027 22.9102 34.9363 23.1703 34.8027 23.3566Z"
              fill="#52C41A"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SafteyBox
