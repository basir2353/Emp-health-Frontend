import { Button, Card, Flex, Image } from "antd";
import React from "react";
import JohnDoe from "../../public/images/lead-board/John Doe.svg";
import AliAkram from "../../public/images/lead-board/Ali Akram.svg";
import JaneDoe from "../../public/images/lead-board/Jane Doe.svg";
import Sebastian from "../../public/images/lead-board/Sebastian.svg";
import RoseThomas from "../../public/images/lead-board/Rosie Thomas.svg";
import RameshRao from "../../public/images/lead-board/Ramesh Rao.svg";

const employees = [
  { name: "John Doe🏆", points: 453, image: JohnDoe },
  { name: "Ali Akram", points: 320, image: AliAkram },
  { name: "Sebastian Smith", points: 301, image: Sebastian },
  { name: "Jane Doe", points: 280, image: JaneDoe },
  { name: "Ramesh Rao", points: 255, image: RameshRao },
  { name: "Rosie Thomas", points: 240, image: RoseThomas },
];

function LeadboardCard() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Card bordered={false} className="w-[391px] h-[426px] max-lg:w-auto">
        <div className="w-full text-neutral-400 text-2xl font-normal leading-loose pl-3">
          Healthy Lead Board
        </div>

        <div className="flex-col justify-between items-center gap-1 inline-flex pl-3 max-lg:pl-0">
          <div className="gap-64 py-2 rounded-tl rounded-tr border-b border-neutral-200 justify-between items-start inline-flex w-full">
            <div className="text-black text-sm font-medium leading-snug">
              Employee
            </div>
            <div className="text-right mr-2 text-black text-sm font-medium leading-snug">
              Points
            </div>
          </div>
          <div className="w-full flex-col justify-start items-start gap-3 flex">
            {employees.map((employee) => (
              <div
                key={employee.name}
                className="w-full justify-between items-center inline-flex"
              >
                <div className="justify-center items-center gap-2 flex">
                  <div className="flex items-center gap-8">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image
                        src={employee.image}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-black text-base font-normal leading-normal">
                    {employee.name}
                  </div>
                </div>
                <div className="text-right mr-2 text-black text-sm font-normal leading-snug">
                  {employee.points}
                </div>
              </div>
            ))}
            <Flex gap="small">
              <Button className="max-lg:ml-0 ml-32 mt-5 justify-center items-center ">See All</Button>
            </Flex>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LeadboardCard;
