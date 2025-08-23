// test/notificationTest.js
const axios = require('axios');

class NotificationTest {
  constructor(baseURL, adminToken, userToken) {
    this.baseURL = baseURL;
    this.adminToken = adminToken;
    this.userToken = userToken;
  }

  async testIdentityRequestFlow() {
    console.log('🧪 Testing Identity Request Flow...');
    
    try {
      // Step 1: Admin requests identity
      console.log('1. Admin requesting identity...');
      const reportId = 'your-test-report-id';
      
      const identityRequest = await axios.post(
        `${this.baseURL}/api/notifications/request-identity/${reportId}`,
        {},
        { headers: { 'x-auth-token': this.adminToken } }
      );
      
      console.log('✅ Identity request sent:', identityRequest.data);
      
      // Step 2: Simulate user response
      console.log('2. User responding to identity request...');
      const notificationId = identityRequest.data.notificationId;
      
      const userResponse = await axios.post(
        `${this.baseURL}/api/notifications/identity-response/${notificationId}`,
        { approved: true, reportId },
        { headers: { 'x-auth-token': this.userToken } }
      );
      
      console.log('✅ User response sent:', userResponse.data);
      
      // Step 3: Check notifications
      console.log('3. Checking notifications...');
      const notifications = await axios.get(
        `${this.baseURL}/api/notifications/user/admin-user-id`,
        { headers: { 'x-auth-token': this.adminToken } }
      );
      
      console.log('✅ Notifications retrieved:', notifications.data);
      
    } catch (error) {
      console.error('❌ Test failed:', error.response?.data || error.message);
    }
  }

  async testFCMTokenStorage() {
    console.log('🧪 Testing FCM Token Storage...');
    
    try {
      const testToken = 'test-fcm-token-123';
      
      const response = await axios.post(
        `${this.baseURL}/api/notifications/fcm-token`,
        { fcmToken: testToken },
        { headers: { 'x-auth-token': this.userToken } }
      );
      
      console.log('✅ FCM Token stored:', response.data);
      
    } catch (error) {
      console.error('❌ FCM Token test failed:', error.response?.data || error.message);
    }
  }
}

// Usage
const tester = new NotificationTest(
  'http://localhost:3000', // Your backend URL
  'admin-jwt-token',       // Replace with actual admin token
  'user-jwt-token'         // Replace with actual user token
);

// Run tests
async function runTests() {
  await tester.testFCMTokenStorage();
  await tester.testIdentityRequestFlow();
}

runTests();