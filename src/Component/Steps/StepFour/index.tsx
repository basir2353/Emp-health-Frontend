import {
  Button,
  Col,
  Flex,
  Radio,
  Layout,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { RadioChangeEvent } from "antd";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setEmployeeContact } from "../../../features/onboardSlice";
import { saveStepData } from "../../../utils/onboardingStorage";
import { BaseButton } from "../../form/base-button";
import { FlagOutlined } from "@ant-design/icons";

function StepFour() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Title, Text } = Typography;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [placement, setPlacement] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const contactInputRef = useRef<HTMLInputElement>(null); // Ref for contact input

  const { onboarding_master_data } = useSelector((state: any) => state["onboard"] || {});

  const StyledRadioButton = styled(Radio.Button)`
    &:not(:first-child)::before {
      width: 0px;
    }
    margin: 4px 6px;
    border-radius: 20px;
    padding: 0 15px;
  `;

  const ResponsiveCol = styled(Col)`
    text-align: center;
    flex: 0 0 0 0;
    max-width: 50%;
    position: relative;
    z-index: 10;
    @media (max-width: 768px) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  `;

  const StyledInput = styled.input`
    width: 100%;
    height: 40px;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    &:hover {
      border-color: #40a9ff;
    }
    &::placeholder {
      color: #bfbfbf;
    }
  `;

  const handlePlacementChange = useCallback((e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleContactChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setContact(value);
    }
  }, []);

  const handleContactClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (contactInputRef.current) {
      contactInputRef.current.focus();
      // Slight delay for mobile to ensure keyboard appears
      setTimeout(() => contactInputRef.current?.focus(), 100);
    }
    console.log("Contact input clicked");
  }, []);

  const validateInputs = useCallback((): boolean => {
    if (!name.trim()) {
      message.error("Please enter the emergency contact name.");
      return false;
    }

    if (!placement.trim()) {
      message.error("Please select the relationship.");
      return false;
    }

    if (!countryCode) {
      message.error("Please select a country code.");
      return false;
    }

    if (!contact.trim() || !/^\d+$/.test(contact)) {
      message.error("Please enter a valid emergency contact number.");
      return false;
    }

    return true;
  }, [name, placement, countryCode, contact]);

  const handleClick = useCallback(() => {
    if (!validateInputs()) return;

    const payload = {
      emergency_contact_relation: placement,
      emergency_contact_name: name,
      emergency_contact: `${countryCode}${contact}`,
    };

    dispatch(setEmployeeContact(payload));
    saveStepData(2, payload);
    navigate("/step-5");
  }, [dispatch, navigate, name, placement, countryCode, contact]);

  const countryFlagMap: Record<string, React.ReactNode> = {
    "+92": "🇵🇰",
    "+91": "🇮🇳",
    "+1": "🇺🇸",
  };

  const fallbackCountryCodes = [
    { label: <><span style={{ marginRight: 8 }}>{countryFlagMap["+92"]}</span>+92 (Pakistan)</>, value: "+92" },
    { label: <><span style={{ marginRight: 8 }}>{countryFlagMap["+91"]}</span>+91 (India)</>, value: "+91" },
    { label: <><span style={{ marginRight: 8 }}>{countryFlagMap["+1"]}</span>+1 (USA)</>, value: "+1" },
  ];

  const countryOptions =
    onboarding_master_data?.applicationMasterData?.countryCodes?.masterData?.map(
      (country: { code: string; description: string }) => ({
        label: (
          <>
            <span style={{ marginRight: 8 }}>
              {countryFlagMap[country.code] || <FlagOutlined />}
            </span>
            {country.code} ({country.description})
          </>
        ),
        value: country.code,
      })
    ) || fallbackCountryCodes;

  const relationshipOptions =
    onboarding_master_data?.applicationMasterData?.relationShips?.masterData || [
      { description: "Parent" },
      { description: "Sibling" },
      { description: "Spouse" },
      { description: "Relative" },
      { description: "Friend" },
      { description: "Others" },
    ];

  useEffect(() => {
    if (relationshipOptions.length && !placement) {
      setPlacement(relationshipOptions[0].description.toLowerCase());
    }
  }, [relationshipOptions]);

  return (
    <Row style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }} justify="center" align="middle">
      <ResponsiveCol span={12} className="lg:px-32">
        <Row justify="center">
          <Col span={18} style={{ textAlign: "center", flex: "0 0 100%", maxWidth: "100%" }}>
            <Title level={1} style={{ fontWeight: "bold" }}>
              Give us your emergency contact no.
            </Title>
            <Text type="secondary">
              Please provide the details of someone we can contact in case of an emergency.
            </Text>

            <StyledInput
              value={name}
              onChange={handleNameChange}
              placeholder="Emergency Contact Name..."
              style={{ margin: "20px 0px 5px 0px" }}
            />

            <div style={{ textAlign: "left", marginTop: "5px" }}>
              <Text type="secondary">Relationship with emergency contact</Text>
            </div>
            <Radio.Group
              value={placement}
              onChange={handlePlacementChange}
              style={{ margin: "5px 0px", flexWrap: "wrap" }}
            >
              {relationshipOptions.map(
                (relationship: { description: string }, index: number) => (
                  <StyledRadioButton key={index} value={relationship.description.toLowerCase()}>
                    {relationship.description}
                  </StyledRadioButton>
                )
              )}
            </Radio.Group>

            <Flex gap="5px" style={{ margin: "20px 0px" }}>
              <Select
                size="large"
                placeholder="Code"
                options={countryOptions}
                onChange={setCountryCode}
                style={{ width: "30%", zIndex: 10 }}
                value={countryCode || undefined}
              />
              <StyledInput
                ref={contactInputRef}
                value={contact}
                onChange={handleContactChange}
                onClick={handleContactClick}
                onFocus={() => console.log("Contact input focused")}
                onBlur={() => console.log("Contact input blurred")}
                type="tel"
                inputMode="numeric"
                placeholder="Enter Emergency Contact"
                style={{ width: "70%", zIndex: 10 }}
              />
            </Flex>

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
      </ResponsiveCol>

      <Layout style={{ height: "calc(100vh - 81px)", right: "0px", top: "80px" }}>
        <Layout.Content className="bg-blue-100">
          <div className="w-[638px] ml-10 mt-3 max-lg:w-auto max-lg:ml-0">
            <Title level={2} className="font-satoshi font-semibold text-4xl leading-10 text-black">
              Healthy employees, Productive employees.
            </Title>
            <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
              interdum, ac aliquet odio mattis.
            </Text>
          </div>
          <img src="/step4.png" alt="Step 4" className="w-[450px] ml-72 max-lg:w-auto max-lg:ml-0" />
        </Layout.Content>
      </Layout>
    </Row>
  );
}

export default StepFour;