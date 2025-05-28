import React, { useEffect } from "react";
import { Row, Col, Button, Progress } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { boxesData } from "./data";
import Walnessbox from "./walnessbox";
import { useNavigate } from "react-router-dom";

const Wellness: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="justify-between flex flex-col">
      <div className="flex flex-col justify-center align-middle mt-5 bg-white">
        <div className="flex justify-center align-middle bg-white">
          <div
            style={{
              background:
                "linear-gradient(90deg, #222831 0%, #3B4656 49%, #222831 100%)",
            }}
            className="w-full md:w-[1407px]  max-lg:w-auto max-lg:h-auto gap-0 p-6 rounded-sm  relative"
          >
            <Row justify="space-between" align="middle" className="h-full">
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                className="flex flex-col justify-center"
              >
                <div className="flex flex-col">
                  <h1 className="text-4xl font-medium text-white">
                    Enroll in courses to learn and <br /> earn points
                  </h1>
                  <p className="text-white mt-3 text-base font-normal">
                    These courses will help make your life in the office better
                    and also you earn <br /> points that you can redeem to win
                    exciting points.
                  </p>
                  <Button
                    type="primary"
                    style={{
                      background: "white",
                      color: "black",
                      marginTop: "1rem",
                      width: "135px",
                    }}
                    onClick={() => navigate("/wellness/course")}
                  >
                    View all courses
                  </Button>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }}>
                <Row justify="space-between" align="middle" className="h-full">
                  {boxesData.map((box, index) => (
                    <Col
                      key={index}
                      xs={{ span: 24 }}
                      sm={{ span: 12 }}
                      md={{ span: 8 }}
                    >
                      <div className="flex flex-col justify-between items-start px-2 py-2 max-lg:mt-6 w-full sm:w-[201px] h-[237px] bg-white rounded-md relative">
                        <div className="border-2 rounded-full w-[39px] h-[39px] border-[#69C0FF] overflow-hidden p-[5px]">
                          <img src={box.imageUrl} alt="avatar" className="" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-medium text-2xl ">{box.title}</h3>
                          <p className="font-normal text-sm text-neutral-8">
                            (by {box.author})
                          </p>
                        </div>
                        <div className="w-full -neutral-4 rounded-full relative">
                          <Progress
                            percent={box.progress}
                            status="active"
                            showInfo={false}
                            strokeColor="#000000"
                          />
                        </div>
                        <Button
                          type="primary"
                          className="w-full"
                          style={{ background: "black" }}
                          icon={<PlayCircleOutlined />}
                        >
                          Resume
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Walnessbox />
    </div>
  );
};

export default Wellness;
