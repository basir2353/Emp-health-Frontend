import React, { useState, useEffect, useRef, useContext } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Button, Input, Card, Typography, message, Spin } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';

const { Title, Paragraph } = Typography;

// ZEGOCLOUD credentials
const appID = 695626790;
const serverSecret = '08b17ed68b9d48ed301e32184ed7a624';

const Call = () => {
  const { currentUser } = useContext(AuthContext);
  const [zegoClient, setZegoClient] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    localStream: 'Not initialized',
    remoteStream: 'Not initialized',
    connectionState: 'N/A',
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Generate unique userID
  useEffect(() => {
    if (currentUser?.id) {
      setUserId(`user_${currentUser.id}`);
    } else {
      // Fallback to random ID if currentUser is not available
      const randomId = `user_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(randomId);
    }
    console.log('Generated userID:', userId);
    setDiagnosticInfo(prev => ({ ...prev, connectionState: `User ID: ${userId}` }));
  }, [currentUser, userId]);

  // Initialize ZEGOCLOUD client
  useEffect(() => {
    const zg = new ZegoExpressEngine(appID, serverSecret);
    setZegoClient(zg);

    zg.checkSystemRequirements().then(result => {
      console.log('System requirements:', result);
      if (!result.webRTC) {
        message.error('WebRTC not supported in this browser.');
        setDiagnosticInfo(prev => ({ ...prev, connectionState: 'WebRTC not supported' }));
      }
    });

    return () => {
      console.log('Cleaning up ZEGOCLOUD client');
      if (zg && roomId) {
        zg.logoutRoom(roomId.toLowerCase());
      }
      if (zg && localStream) {
        zg.stopPublishingStream(userId);
        zg.destroyStream(localStream);
      }
    };
  }, [roomId, localStream, userId]);

  // Join room and initialize media
  const joinRoom = async () => {
    if (!zegoClient) {
      message.error('ZEGOCLOUD client not initialized');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: 'Client not initialized' }));
      return;
    }
    if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
      message.error('Please enter a valid Room ID');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: 'Invalid Room ID' }));
      return;
    }
    if (!userId) {
      message.error('User ID not set. Please try again.');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: 'User ID not set' }));
      return;
    }

    try {
      console.log('Joining room with:', { roomId, userId, userName: currentUser?.name || userId, appID, serverSecret });
      await zegoClient.loginRoom(
        roomId.toLowerCase(),
        { userID: userId, userName: currentUser?.name || userId },
        { appID, serverSecret }
      );
      console.log('Logged into ZEGOCLOUD room:', roomId);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `Logged into room ${roomId}` }));
      setCallStatus('Connected to room');

      const stream = await zegoClient.createStream({
        camera: { video: true, audio: true, videoQuality: 4 },
      });
      setLocalStream(stream);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      await zegoClient.startPublishingStream(userId, stream);
      console.log('Publishing local stream:', stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch(e => {
          console.error('Local video play error:', e);
          setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${e.message}` }));
          message.error(`Local video error: ${e.message}`);
        });
      }

      zegoClient.on('streamAdd', async (streamList) => {
        const remote = streamList[0];
        console.log('Remote stream added:', remote);
        const streamObj = await zegoClient.startPlayingStream(remote.streamID);
        setRemoteStream(streamObj);
        setDiagnosticInfo(prev => ({
          ...prev,
          remoteStream: `Initialized (Stream ID: ${remote.streamID})`,
        }));
        if (remoteVideoRef.current) {
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = streamObj;
              remoteVideoRef.current.play().catch(e => {
                console.error('Remote video play error:', e);
                setDiagnosticInfo(prev => ({ ...prev, remoteStream: `Error: ${e.message}` }));
                message.error(`Failed to play remote video: ${e.message}`);
              });
            }
          }, 5000); // Increased to 5 seconds to prevent play interruption
        }
      });

      zegoClient.on('roomUserUpdate', (roomID, updateType, userList) => {
        console.log('Room user update:', { roomID, updateType, userList });
        setDiagnosticInfo(prev => ({
          ...prev,
          connectionState: `Room update: ${updateType} - ${userList.length} users`,
        }));
      });
    } catch (error) {
      console.error('Error joining room:', error);
      setDiagnosticInfo(prev => ({
        ...prev,
        localStream: `Error: ${error.message}`,
        connectionState: `Error: ${error.message}`,
      }));
      setMediaError('Failed to access media: ' + error.message);
      message.error('Failed to access media: ' + error.message);
    }
  };

  // End call
  const endCall = async () => {
    console.log('Ending call');
    if (zegoClient && localStream) {
      zegoClient.stopPublishingStream(userId);
      zegoClient.destroyStream(localStream);
      setLocalStream(null);
    }
    if (zegoClient && roomId) {
      zegoClient.logoutRoom(roomId.toLowerCase());
    }
    setRemoteStream(null);
    setCallStatus('Disconnected');
    setDiagnosticInfo(prev => ({
      ...prev,
      localStream: 'Not initialized',
      remoteStream: 'Not initialized',
      connectionState: 'Disconnected',
    }));
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream && zegoClient) {
      const enabled = !isAudioOn;
      zegoClient.muteMicrophone(!enabled);
      setIsAudioOn(enabled);
      console.log('Audio:', enabled);
      message.info(enabled ? 'Microphone ON' : 'Microphone OFF');
    } else {
      message.error('No stream or client available');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'No stream or client' }));
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream && zegoClient) {
      const enabled = !isVideoOn;
      zegoClient.muteCamera(!enabled);
      setIsVideoOn(enabled);
      console.log('Video:', enabled);
      message.info(enabled ? 'Camera ON' : 'Camera OFF');
    } else {
      message.error('No stream or client available');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'No stream or client' }));
    }
  };

  // Test media devices
  const testMedia = async () => {
    if (!zegoClient) {
      message.error('ZEGOCLOUD client not initialized');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Client not initialized' }));
      return;
    }
    try {
      const stream = await zegoClient.createStream({
        camera: { video: true, audio: true, videoQuality: 4 },
      });
      console.log('Test media stream:', stream);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => {
          console.error('Test video play error:', e);
          setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${e.message}` }));
        });
      }
      message.success('Camera and microphone working!');
      zegoClient.destroyStream(stream);
    } catch (error) {
      console.error('Test media error:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}` }));
      message.error('Failed to access media: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center">
        <Title level={3}>Video Call</Title>
        <div className="flex items-center space-x-4">
          <span className="text-sm">User ID: {userId || 'Not set'}</span>
          <span className="text-sm">Status: {callStatus}</span>
          <Button type="primary" danger onClick={endCall}>
            Leave Call
          </Button>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Card className="mb-4 shadow-md">
          <Paragraph>
            <strong>Status:</strong> {callStatus}
          </Paragraph>
          {roomId && (
            <Paragraph>
              <strong>Room ID:</strong> {roomId}
            </Paragraph>
          )}
          {currentUser && (
            <Paragraph>
              <strong>Logged in as:</strong> {currentUser.name || currentUser.email} ({currentUser.role})
            </Paragraph>
          )}
        </Card>

        <Card className="mb-4 border-blue-500 border-2">
          <Title level={4}>Diagnostics</Title>
          <Paragraph>
            <strong>User ID:</strong> {userId}
          </Paragraph>
          <Paragraph>
            <strong>Local Stream:</strong> {diagnosticInfo.localStream}
          </Paragraph>
          <Paragraph>
            <strong>Remote Stream:</strong> {diagnosticInfo.remoteStream}
          </Paragraph>
          <Paragraph>
            <strong>Connection State:</strong> {diagnosticInfo.connectionState}
          </Paragraph>
        </Card>

        {mediaError && (
          <Card className="mb-4 border-red-500 border-2">
            <Title level={4}>Media Error</Title>
            <Paragraph className="text-red-500">{mediaError}</Paragraph>
            <Button type="primary" onClick={() => joinRoom()}>
              Retry
            </Button>
          </Card>
        )}

        {!localStream && !mediaError && (
          <Card className="mb-4 border-blue-500 border-2">
            <Title level={4}>Join Room</Title>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Enter Room ID (e.g., room123)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-64"
              />
              <Button
                type="primary"
                onClick={() => joinRoom()}
                disabled={!roomId.trim() || !zegoClient || !userId}
                style={{ backgroundColor: 'black' }}
              >
                Join
              </Button>
              <Button onClick={testMedia}>
                Test Media
              </Button>
            </div>
            <Paragraph className="text-sm text-gray-500">
              Share the Room ID with {currentUser?.role === 'doctor' ? 'a patient' : 'a doctor'} to start a video call!
            </Paragraph>
          </Card>
        )}

        {localStream && (
          <Card className="mb-4 bg-green-50">
            <Title level={4}>Call Controls</Title>
            <div className="flex space-x-2">
              <Button
                style={{ backgroundColor: 'black' }}
                type={isAudioOn ? 'primary' : 'default'}
                onClick={toggleAudio}
                icon={<span>{isAudioOn ? '🎤' : '🔇'}</span>}
              >
                {isAudioOn ? 'Mute' : 'Unmute'}
              </Button>
              <Button
                style={{ backgroundColor: 'black' }}
                type={isVideoOn ? 'primary' : 'default'}
                onClick={toggleVideo}
                icon={<span>{isVideoOn ? '📹' : '📷'}</span>}
              >
                {isVideoOn ? 'Stop Video' : 'Start Video'}
              </Button>
              <Button danger onClick={endCall}>
                End Call
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Title level={4} className="text-center">
              Your Video
            </Title>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[500px] bg-black rounded-lg object-cover border-2 border-blue-500"
            />
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              You ({isVideoOn ? 'Camera On' : 'Camera Off'})
            </div>
          </div>
          <div className="relative">
            <Title level={4} className="text-center">
              {currentUser?.role === 'doctor' ? 'Patient' : 'Doctor'}
            </Title>
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[500px] bg-black rounded-lg object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-full h-[500px] bg-black rounded-lg flex items-center justify-center border-2 border-green-500">
                <Spin tip={`Waiting for ${currentUser?.role === 'doctor' ? 'patient' : 'doctor'} video...`} />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              {remoteStream ? (currentUser?.role === 'doctor' ? 'Patient' : 'Doctor') : `Waiting for ${currentUser?.role === 'doctor' ? 'patient' : 'doctor'}...`}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Call;