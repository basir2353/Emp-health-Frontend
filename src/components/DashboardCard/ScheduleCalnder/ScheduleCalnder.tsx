import {
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import UploadSchedulePopup from "../../../Component/CreateAppointemts/UploadSchedulePopup";
import Maria from "../../../public/images/Maria.svg";
import Calendar from "./Calnder";
const { Text } = Typography;

const ScheduleCalnder: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 bg-white ml-10">
      <Breadcrumb
        className=""
        items={[
          {
            title: "Home",
          },
          {
            title: <a href="">Health</a>,
          },
          {
            title: <a href="">Schedule</a>,
          },
        ]}
      />

      <Row>
        <Col className="gutter-row flex justify-between right-0 mb-6">
          <div className="text-black text-3xl ml-1 font-medium ">Schedule</div>
        </Col>

        <Col
          className="gutter-row right-8 flex max-lg:ml-32"
          style={{ marginLeft: "auto" }}
        >
          <Flex gap="small" wrap="wrap" className="flex">
            <Button
              type="default"
              block
              onClick={openPopup}
              style={{
                width: "165px",
                height: "36px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <UploadOutlined style={{ marginRight: "5px" }} />
              Upload Schedule
            </Button>
            <Link to="/health/doctors">
              <Button
                type="primary"
                block
                style={{
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PlusOutlined style={{ marginRight: "5px" }} />
                Manual Upload
              </Button>
            </Link>
          </Flex>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <Space>
            <div className="flex flex-col items-start  ">
              <div className="flex flex-col items-start  bg-white  rounded-md px-2 py-2">
                <div className="flex items-center ">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-3 border-2">
                    <Image
                      src={Maria}
                      alt="Profile"
                      className="w-96 h-96 object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold text-black">
                      Dr. Maria Summers
                      <span className=" font-normal text-base">
                        (Neurologist)
                      </span>
                    </h3>
                    <p className="font-normal text-base leading-9 text-gray-500">
                      M.B.B.S., F.C.P.S. (Neurology)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Space>
        </Col>

        <Col className="mr-10 ">
          <Row justify="space-between" align="middle">
            <div className="flex items-center">
              <div>
                <div className="bg-white shadow-md px-2 py-1 justify-center mr-2 border-2 border-gray-200 rounded-lg ">
                  <LeftOutlined />
                </div>
              </div>
              <div className="text-lg font-medium">February</div>
              <div>
                <div className="bg-white shadow-md px-2 py-1 justify-center ml-2 border-2 border-gray-200 rounded-lg">
                  <RightOutlined className="" />
                </div>
              </div>
              <Button className="ml-2" type="default" icon={<FilterOutlined />}>
                Filter
              </Button>
            </div>
          </Row>
        </Col>
      </Row>

      {/* Add Calendar Component */}
      {/* <Calendar /> */}
      <Calendar />

      {isPopupOpen && <UploadSchedulePopup closePopup={closePopup} />}
    </div>
  );
};

export default ScheduleCalnder;
