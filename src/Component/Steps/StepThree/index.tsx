import {
  Button,
  Col,
  Input,
  Typography,
  Radio,
  Layout,
  Row,
  Flex,
  Tag,
  Tooltip,
  theme,
} from "antd";
import InputWithSwitch from "../../Input";
import { useNavigate } from "react-router-dom";
import type { InputRef, RadioChangeEvent, SelectProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { StepOneImgUrl } from "../../../Constant";
import { setEmployeeBloodGroup } from "../../../features/onboardSlice";
import { BaseButton } from "../../form/base-button";
import { PlusOutlined } from "@ant-design/icons";
import { saveStepData } from "../../../utils/onboardingStorage"; // ✅ Added
import { message } from "antd";
type SelectCommonPlacement = SelectProps["placement"];

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginInlineEnd: 8,
};

const ResponsiveCol = styled(Col)`
  text-align: center;
  flex: 0 0 50%;
  max-width: 50%;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const StyledRadioButton = styled(Radio.Button)`
  &:not(:first-child)::before {
    width: 0px;
  }
`;

function StepThree() {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([
    "O-negative",
    "O-positive",
    "A-negative",
    "A-positive",
    "B-negative",
    "B-positive",
    "AB-positive",
    "AB-negative",
  ]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Title, Text } = Typography;

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");

  const handleClick = () => {
    if (!selectedBloodGroup) {
     message.error("Please select a blood group before proceeding.");
      return;
    }

    dispatch(setEmployeeBloodGroup({ blood_group: selectedBloodGroup }));
    saveStepData(3, { blood_group: selectedBloodGroup }); // ✅ Save to LS
    navigate("/step-4");
  };

  const handleBloodGroupChange = (e: RadioChangeEvent) => {
    setSelectedBloodGroup(e.target.value);
  };

  useEffect(() => {
    if (inputVisible) inputRef.current?.focus();
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => setInputVisible(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditInputValue(e.target.value);

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 32,
    background: token.colorBgContainer,
    borderRadius: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <Row
        style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
        justify="space-between"
        align="middle"
      >
        <ResponsiveCol span={12}>
          <Row justify="center">
            <Col span={12}>
              <Title>Select your Blood group</Title>
              <Text type="secondary">
                Please select your blood group from the available options.
              </Text>

              <Flex gap="4px 0" wrap="wrap" style={{ margin: "20px 0px" }}>
               
                 <Radio.Group
                value={selectedBloodGroup}
                onChange={handleBloodGroupChange}
                style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap" }}
              >
                {tags.map((item) => (
                  <StyledRadioButton
                    key={item}
                    value={item}
                    style={{ borderRadius: "20px", margin: "5px" }}
                  >
                    {item}
                  </StyledRadioButton>
                ))}
              </Radio.Group>
                {inputVisible ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
                    Add New
                  </Tag>
                )}
              </Flex>
              <BaseButton
                type="primary"
                size="large"
                style={{ width: "90%", backgroundColor: "black" }}
                onClick={handleClick}
              >
                Next
              </BaseButton>
            </Col>
          </Row>
        </ResponsiveCol>

        <Layout style={{ width: "720px", height: "calc(100vh - 81px)", right: "0px" }}>
          <Layout.Content className="bg-blue-100">
            <div className="w-[638px] max-lg:w-auto ml-10 max-lg:ml-0 mt-5">
              <Title level={2} className="font-satoshi font-semibold text-4xl leading-10 text-black">
                Book appointments effortlessly.
              </Title>
              <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                libero et velit interdum, ac aliquet odio mattis.
              </Text>
            </div>
            <img
              src="/step3.png"
              alt="Step 3"
              className="w-[450px] ml-[315px] max-lg:w-auto max-lg:ml-0"
            />
          </Layout.Content>
        </Layout>
      </Row>
    </>
  );
}

export default StepThree;
