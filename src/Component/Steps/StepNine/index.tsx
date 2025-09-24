import {
  Button,
  Col,
  Flex,
  Layout,
  Row,
  Typography,
  Form,
  Input,
  message,
} from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "styled-components";
import { saveStepData, completeOnboarding, completeStep } from "../../../utils/onboardingUtils";

function StepNine() {
  useEffect(() => {
    // Mark step 9 as completed in the new onboarding system
    completeStep(9);
  }, []);


  const getUser = localStorage.getItem("loggedInUser");
  const extractNineStep = localStorage.getItem("onboardingSteps");

  let extractNineStepData: any = null;
  let extractUser: any = null;
  let extractUserId: any = null;
  
  try {
    extractNineStepData = extractNineStep ? JSON.parse(extractNineStep) : null;
    extractUser = getUser ? JSON.parse(getUser) : null;
    extractUserId = extractUser ? extractUser.id : null;
  } catch (error) {
    console.error("Failed to parse onboardingSteps:", error);
    extractNineStepData = null;
  }
    const storeOnboardingStep = async (userId:any, stepData:any) => {
      try {
        const response = await fetch('https://empolyee-backedn.onrender.com/api/auth/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            step: stepData.step,
            data: stepData
          })
        });
    
        const result = await response.json();
        
        if (result.success) {
          console.log('Step stored successfully:', result.data);
          return result.data;
        } else {
          console.error('Error storing step:', result.message);
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Failed to store onboarding step:', error);
        throw error;
      }
    };

    
      
    
   useEffect(()=>{
      storeOnboardingStep(extractUserId, extractNineStepData)
    },[extractUserId])
  const { Title, Text } = Typography;
  const data = useSelector((state: any) => state["onboard"]);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const handleFinish = (values: { name: string; email: string }) => {
    // Save step data
    saveStepData(9, values);
    
    // Complete the entire onboarding process
    completeOnboarding();
    
    message.success("Profile completed successfully! Welcome to your health dashboard.");
    
    // Redirect to health dashboard
    navigate("/health");
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
              <Title>You’ve completed your profile?</Title>
              <Text type="secondary">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda veniam facere in delectus, maxime iusto non id reici
              </Text>
              <Flex wrap="wrap" gap="large" justify="center">
                <img src="/assests/finishedIcon.svg" alt="Finished Icon" />
              </Flex>
              <Text>You got a Complete profile badge</Text>

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 20 }}
              >
                
                <Button onClick={(()=> storeOnboardingStep)} type="primary" htmlType="submit" style={{ backgroundColor: "#003e61", borderColor: "#4F46E5" }}>
                  Continue
                </Button>
              </Form>

              <div style={{ marginTop: "10px" }}>
                <Button type="text" >What are Quasks?</Button>
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
            <div className="w-[638px] max-lg:w-auto max-lg:ml-0 ml-10 mt-2">
              <Title
                level={2}
                className="font-satoshi font-semibold text-4xl leading-10 text-black"
              >
                Your wellness is your productivity.
              </Title>
              <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos.
              </Text>
              <img
                src="/step9.png"
                alt="Step 9"
                className="w-[430px] max-lg:w-auto max-lg:ml-0 ml-[290px]"
              />
            </div>
          </Layout.Content>
        </Layout>
      </Row>

      <ToastContainer autoClose={8000} />
    </>
  );
}

export default StepNine;