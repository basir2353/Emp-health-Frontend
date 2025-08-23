import React, { forwardRef } from 'react';
import { VideoOff, Mic, MicOff, User } from 'lucide-react';

interface VideoStreamProps {
  title: string;
  subtitle: string;
  isLocal?: boolean;
  isMuted?: boolean;
  hasVideo?: boolean;
  className?: string;
}

const VideoStream = forwardRef<HTMLVideoElement, VideoStreamProps>(
  ({ title, subtitle, isLocal = false, isMuted = false, hasVideo = true, className = "" }, ref) => {
    return (
      <div
        className={`relative overflow-hidden bg-video-bg border-border shadow-video animate-slide-in-up ${className}`}
      >
        <div className="aspect-video relative bg-gradient-to-br from-muted/20 to-muted/40">
          {hasVideo ? (
            <video
              ref={ref}
              autoPlay
              playsInline
              muted={isLocal}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No video</p>
              </div>
            </div>
          )}

          {/* Overlay Controls */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <div className="bg-black/60 text-white border-none backdrop-blur-sm px-2 py-1 rounded">
              {title}
            </div>

            {isLocal && (
              <div className="flex items-center space-x-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isMuted ? "bg-destructive" : "bg-success"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-3 h-3 text-white" />
                  ) : (
                    <Mic className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasVideo ? "bg-success animate-pulse" : "bg-muted-foreground"
                }`}
              />
              <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                {subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoStream.displayName = "VideoStream";

export default VideoStream;
