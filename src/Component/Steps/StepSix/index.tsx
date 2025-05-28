import {
  Button,
  Col,
  Input,
  Layout,
  Row,
  Typography,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { BaseButton } from "../../form/base-button";
import { useDispatch } from "react-redux";
import { setEmployeeAllergies } from "../../../features/onboardSlice";
import { saveStepData } from "../../../utils/onboardingStorage";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Styled Components (should be declared outside functional component)
const StyledRadioButton = styled(Radio.Button)`
  &:not(:first-child)::before {
    width: 0px;
  }
`;

const ResponsiveCol = styled(Col)`
  text-align: center;
  flex: 0 0 0 0;
  max-width: 50%;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const allergiesList = [
  "food allergy",
  "peanut allergy",
  "shellfish allergy",
  "milk allergy",
  "egg allergy",
  "wheat allergy",
  "soy allergy",
  "corn allergy",
  "fish allergy",
  "see allergy",
  "sulfite allergy",
  "tree nut allergy",
  "gluten allergy",
  "latex allergy",
  "pollen allergy",
  "dust mite allergy",
];

function StepSix() {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAllergyToggle = (value: string) => {
    if (selectedAllergies.includes(value)) {
      setSelectedAllergies(selectedAllergies.filter((item) => item !== value));
    } else {
      setSelectedAllergies([...selectedAllergies, value]);
    }
    setError(""); // Clear error on change
  };

  const validateStep = () => {
    if (
      selectedAllergies.length === 0 &&
      description.trim().length === 0
    ) {
      setError("Please select an allergy or write a description.");
      return false;
    }
    setError("");
    return true;
  };

  const handleClick = () => {
    if (!validateStep()) return;

    const stepData = {
      allergies: selectedAllergies,
      allergy_description: description,
    };

    dispatch(setEmployeeAllergies(stepData));
    saveStepData(6, stepData);

    navigate("/step-7");
  };

  const skipClick = () => {
    // Optionally save empty data on skip
    saveStepData(6, {
      allergies: [],
      allergy_description: "",
    });
    navigate("/step-7");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setError(""); // Clear error on change
  };

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
              <Title>Do you have any allergies?</Title>
              <Text type="secondary">
                Please select any allergies you have or describe them below.
              </Text>

              <div style={{ margin: "20px 0px" }}>
                {allergiesList.map((allergy) => (
                  <StyledRadioButton
                    key={allergy}
                    value={allergy}
                    style={{
                      borderRadius: "20px",
                      margin: "5px",
                      backgroundColor: selectedAllergies.includes(allergy)
                        ? "#1890ff"
                        : undefined,
                      color: selectedAllergies.includes(allergy)
                        ? "white"
                        : undefined,
                    }}
                    onClick={() => handleAllergyToggle(allergy)}
                  >
                    {allergy}
                  </StyledRadioButton>
                ))}
              </div>

              <TextArea
                placeholder="Describe any other allergies..."
                allowClear
                style={{ marginTop: "20px" }}
                onChange={handleChange}
              />

              {error && (
                <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
              )}

              <BaseButton
                type="primary"
                size="large"
                style={{ width: "80%", backgroundColor: "black", marginTop: "20px" }}
                onClick={handleClick}
              >
                Next
              </BaseButton>

              <div style={{ marginTop: "10px" }}>
                <BaseButton onClick={skipClick} type="text">
                  Skip
                </BaseButton>
              </div>
            </Col>
          </Row>
        </ResponsiveCol>

        {/* Side image layout */}
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
              <div className="w-[638px] ml-10 mt-7 max-lg:w-auto max-lg:ml-0 max-lg:mt-0">
                <Title
                  level={2}
                  className="font-satoshi font-semibold text-4xl leading-10 text-black"
                >
                  Healthy employees, Productive employees.
                </Title>
                <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                </Text>
              </div>
              <img
                src="/step6.png"
                alt="Step 6"
                className="w-[470px] ml-[290px] max-lg:ml-0 max-lg:w-auto"
              />
            </div>
          </Layout.Content>
        </Layout>
      </Row>
    </>
  );
}

export default StepSix;
