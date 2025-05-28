import { Col, Flex, Layout, Row, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setEmployeeAvatar } from "../../../features/onboardSlice";
import AndrewImage from "../../../public/images/onboarding/animoji-1.svg";
import JuliaImage from "../../../public/images/onboarding/animoji-2.svg";
import AnyaImage from "../../../public/images/onboarding/animoji-3.svg";
import KristyImage from "../../../public/images/onboarding/animoji-4.svg";
import VarunImage from "../../../public/images/onboarding/animoji.svg";
import SabastianImage from "../../../public/images/onboarding/sabastian.svg";
import { BaseButton } from "../../form/base-button";
import { styled } from "styled-components";
import { saveStepData } from "../../../utils/onboardingStorage";
import { message } from "antd";
function StepEight() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Title, Text } = Typography;
  const [avatar, setAvatar] = useState<string>("");

  const avatars = [
    { code: "AV-00", image: VarunImage, name: "Varun" },
    { code: "AV-01", image: SabastianImage, name: "Sabastian" },
    { code: "AV-02", image: AndrewImage, name: "Andrew" },
    { code: "AV-03", image: JuliaImage, name: "Julia" },
    { code: "AV-04", image: AnyaImage, name: "Anya" },
    { code: "AV-05", image: KristyImage, name: "Kristy" },
  ];

  const handleClick = () => {
    if (!avatar) return;
    dispatch(setEmployeeAvatar({ avatar }));
    saveStepData(8, { avatar });
    navigate("/step-9");
  };

  const handleSkip = () => {
    saveStepData(8, { avatar: null });
    navigate("/step-9");
  };

  const AvatarCard = styled.div<{ selected: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: ${(props) => (props.selected ? "3px solid #000" : "1px solid #ccc")};
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    transition: border 0.2s;
    width: 120px;
    background-color: #fff;

    &:hover {
      border-color: #1890ff;
    }

    img {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      margin-bottom: 8px;
    }
  `;

  return (
    <Row
      style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
      justify="space-between"
      align="middle"
    >
      <Col span={24} lg={12}>
        <Row justify="center" style={{ padding: "2rem" }}>
          <Col span={24} lg={18} style={{ textAlign: "center" }}>
            <Title>Select Your Companion Avatar</Title>
            <Text type="secondary">
              Pick an avatar to represent you in the app.
            </Text>

            <Flex
              wrap="wrap"
              gap="large"
              justify="center"
              style={{ margin: "30px 0" }}
            >
              {avatars.map((item) => (
                <AvatarCard
                  key={item.code}
                  selected={avatar === item.code}
                  onClick={() => setAvatar(item.image)}
                >
                  <img src={item.image} alt={item.name} />
                  <Text>{item.name}</Text>
                </AvatarCard>
              ))}
            </Flex>

            <BaseButton
              type="primary"
              size="large"
              style={{ width: "80%", backgroundColor: "black" }}
              onClick={handleClick}
            >
              Continue
            </BaseButton>

            <div style={{ marginTop: "10px" }}>
              <BaseButton type="text" onClick={handleSkip}>
                Skip
              </BaseButton>
            </div>
          </Col>
        </Row>
      </Col>

      <Layout
        className="w-full lg:w-[720px] h-[calc(100vh-81px)] lg:absolute lg:right-0 lg:top-[118px]"
      >
        <Layout.Content className="bg-blue-100">
          <div className="ml-10 mt-7 max-lg:ml-0">
            <Title
              level={3}
              className="font-satoshi font-semibold text-4xl text-black"
            >
              Your AI Companion
            </Title>
            <Text className="font-satoshi font-normal text-base text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum.
            </Text>
          </div>
          <div className="ml-[225px] max-lg:ml-0">
            <img
              src="/step8.png"
              alt="Step 8"
              className="w-[420px] max-lg:w-auto"
            />
          </div>
        </Layout.Content>
      </Layout>
    </Row>
  );
}

export default StepEight;
