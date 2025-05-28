import { Button, Card, Empty } from "antd";
import React from "react";
import AppointmentBackground from "../../public/images/appointments.svg";

function AppointmentCard() {
  return (
    <div>
      <Card
        bordered={false}
        className="w-[375px] h-[418px] justify-center align-middle max-lg:w-auto"
      >
        <div className="w-96 text-neutral-400 text-2xl font-normal  leading-loose pl-3">
          Appointments
        </div>
        <div className="w-96 h-[375px] flex-col justify-center items-center gap-1px inline-flex mt-1">
          <Empty
            image={AppointmentBackground}
            imageStyle={{ height: 237, width: 237, marginLeft: "30px" }}
            description={
              <span>You haven’t booked any appointments this week.</span>
            }
          >
            <Button
              type="default"
              style={{ color: "white", backgroundColor: "black" }}
            >
              Book Appointment
            </Button>
          </Empty>
        </div>
      </Card>
    </div>
  );
}

export default AppointmentCard;
