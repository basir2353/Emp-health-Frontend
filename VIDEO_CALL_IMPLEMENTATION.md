# Video Call System Implementation

## Overview

This project includes a comprehensive video calling system with two main implementations:

1. **WebRTC Video Call** - Direct peer-to-peer video calling with Socket.io signaling
2. **ZegoUIKit Video Room** - Professional video conferencing with multi-participant support

## Features

### WebRTC Implementation
- ✅ Real-time peer-to-peer video/audio streaming
- ✅ Socket.io signaling server integration
- ✅ User presence management
- ✅ Incoming call notifications
- ✅ Audio/video toggle controls
- ✅ Connection status monitoring
- ✅ Call acceptance/rejection
- ✅ End call functionality

### ZegoUIKit Implementation
- ✅ Multi-participant video rooms
- ✅ Screen sharing capabilities
- ✅ Built-in text chat
- ✅ User list management
- ✅ Room link sharing
- ✅ Professional UI components

## Components

### Core Components

#### 1. VideoCall.tsx
Main component for WebRTC video calling functionality.

```tsx
import VideoCall from './Call/VideoCall';

const currentUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'employee' // or 'doctor'
};

<VideoCall currentUser={currentUser} />
```

#### 2. VideoRoom.tsx
Component for ZegoUIKit video room functionality.

```tsx
import VideoRoom from './Call/VideoRoom';

const user = {
  id: 'user-123',
  name: 'John Doe'
};

<VideoRoom roomID="room-123" user={user} />
```

#### 3. VideoCallExample.tsx
Comprehensive demo component showcasing all features.

```tsx
import VideoCallExample from './Call/VideoCallExample';

<VideoCallExample />
```

### Supporting Components

- **CallControls.tsx** - Audio/video controls and call management
- **UserList.tsx** - Online users list with call initiation
- **IncomingCallDialog.tsx** - Incoming call notification dialog
- **VideoStream.tsx** - Video display component
- **useVideoCall.ts** - Custom hook for WebRTC and socket management

## Dependencies

All required dependencies are already installed:

```json
{
  "socket.io-client": "^4.8.1",
  "@zegocloud/zego-uikit-prebuilt": "^2.15.1",
  "lucide-react": "^0.511.0",
  "antd": "^5.14.0"
}
```

## Configuration

### Socket.io Server
The system connects to: `https://empolyee-backedn.onrender.com/`

### ZegoUIKit Configuration
- App ID: `1757000422`
- Server Secret: `0ce7e80431c85f491e586b683d3737b4`

## Usage Examples

### Basic WebRTC Video Call

```tsx
import React from 'react';
import VideoCall from './Call/VideoCall';

const App = () => {
  const currentUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'employee'
  };

  return (
    <div>
      <VideoCall currentUser={currentUser} />
    </div>
  );
};
```

### ZegoUIKit Video Room

```tsx
import React from 'react';
import VideoRoom from './Call/VideoRoom';

const App = () => {
  const user = {
    id: 'user-123',
    name: 'John Doe'
  };

  return (
    <div>
      <VideoRoom roomID="meeting-room-123" user={user} />
    </div>
  );
};
```

### Demo Component

```tsx
import React from 'react';
import VideoCallExample from './Call/VideoCallExample';

const App = () => {
  return (
    <div>
      <VideoCallExample />
    </div>
  );
};
```

## API Integration

### Socket Events

The system uses the following socket events:

**Client to Server:**
- `user-joined` - User joins the system
- `initiate-call` - Start a call
- `accept-call` - Accept incoming call
- `reject-call` - Reject incoming call
- `end-call` - End current call
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange
- `get-available-users` - Get online users

**Server to Client:**
- `available-users` - List of online users
- `incoming-call` - Incoming call notification
- `call-accepted` - Call accepted confirmation
- `call-rejected` - Call rejected notification
- `call-ended` - Call ended notification

### REST API Endpoints

- `GET /api/auth/online-users` - Get online employees
- `GET /api/auth/online-doctors` - Get online doctors
- `POST /api/auth/store-socket-id` - Store user socket ID

## Styling

The system uses Tailwind CSS with custom color variables and animations:

### Custom CSS Classes
- `.bg-video-control` - Video control button background
- `.bg-video-bg` - Video background
- `.shadow-video` - Video container shadow
- `.animate-pulse-glow` - Pulsing glow animation
- `.animate-slide-in-up` - Slide up animation
- `.animate-fade-in` - Fade in animation

### Color Variables
- `--background`, `--foreground` - Main colors
- `--primary`, `--secondary` - Theme colors
- `--destructive` - Error/danger colors
- `--muted` - Muted text colors
- `--border` - Border colors

## Testing

Use the `CallTest` component to test API endpoints and socket connections:

```tsx
import CallTest from './Call/CallTest';

<CallTest />
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Considerations

1. **HTTPS Required** - WebRTC requires HTTPS in production
2. **Token Authentication** - Use proper authentication tokens
3. **CORS Configuration** - Configure CORS for your domain
4. **Socket.io Security** - Implement proper socket authentication

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access**
   - Ensure HTTPS is enabled
   - Check browser permissions
   - Verify device availability

2. **Connection Issues**
   - Check socket server connectivity
   - Verify network configuration
   - Check firewall settings

3. **WebRTC Issues**
   - Check ICE server configuration
   - Verify STUN/TURN servers
   - Check NAT traversal

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'socket.io-client:*');
```

## Performance Optimization

1. **Video Quality** - Adjust video constraints based on network
2. **Audio Processing** - Enable echo cancellation and noise suppression
3. **Connection Management** - Implement proper cleanup on component unmount
4. **Memory Management** - Stop media tracks when not in use

## Future Enhancements

- [ ] Recording functionality
- [ ] File sharing during calls
- [ ] Virtual backgrounds
- [ ] AI-powered features
- [ ] Mobile app integration
- [ ] Advanced analytics

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify network connectivity
3. Test with the CallTest component
4. Review socket server logs
