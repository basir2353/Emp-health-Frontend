import { Button, Card, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Appointment() {
  const navigate = useNavigate();
  const appointmentsData = localStorage.getItem("appointmentData");

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://e-health-backend-production.up.railway.app/api/appointments");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="">
      <Card bordered={false} className="w-[355px] h-[426px]  px-2">
        <div className="flex justify-between items-center mb-4 flex-wrap p-[10px] gap-[5px]">
          <div className="text-neutral-400 text-2xl font-normal leading-loose">
            Appointments
          </div>
          <Button
            type="default"
            style={{ backgroundColor: "black", color: "white" }}
            className="text-sm font-normal text-white bg-black rounded-lg mt-2 sm:mt-0"
            onClick={() => navigate("/health/doctors")}
          >
            Book Appointment
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Empty description="No appointments scheduled" />
        ) : (
          appointments.slice(0, 2).map((appointment: any, index: any) => (
            <Card
              key={index}
              className="w-full px-2 py-2 border border-solid border-gray-300 rounded-md bg-[#FAFAFA] mb-3 "
            >
              <div className="flex flex-col sm:flex-row">
                <div className="flex sm:flex-col items-center justify-center sm:items-start sm:justify-start sm:pr-6 border-b sm:border-b-0 sm:border-r border-gray-300 sm:mr-3 mb-2 sm:mb-0">
                  <div className="text-base">{appointment.date?.split(' ')[0]}</div>
                  <div className="text-3xl text-[#F05454] sm:-ml-1">{appointment.date?.split(' ')[1]}</div>
                  <div className="text-sm">{appointment.day}</div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-1 sm:mb-0">
                      <div className="text-xs font-medium text-neutral-600">Timing</div>
                      <div className="text-lg font-normal text-neutral-800">{appointment.time}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-neutral-600">Doctor</div>
                      <div className="text-lg font-normal text-neutral-800">{appointment.doctorName}</div>
                    </div>
                  </div>
                  <div className="border-b-2 border-gray-300 my-2"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-medium text-neutral-600">Type</div>
                      <div className="text-xl font-normal text-neutral-800">{appointment.type}</div>
                    </div>
                    <div
                      className="mt-2 sm:mt-0 px-3 py-1 border border-solid border-neutral-5 shadow-button-secondary rounded-md cursor-pointer"
                      onClick={() => navigate("/health/admin-schedule-appointments")}
                    >
                      <div className="text-sm font-normal text-neutral-800">View</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}

        {appointments.length > 0 && (
          <div
            className="w-full h-[46px] cursor-pointer pt-3 text-center mt-4 rounded-b-lg"
            onClick={() => navigate("/health/admin-schedule-appointments")}
          >
            <div className="absolute w-[335px]  max-lg:w-full h-[46px] pt-3 text-center bottom-0 bg-[#E6F7FF] rounded-b-lg">
              See All
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Appointment;