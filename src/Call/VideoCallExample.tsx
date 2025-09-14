import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert, Divider } from 'antd';
import { Video, Phone, Users, Settings } from 'lucide-react';
import VideoCall from './VideoCall';
import VideoRoom from './VideoRoom';
import CallTest from './CallTest';

const { Title, Paragraph, Text } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "employee";
}

const VideoCallExample: React.FC = () => {
  const [currentView, setCurrentView] = useState<'demo' | 'video-call' | 'video-room' | 'test'>('demo');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'employee'
  });

  const switchUserRole = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'doctor' ? 'employee' : 'doctor',
      name: prev.role === 'doctor' ? 'Demo Employee' : 'Demo Doctor'
    }));
  };

  const renderDemo = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
          <Video className="w-10 h-10 text-white" />
        </div>
        <Title level={1}>Video Call System</Title>
        <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive video calling solution with WebRTC, Socket.io, and ZegoUIKitPrebuilt integration.
          Choose your demo mode below to explore the features.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WebRTC Video Call */}
        <Card 
          hoverable 
          className="text-center"
          onClick={() => setCurrentView('video-call')}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <Title level={4}>WebRTC Video Call</Title>
              <Paragraph className="text-sm text-gray-600">
                Direct peer-to-peer video calling with WebRTC, Socket.io signaling, and real-time user management.
              </Paragraph>
            </div>
            <div className="space-y-2 text-xs text-left">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time audio/video</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Socket.io signaling</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>User presence management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Call controls & notifications</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ZegoUIKit Video Room */}
        <Card 
          hoverable 
          className="text-center"
          onClick={() => setCurrentView('video-room')}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <Title level={4}>ZegoUIKit Video Room</Title>
              <Paragraph className="text-sm text-gray-600">
                Professional video conferencing with ZegoUIKitPrebuilt, supporting multiple participants and advanced features.
              </Paragraph>
            </div>
            <div className="space-y-2 text-xs text-left">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Multi-participant support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Screen sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Text chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Room management</span>
              </div>
            </div>
          </div>
        </Card>

        {/* API Testing */}
        <Card 
          hoverable 
          className="text-center"
          onClick={() => setCurrentView('test')}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <Title level={4}>API Testing</Title>
              <Paragraph className="text-sm text-gray-600">
                Test and debug the video call API endpoints, user management, and socket connections.
              </Paragraph>
            </div>
            <div className="space-y-2 text-xs text-left">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Endpoint testing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>User discovery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Socket debugging</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connection status</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Divider />

      {/* Current User Info */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <Title level={4}>Current Demo User</Title>
            <Space direction="vertical" size="small">
              <Text><strong>Name:</strong> {currentUser.name}</Text>
              <Text><strong>Role:</strong> {currentUser.role}</Text>
              <Text><strong>ID:</strong> {currentUser.id}</Text>
            </Space>
          </div>
          <Button onClick={switchUserRole}>
            Switch to {currentUser.role === 'doctor' ? 'Employee' : 'Doctor'}
          </Button>
        </div>
      </Card>

      {/* Features Overview */}
      <Card>
        <Title level={4}>System Features</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Title level={5}>WebRTC Implementation</Title>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Peer-to-peer video/audio streaming</li>
              <li>• ICE candidate exchange</li>
              <li>• Media stream management</li>
              <li>• Connection state monitoring</li>
              <li>• Audio/video toggle controls</li>
            </ul>
          </div>
          <div>
            <Title level={5}>Socket.io Integration</Title>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Real-time signaling server</li>
              <li>• User presence management</li>
              <li>• Call initiation & acceptance</li>
              <li>• Incoming call notifications</li>
              <li>• Connection status updates</li>
            </ul>
          </div>
          <div>
            <Title level={5}>ZegoUIKit Features</Title>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Multi-participant video rooms</li>
              <li>• Screen sharing capabilities</li>
              <li>• Built-in text chat</li>
              <li>• User list management</li>
              <li>• Room link sharing</li>
            </ul>
          </div>
          <div>
            <Title level={5}>UI/UX Components</Title>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Responsive video call interface</li>
              <li>• Incoming call dialog</li>
              <li>• User list with online status</li>
              <li>• Call controls with animations</li>
              <li>• Connection status indicators</li>
            </ul>
          </div>
        </div>
      </Card>

      <Alert
        message="Getting Started"
        description="Click on any of the demo cards above to explore the video call functionality. Make sure you have a working camera and microphone for the best experience."
        type="info"
        showIcon
      />
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'video-call':
        return <VideoCall currentUser={currentUser} />;
      case 'video-room':
        return <VideoRoom roomID="demo-room-123" user={currentUser} />;
      case 'test':
        return <CallTest />;
      default:
        return renderDemo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {currentView !== 'demo' && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setCurrentView('demo')}
                type="text"
              >
                ← Back to Demo
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <Title level={4} className="!mb-0">
                {currentView === 'video-call' && 'WebRTC Video Call'}
                {currentView === 'video-room' && 'ZegoUIKit Video Room'}
                {currentView === 'test' && 'API Testing'}
              </Title>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{currentUser.name} ({currentUser.role})</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default VideoCallExample;
