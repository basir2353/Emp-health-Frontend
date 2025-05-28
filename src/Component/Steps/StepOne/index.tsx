import { Alert, Col, Flex, Layout, Row, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setEmployeeHeight,
  onboardingMasterData,
} from "../../../features/onboardSlice";
import { BaseButton } from "../../form/base-button";
import { BaseNumberInput } from "../../form/base-number-input";
import BaseSwitch from "../../form/base-switch";
import { useQuery } from "@tanstack/react-query";
import { getMasterData } from "../utils";
import { Loader } from "../../../components/Loader";
import { saveStepData } from "../../../utils/onboardingStorage";

function StepOne() {
  useEffect(() => {
    // Reset steps completion status and hide the bot
    localStorage.setItem("stepsCompleted", "false");
    localStorage.setItem("botVisible", "false");
    console.log("StepOne - stepsCompleted and botVisible set to false");
  }, []);
  
  const [value, setValue] = useState<string>("");
  const [unit, setUnit] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateHeight = (val: string) => {
    if (!val || isNaN(Number(val))) {
      return "Please enter a valid height.";
    }
    const num = Number(val);
    if (unit) {
      // cm
      if (num < 50 || num > 300) return "Height in cm should be between 50 and 300.";
    } else {
      // inch
      if (num < 20 || num > 120) return "Height in inches should be between 20 and 120.";
    }
    return null;
  };

  const handleClick = () => {
    const validationError = validateHeight(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    dispatch(
      setEmployeeHeight({
        height: value,
        height_unit: unit,
      })
    );
    // Store validated data
    saveStepData(1, {
      height: value,
      unit: unit ? "cm" : "inch",
    });
    navigate("/step-2");
  };

  return (
    <div className="mb-10">
      <Row
        style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
        justify="space-between"
        align="middle"
      >
        <Col span={24} lg={12}>
          <Row justify="center">
            <Col span={24} lg={18} className="w-full text-center" >
              <Title>How tall are you?</Title>
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
                    leftText="cm"
                    rightText="inch"
                    defaultChecked={true}
                    style={{ display: "flex", alignItems: "center" }}
                  />
                }
                placeholder="Enter your height in feet ..."
                onChange={setValue}
              />
              {error && (
                <Alert
                  style={{ marginBottom: 16 }}
                  message={error}
                  type="error"
                  showIcon
                />
              )}
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
          className="w-full lg:w-[720px] h-[calc(100vh-81px)] lg:absolute lg:right-0 lg:top-[118px]"
        >
          <Layout.Content className="bg-blue-100">
            <div className="gap-10" />
            <div />
            <div>
              <div className="w-[638px] max-lg:w-auto ml-10 max-lg:ml-0 mt-7">
                <Title
                  level={3}
                  className="font-satoshi font-semibold text-4xl leading-10 text-black"
                >
                  Your wellness is your productivity.
                </Title>
                <Text className="font-satoshi font-normal text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis. Class
                  aptent taciti sociosqu ad litora torquent per conubia nostra, per
                  inceptos himenaeos.
                </Text>
              </div>
              <div className="ml-[225px] max-lg:ml-0 left-0">
                <img
                  src="/step1.png"
                  alt="Step 1"
                  className="w-[500px] max-lg:w-auto right-0 bottom-0"
                />
              </div>
            </div>
          </Layout.Content>
        </Layout>
      </Row>
    </div>
  );
}

export default StepOne;
