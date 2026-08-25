import React from 'react';

export const NetworkDataCables: React.FC<{ isEmergency: boolean }> = ({ isEmergency }) => {
  const pulseColor = isEmergency ? '#f43f5e' : '#00e5ff';
  const cableColor = isEmergency ? 'rgba(244, 63, 94, 0.35)' : 'rgba(0, 229, 255, 0.25)';

  return (
    <svg 
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 5 }}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-emergency" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Linear Gradients for Fiber Lines */}
        <linearGradient id="fiber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* 1. Main Fiber Backbone Line: NOC -> Datacenter -> Kubernetes -> Network */}
      <path
        d="M 280 230 L 450 230 L 450 170 L 650 170 L 800 170 L 980 170"
        fill="none"
        stroke={cableColor}
        strokeWidth="3"
        strokeDasharray="6 4"
      />

      {/* 2. Fiber Line: Datacenter -> Databases */}
      <path
        d="M 650 290 L 650 390 L 650 490 L 530 490"
        fill="none"
        stroke={cableColor}
        strokeWidth="3"
        strokeDasharray="6 4"
      />

      {/* 3. Fiber Line: Kubernetes -> DevOps -> AI Lab */}
      <path
        d="M 1050 290 L 1050 390 L 1050 510 L 1020 630"
        fill="none"
        stroke={cableColor}
        strokeWidth="3"
        strokeDasharray="6 4"
      />

      {/* 4. Fiber Line: Security SOC -> Router Gateway */}
      <path
        d="M 1250 290 L 1250 420 L 320 420 L 320 470"
        fill="none"
        stroke={cableColor}
        strokeWidth="2.5"
        strokeDasharray="4 4"
      />

      {/* 5. Animated Moving Data Packets on Main Line */}
      <circle r="4.5" fill={pulseColor} filter="url(#glow-cyan)">
        <animateMotion
          path="M 280 230 L 450 230 L 450 170 L 650 170 L 800 170 L 980 170"
          dur={isEmergency ? "1.2s" : "2.4s"}
          repeatCount="indefinite"
        />
      </circle>

      <circle r="3.5" fill="#a855f7" filter="url(#glow-cyan)">
        <animateMotion
          path="M 980 170 L 800 170 L 650 170 L 450 170 L 450 230 L 280 230"
          dur={isEmergency ? "1.5s" : "3s"}
          repeatCount="indefinite"
        />
      </circle>

      {/* Moving Packets: Datacenter to DB */}
      <circle r="4" fill="#f59e0b" filter="url(#glow-cyan)">
        <animateMotion
          path="M 650 290 L 650 390 L 650 490 L 530 490"
          dur="2.0s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Moving Packets: K8s to DevOps & AI */}
      <circle r="4" fill="#8b5cf6" filter="url(#glow-cyan)">
        <animateMotion
          path="M 1050 290 L 1050 390 L 1050 510 L 1020 630"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Moving Packets: Security */}
      <circle r="4" fill="#10b981" filter="url(#glow-cyan)">
        <animateMotion
          path="M 1250 290 L 1250 420 L 320 420 L 320 470"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
