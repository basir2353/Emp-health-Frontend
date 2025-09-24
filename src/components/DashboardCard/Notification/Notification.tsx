import React from "react";
import { Button, Row, Col, Space } from "antd";
import NotificationSettingsComponent from "../../Notification/NotificationSettings";
import NotificationTest from "../../Notification/NotificationTest";

const Notification = () => {
  return (
    <div className="p-6">
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} lg={16}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-600 mt-2">Manage your notification preferences and view recent notifications</p>
          </div>
        </Col>
        
        {/* Notification Settings */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <NotificationSettingsComponent />
            <NotificationTest />
          </Space>
        </Col>
        
        {/* Recent Notifications */}
        <Col xs={24} lg={16}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Recent Notifications</h2>
            <div className="space-y-4">
              <div className="w-full p-4 rounded-md border-2 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] bg-red-500 rounded-full"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-[40px] h-[40px] bg-gray-200 rounded-full relative">
                      <img
                        src="https://s3-alpha-sig.figma.com/img/f985/5f48/8816bbd4756f4a9e986b19c0233d984f?Expires=1710720000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XVjne4qeEU5j6i1k~mwUizt~NfocPsrSH6~acT090984WryOQpcZAaGYdyZQ83ONCuSloM8XbZ5Vv9kQ19fOv8kjWmrweNDVzh3sH3xob0hHdlnbFF~Uw5CZTMm~pavW0cLLv6IFFNDVfjzrtwPJbJXGBQ0sq8EO9UPSQ8C5Zxa8u6hqPi7s8infjft1QYeHxfU27pGelAJZfNGzIwkuLqrBs1ol6Q1yA13jsy7B6c6Qyp5v9bkiq7mugG8Jnk3yvNSowFGeeNN0hBoC1U6ZEzMrJOeAStb1rk4o2QgX3uG4QOr3QCar3KA7DQrLJNO2XHERb5Nt2ryo-dTJlEnG0A__"
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="text-left font-normal text-black max-w-md">
                      A request is made by Angela Smith to subscribe to an insurance plan.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs font-normal text-gray-600">
                    Feb 20, 2024, 10:00 PM
                  </div>
                  <Button type="default" className="px-4 py-1">
                    View Request
                  </Button>
                </div>
              </div>

              <div className="w-full p-4 rounded-md border-2 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] bg-green-500 rounded-full"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-[40px] h-[40px] bg-gray-200 rounded-full relative">
                      <img
                        src="https://s3-alpha-sig.figma.com/img/e961/db74/9d48ce83863147361d369d469dcf3993?Expires=1710720000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SlvLhywx5YJWtnFtbnPVf57t~JsjvMu~Wt6cuWxsh42BpTXl9g4jZPbLnUrBj8oZQ1Tezx7oTrxY2L1vRki20r1e86HSXSEzbh0j~HUkxK3UtFare5d6j27F5u-9BcADulhZpGl44gpo2x3cUgNqRrBhNvEGSJOJR3253Y~YRjLV-MXuuzxhzeE877l6Qv5ClcSIsnqzI3Ec8yLdpCaMeBc~oyAKxMQ2~LVpN4XiN-5IEjI6gcVRn1OoBNVpENu~qVz32hXdPOtizBRMKj3BTg7Gz-09Av5NBrVBgcno1zf410J9KCbLlNrmFnbcGIVn5NSu7HLdnUwoEAh0xMsRuA__"
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="text-left font-normal text-black max-w-md">
                      Your request to subscribe to a new insurance plan has been approved by John Doe
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs font-normal text-gray-600">
                    Feb 20, 2024, 10:00 PM
                  </div>
                  <Button type="default" className="px-4 py-1">
                    View Request
                  </Button>
                </div>
              </div>

              <div className="w-full p-4 rounded-md border-2 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-[40px] h-[40px] bg-gray-200 rounded-full relative">
                      <img
                        src="https://s3-alpha-sig.figma.com/img/a224/4b04/ee3e2db40ae1eaff48da124f2fe42d6b?Expires=1710720000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BG0MZzCtyBE9ZgEQMtQVHW~GzOYpZPQHYi9QhhMt6nAzzl8eoXVxr9MJIvlSuYODxTecoDtztmY0jQVa5FcQ619c8dLAF1EZcHWmkgo7~bew3lryPvSbYFfx4DZlJZ3Aa4q5f~-OFDw9OOJoOB2z0aPsnA2g-DFMfG2QtEaBe3gihj60kS7pNKzNUOvbetuyMwPPEoh6MuW5kL69vhXP3hFFjhQSapGwNY79ngXfGgh41JpJ3MAYdvEGseSg1OY1F-lI8BHS494IQp5hkxKDk388aj7rrtgyzMxskgRquAZvr8k0utV65z0qcNTKYwUwBTgqDyO0nBkshtehsJSc1A__"
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="text-left font-normal text-black max-w-md">
                      Your appointment for Feb 24, 2024 has been scheduled with Dr. Samantha Willis.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs font-normal text-gray-600">
                    Feb 20, 2024, 10:00 PM
                  </div>
                  <Button type="default" className="px-4 py-1">
                    View Request
                  </Button>
                </div>
              </div>

              <div className="w-full p-4 rounded-md border-2 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] bg-orange-500 rounded-full"></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-[40px] h-[40px] bg-gray-200 rounded-full relative">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="19.5" fill="#F5F5F5" stroke="#E0E0E0"/>
                        <path d="M18.8095 10.9058C19.4762 10.3439 20.5524 10.3439 21.2 10.9058L22.7048 12.1915C22.9905 12.4296 23.5333 12.6296 23.9143 12.6296H25.5333C26.5429 12.6296 27.3714 13.4582 27.3714 14.4677V16.0868C27.3714 16.4677 27.5714 17.001 27.8095 17.2868L29.0952 18.7915C29.6571 19.4582 29.6571 20.5344 29.0952 21.182L27.8095 22.6868C27.5714 22.9725 27.3714 23.5058 27.3714 23.8868V25.5058C27.3714 26.5153 26.5429 27.3439 25.5333 27.3439H23.9143C23.5333 27.3439 23 27.5439 22.7143 27.782L21.2095 29.0677C20.5429 29.6296 19.4667 29.6296 18.8191 29.0677L17.3143 27.782C17.0286 27.5439 16.4857 27.3439 16.1143 27.3439H14.4476C13.4381 27.3439 12.6095 26.5153 12.6095 25.5058V23.8772C12.6095 23.5058 12.4191 22.9629 12.181 22.6868L10.8952 21.1725C10.3429 20.5153 10.3429 19.4487 10.8952 18.7915L12.181 17.2772C12.4191 16.9915 12.6095 16.4582 12.6095 16.0868V14.4772C12.6095 13.4677 13.4381 12.6391 14.4476 12.6391H16.0952C16.4762 12.6391 17.0095 12.4391 17.2952 12.201L18.8095 10.9058Z" fill="#F05454"/>
                        <path d="M20 16.3145V20.9145" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.9948 23.8105H20.0033" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="text-left font-normal text-black max-w-md">
                      A report has been generated from within your team with report number #09892. Please investigate this.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs font-normal text-gray-600">
                    Feb 20, 2024, 10:00 PM
                  </div>
                  <Button type="default" className="px-4 py-1">
                    View Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Notification;