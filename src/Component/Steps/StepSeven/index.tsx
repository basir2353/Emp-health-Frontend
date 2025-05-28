import { Button, Col, Input, Layout, Row } from "antd";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { RadioChangeEvent, SelectProps } from "antd";
import { Radio, message } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { StepOneImgUrl } from "../../../Constant";
import { BaseButton } from "../../form/base-button";
import { useDispatch } from "react-redux";
import { setEmployeeDisorders } from "../../../features/onboardSlice";
import { saveStepData } from "../../../utils/onboardingStorage";

type SelectCommonPlacement = SelectProps["placement"];

function StepSeven() {
  const [description, setDescription] = useState<string>("");
  const [placement, SetPlacement] = useState<SelectCommonPlacement>("topLeft");
  const [selectedDisorder, setSelectedDisorder] = useState<string>("");
  const bloodGroups = [
    "Asthima",
    "Cold & Flu",
    "Chronic Obstructive Pulmonary Disease",
    "Diabetes",
    "Epilepsy",
    "Infectious Disease",
    "Lung & Respiratory condition",
    "Thyroid",
    "Vertigo",
    "Multiple Sclerosis",
    "Skin Condition",
    "Arthritis",
    "Osteoarthritis",
    "Add Item",
  ];
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const StyledRadioButton = styled(Radio.Button)`
    &:not(:first-child)::before {
      width: 0px;
    }
  `;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: inputValue } = e.target;
    setDescription(inputValue);
  };

  const placementChange = (e: RadioChangeEvent) => {
    SetPlacement(e.target.value);
    setSelectedDisorder(e.target.value);
  };

  const handleClick = () => {
    // Validation: Require either a disorder or a description
    if (!selectedDisorder && !description.trim()) {
      message.error("Please select a disorder or enter details.");
      return;
    }

    const dataToSave = {
      disorders: selectedDisorder ? [selectedDisorder] : [],
      disorder_detail: description,
    };

    // Save to local storage or wherever saveStepData stores
    saveStepData(7, dataToSave);

    // Save to redux
    dispatch(
      setEmployeeDisorders(dataToSave)
    );

    navigate("/step-8");
  };

  const ResponsiveCol = styled(Col)`
    text-align: center;
    flex: 0 0 0 0;
    max-width: 50%;

    @media (max-width: 768px) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  `;
  return (
    <>
      <Row
        style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
        justify="center"
        align="middle"
      >
        <ResponsiveCol span={12}>
          <Row justify="center">
            <Col span={18} style={{ textAlign: "center" }}>
              <Title>Do you have any health conditions or disorders ?</Title>
              <Text type="secondary">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Assumenda veniam facere in delectus, maxime iusto non id reici
              </Text>

              <Radio.Group
                value={selectedDisorder}
                onChange={placementChange}
                style={{ margin: "20px 0px" }}
              >
                {bloodGroups.map((item) => {
                  return (
                    <StyledRadioButton
                      key={item}
                      value={item}
                      style={{ borderRadius: "20px", margin: "5px" }}
                    >
                      {item}
                    </StyledRadioButton>
                  );
                })}
              </Radio.Group>
              <TextArea
                placeholder="Describe your condition (optional)"
                allowClear
                style={{ marginTop: "20px" }}
                onChange={handleChange}
                value={description}
              />

              <BaseButton
                type="primary"
                size="large"
                style={{ width: "80%", backgroundColor: "black" }}
                onClick={handleClick}
              >
                Next
              </BaseButton>
              <div style={{ marginTop: "10px" }}>
                <BaseButton type="text" onClick={() => navigate("/step-8")}>
                  Skip
                </BaseButton>
              </div>
            </Col>
          </Row>
        </ResponsiveCol>
        <Layout
          style={{
            width: "720px",
            height: "calc(100vh - 81px)",
            right: "0px",
            top: "80px",
          }}
        >
          <Layout.Content className="bg-blue-100">
            <div className="a">
              <div className="w-[638px] ml-10 mt-2 max-lg:w-auto max-lg:ml-0 max-lg:mt-2">
                <Title
                  level={2}
                  className="font-satoshi font-semibold text-4xl leading-10 text-black"
                >
                  Create Reports instantaneously.
                </Title>
                <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos.
                </Text>
              </div>
              <img
                src="/step7.png"
                alt="Step 1"
                className="w-[460px]  ml-[290px]  max-lg:w-auto max-lg:ml-0"
              />
            </div>
          </Layout.Content>
        </Layout>
      </Row>
    </>
  );
}

export default StepSeven;
