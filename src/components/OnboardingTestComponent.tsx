// import React, { useState } from 'react';
// import { Card, Button, Space, Typography, Divider, Alert } from 'antd';
// import { PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
// import { 
//   getOnboardingProgress, 
//   storeOnboardingStep, 
//   checkOnboardingHealth,
//   storeMultipleOnboardingSteps 
// } from '../api/onboardingApi.js';
// import OnboardingProgressDisplay from './OnboardingProgressDisplay';

// const { Title, Text, Paragraph } = Typography;

// const OnboardingTestComponent: React.FC = () => {
//   const [testResults, setTestResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const addTestResult = (testName: string, success: boolean, data?: any, error?: any) => {
//     setTestResults(prev => [...prev, {
//       id: Date.now(),
//       testName,
//       success,
//       data,
//       error: error?.message || error,
//       timestamp: new Date().toLocaleTimeString()
//     }]);
//   };

//   const runHealthCheck = async () => {
//     setLoading(true);
//     try {
//       const result = await checkOnboardingHealth();
//       addTestResult('Health Check', true, result);
//     } catch (error) {
//       addTestResult('Health Check', false, null, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const runProgressTest = async () => {
//     setLoading(true);
//     try {
//       const result = await getOnboardingProgress();
//       addTestResult('Get Progress', true, result);
//     } catch (error) {
//       addTestResult('Get Progress', false, null, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const runStoreStepTest = async () => {
//     setLoading(true);
//     try {
//       const testStepData = {
//         height: '175',
//         unit: 'cm'
//       };
//       const result = await storeOnboardingStep(1, testStepData);
//       addTestResult('Store Step 1 (Height)', true, result);
//     } catch (error) {
//       addTestResult('Store Step 1 (Height)', false, null, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const runStoreMultipleTest = async () => {
//     setLoading(true);
//     try {
//       const testSteps = [
//         {
//           step: 2,
//           emergency_contact_relation: 'Spouse',
//           emergency_contact_name: 'John Doe',
//           emergency_contact: '+1234567890'
//         },
//         {
//           step: 3,
//           blood_group: 'O+'
//         }
//       ];
//       const result = await storeMultipleOnboardingSteps(testSteps);
//       addTestResult('Store Multiple Steps', true, result);
//     } catch (error) {
//       addTestResult('Store Multiple Steps', false, null, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const runAllTests = async () => {
//     setTestResults([]);
//     await runHealthCheck();
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await runProgressTest();
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await runStoreStepTest();
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await runStoreMultipleTest();
//   };

//   const clearResults = () => {
//     setTestResults([]);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <Title level={2}>Onboarding API Integration Test</Title>
//       <Paragraph>
//         This component tests the integration between the frontend and the comprehensive onboarding API.
//         Use this to verify that all endpoints are working correctly.
//       </Paragraph>

//       <Card title="API Test Controls" style={{ marginBottom: '20px' }}>
//         <Space wrap>
//           <Button 
//             type="primary" 
//             icon={<PlayCircleOutlined />}
//             onClick={runAllTests}
//             loading={loading}
//           >
//             Run All Tests
//           </Button>
//           <Button onClick={runHealthCheck} loading={loading}>
//             Health Check
//           </Button>
//           <Button onClick={runProgressTest} loading={loading}>
//             Get Progress
//           </Button>
//           <Button onClick={runStoreStepTest} loading={loading}>
//             Store Step 1
//           </Button>
//           <Button onClick={runStoreMultipleTest} loading={loading}>
//             Store Multiple
//           </Button>
//           <Button onClick={clearResults} disabled={testResults.length === 0}>
//             Clear Results
//           </Button>
//         </Space>
//       </Card>

//       {testResults.length > 0 && (
//         <Card title="Test Results" style={{ marginBottom: '20px' }}>
//           <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//             {testResults.map((result) => (
//               <div 
//                 key={result.id}
//                 style={{
//                   padding: '10px',
//                   marginBottom: '10px',
//                   border: '1px solid #f0f0f0',
//                   borderRadius: '6px',
//                   backgroundColor: result.success ? '#f6ffed' : '#fff2f0'
//                 }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
//                   {result.success ? (
//                     <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
//                   ) : (
//                     <div style={{ color: '#ff4d4f', marginRight: '8px' }}>❌</div>
//                   )}
//                   <Text strong>{result.testName}</Text>
//                   <Text type="secondary" style={{ marginLeft: 'auto' }}>
//                     {result.timestamp}
//                   </Text>
//                 </div>
//                 {result.data && (
//                   <Text code style={{ fontSize: '12px', display: 'block', marginTop: '5px' }}>
//                     {JSON.stringify(result.data, null, 2).substring(0, 200)}
//                     {JSON.stringify(result.data).length > 200 && '...'}
//                   </Text>
//                 )}
//                 {result.error && (
//                   <Alert 
//                     message={result.error}
//                     type="error" 
//                     style={{ marginTop: '5px', fontSize: '12px' }}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       <Divider />

//       <Card title="Live Progress Display">
//         <OnboardingProgressDisplay showRefresh={true} />
//       </Card>

//       <Card title="Compact Progress Display" style={{ marginTop: '20px' }}>
//         <OnboardingProgressDisplay showRefresh={true} compact={true} />
//       </Card>
//     </div>
//   );
// };

// export default OnboardingTestComponent;
