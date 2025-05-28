import { Col, Layout, Row, Typography, message } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setEmployeeWeight } from "../../../features/onboardSlice";
import { BaseButton } from "../../form/base-button";
import { BaseNumberInput } from "../../form/base-number-input";
import BaseSwitch from "../../form/base-switch";
import { saveStepData } from "../../../utils/onboardingStorage";

function StepTwo() {
  const [value, setValue] = useState<string>("");
  const [unit, setUnit] = useState<boolean>(true);

  const { onboarding_master_data } = useSelector(
    (state: any) => state["onboard"] || {}
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Title, Text } = Typography;

  // Validation function
  const validate = () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      message.error("Please enter a valid weight.");
      return false;
    }
    return true;
  };

  const handleClick = () => {
    if (!validate()) return;

    const weightUnit =
      unit
        ? onboarding_master_data?.applicationMasterData?.weightUnits?.masterData[0]?.description?.toLowerCase()
        : onboarding_master_data?.applicationMasterData?.weightUnits?.masterData[1]?.description?.toLowerCase();

    dispatch(
      setEmployeeWeight({
        weight: value,
        weight_unit: weightUnit,
      })
    );
    saveStepData(2, {
      weight: value,
      unit: weightUnit,
    });
    navigate("/step-3");
  };

  return (
    <>
      <Row
        style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
        justify="space-between"
        align="middle"
      >
        <Col span={24} lg={12}>
          <Row justify="center">
            <Col span={24} lg={18} style={{ textAlign: "center" }}>
              <Title>How much do you weigh?</Title>
              <Text type="secondary">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda
                veniam facere in delectus, maxime iusto non id reiciendis.
              </Text>
              <BaseNumberInput
                style={{ margin: "20px 0px" }}
                value={value}
                size="large"
                maxLength={6}
                suffix={
                  <BaseSwitch
                    onChange={setUnit}
                    leftText={
                      onboarding_master_data &&
                      onboarding_master_data?.applicationMasterData?.weightUnits?.masterData[1]?.description?.toLowerCase()
                    }
                    rightText={
                      onboarding_master_data &&
                      onboarding_master_data?.applicationMasterData?.weightUnits?.masterData[0]?.description?.toLowerCase()
                    }
                    defaultChecked={true}
                    style={{ display: "flex", alignItems: "center" }}
                  />
                }
                placeholder="Enter your weight"
                onChange={setValue}
              />
              <BaseButton
                type="primary"
                size="large"
                style={{ width: "80%", backgroundColor: "black" }}
                onClick={handleClick}
              >
                Next
              </BaseButton>
            </Col>
          </Row>
        </Col>
        <Layout
          className="w-full lg:w-[720px] h-[calc(100vh-81px)] lg:absolute lg:right-0 max-lg:mt-5"
        >
          <Layout.Content className="bg-blue-100">
            <div className=" " />
            <div className="" />
            <div className="">
              <div className="w-[638px] max-lg:w-auto ml-10 max-lg:ml-0 mt-7">
                <Title
                  level={2}
                  className="font-satoshi font-semibold text-4xl leading-10 text-black"
                >
                  Create Reports instantaneously.
                </Title>
                <Text className="font-satoshi font-normal text-base text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis. Class
                  aptent taciti sociosqu ad litora torquent per conubia nostra, per
                  inceptos himenaeos.
                </Text>
              </div>
              <div className="ml-56 max-lg:ml-0">
                <img
                  src="/step2.png"
                  alt="Step 1"
                  className="w-[509px] max-lg:w-auto "
                />
              </div>
            </div>
          </Layout.Content>
        </Layout>
      </Row>
    </>
  );
}

export default StepTwo;
