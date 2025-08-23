import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff,
  Settings
} from 'lucide-react';

interface CallControlsProps {
  isCallActive: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  isCallActive,
  isAudioOn,
  isVideoOn,
  onToggleAudio,
  onToggleVideo,
  onEndCall
}) => {
  return (
    <div className="p-6 bg-div/50 border-border shadow-div-custom">
      <div className="flex items-center justify-center space-x-4">
        {/* Audio Control */}
        <button
          onClick={onToggleAudio}
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            isAudioOn 
              ? "bg-video-control hover:bg-video-control-hover text-foreground" 
              : "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-glow"
          }`}
        >
          {isAudioOn ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>

        {/* Video Control */}
        <button
          onClick={onToggleVideo}
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            isVideoOn 
              ? "bg-video-control hover:bg-video-control-hover text-foreground" 
              : "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-glow"
          }`}
        >
          {isVideoOn ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className={`w-14 h-14 rounded-full transition-all duration-300 bg-destructive hover:bg-destructive/90 text-destructive-foreground ${
            isCallActive ? "animate-pulse-glow" : ""
          }`}
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Settings */}
        <button
          className="w-14 h-14 rounded-full transition-all duration-300 bg-video-control hover:bg-video-control-hover border-border"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Status Text */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {isCallActive ? 'Call Active' : 'Ready to Call'}
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span
            className={`flex items-center space-x-1 ${
              isAudioOn ? "text-success" : "text-destructive"
            }`}
          >
            {isAudioOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            <span>{isAudioOn ? 'Mic On' : 'Mic Off'}</span>
          </span>
          <span
            className={`flex items-center space-x-1 ${
              isVideoOn ? "text-success" : "text-destructive"
            }`}
          >
            {isVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
            <span>{isVideoOn ? 'Camera On' : 'Camera Off'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CallControls;
