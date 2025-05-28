import {
  Space,
  Card,
  Image,
  Progress,
  Button,
  Col,
  Row,
  Breadcrumb,
  Flex,
} from "antd";
import { EditOutlined, GoldOutlined } from "@ant-design/icons";
import React from "react";

export const Appointment: React.FC = () => {
  const [value, setValue] = React.useState<string>("horizontal");
  return (
    // <div style={{ padding: "30px", background: "#ececec" }}>
    <div className="mt-4 h-5 justify-start items-center pl-9">
      <Breadcrumb
        items={[
          {
            title: "Home",
          },
          {
            title: <a href="">Health</a>,
          },
        ]}
      />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
          <div className="text-black text-2xl leading-10">Health</div>
        </Col>
        <Col className="gutter-row" span={12}>
          <Flex gap="small" wrap="wrap">
            <Button type="primary">Book Appointment</Button>
          </Flex>
        </Col>
      </Row>

      <Row style={{ backgroundColor: "#ececec" }}>
        <Col span={6}>
          <Space direction="vertical" size={16}>
            <Card
              bordered={false}
              style={{
                width: 400,
                height: 220,
                borderRadius: "0px",
                backgroundColor: "#141414",
              }}
            >
              <div className="flex flex-row justify-evenly">
                <div className="w-96 h-24 p-2 rounded justify-between items-center inline-flex m-3">
                  <div className="justify-start items-start gap-2.5 flex">
                    <Image
                      preview={false}
                      width={100}
                      style={{
                        borderRadius: "100px",
                      }}
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />

                    <div className="flex-col justify-start items-start gap-2 inline-flex">
                      <div className="text-white text-xl font-medium  leading-7">
                        Hello John!
                      </div>
                      <div className="w-98 justify-start items-start gap-2 inline-flex">
                        <div>
                          <span className="text-white text-sm font-medium  leading-snug">
                            Blood Group: O-
                          </span>
                        </div>
                        <div>
                          <span className="text-white text-sm font-medium  leading-snug">
                            Height:
                          </span>

                          <span className="text-white text-sm font-normal  leading-snug">
                            171 cm
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-white text-sm font-medium  leading-snug">
                          Height: 80 KG
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 px-3.5 py-1 bg-sky-100 rounded shadow border border-zinc-600 justify-center items-center gap-2 flex">
                    <div className="bg-white bg-opacity-0 flex-col justify-center items-center inline-flex">
                      <div className="w-4 h-4 p-px justify-center items-center inline-flex">
                        <EditOutlined />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-96 h-16 px-2 flex-col justify-start items-start gap-5 inline-flex">
                <div className="flex-col justify-start items-start gap-1 flex">
                  <div className="text-white text-sm font-medium  leading-snug">
                    Profile Completion
                  </div>

                  <div className="w-96 h-5 py-1.5 justify-center items-center inline-flex">
                    <Progress
                      percent={40}
                      trailColor="white"
                      showInfo={false}
                    />
                  </div>
                </div>
              </div>
            </Card>
            <div className="w-96 text-neutral-400 text-2xl font-normal  leading-loose pl-3">
              Active Insurance Plan
            </div>
            <div className="w-96 h-44 px-2 py-3 bg-white rounded border border-neutral-200 flex-col justify-start items-start gap-3 inline-flex">
              <div className="flex-col justify-start items-start gap-3 flex">
                <div className="justify-start items-start gap-2 inline-flex">
                  <GoldOutlined />
                  <div className="text-black text-xl leading-7">
                    Gold Health Plan
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-1 flex">
                  <div className="text-neutral-600 text-sm font-normal font-['Satoshi'] leading-snug">
                    Medical, Dental, and Vision coverage
                  </div>
                  <div className="text-neutral-600 text-sm font-normal font-['Satoshi'] leading-snug">
                    No coverage for elective cosmetic procedures
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-1 flex">
                <div className="flex-col justify-start items-start gap-1 flex">
                  <div className="text-black text-base font-medium font-['Satoshi'] leading-normal">
                    Premium
                  </div>
                </div>
                <div className="w-96 justify-between items-start inline-flex">
                  <div className="p-1 bg-lime-300 rounded justify-center items-center gap-2.5 flex">
                    <div className="text-black text-base font-medium font-['Satoshi'] leading-normal">
                      $150 per month
                    </div>
                  </div>
                  <div className="px-3.5 py-1 bg-white rounded shadow border border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-center text-black text-opacity-90 text-sm font-normal font-['Satoshi'] leading-snug">
                      See All
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-96 h-10 px-3.5 py-1.5 bg-white rounded shadow border border-zinc-300 justify-center items-center gap-2.5 inline-flex">
              <div className="text-center text-black text-opacity-90 text-base leading-normal">
                View Family Deatils
              </div>
            </div>
          </Space>
        </Col>

        <Col span={18}>
          <Row>
            <div className="w-52 text-neutral-400 text-2xl leading-loose">
              Appointments
            </div>
          </Row>
          <Row className="w-full">
            <Card
              bordered={false}
              style={{
                width: "100%",
                marginRight: "20px",
                height: 410,
                borderRadius: "0px",
              }}
            >
              <Row className="w-full h-14 p-1.5 m-2 bg-sky-100 rounded border border-sky-200 justify-start items-start gap-1 inline-flex">
                Row 1
              </Row>
              <Row className="w-full h-14 p-1.5 m-2 bg-sky-100 rounded border border-sky-200 justify-start items-start gap-1 inline-flex">
                Row 2
              </Row>
              <Row className="w-full h-14 p-1.5 m-2 bg-sky-100 rounded border border-sky-200 justify-start items-start gap-1 inline-flex">
                Row 3
              </Row>
            </Card>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
