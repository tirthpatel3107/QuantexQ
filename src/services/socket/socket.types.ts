/**
 * Socket Service Types
 * Types for WebSocket/Socket.IO real-time communication
 */

// ============================================
// Socket Event Types
// ============================================

export type SocketEventType =
  | "network:sources:update"
  | "network:destinations:update"
  | "network:protocols:update"
  | "daq:overview:update"
  | "daq:calibration:update"
  | "daq:streaming:update"
  | "settings:update"
  | "system:status"
  | "error";

// ============================================
// Socket Event Payload
// ============================================

export interface SocketEvent<T = unknown> {
  type: SocketEventType;
  data: T;
  timestamp: string;
  source?: string;
}

// ============================================
// Socket Connection Status
// ============================================

export type SocketStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error";

export interface SocketConnectionInfo {
  status: SocketStatus;
  connectedAt?: string;
  lastError?: string;
  reconnectAttempts?: number;
}

// ============================================
// Socket Subscription
// ============================================

export interface SocketSubscription {
  id: string;
  eventType: SocketEventType;
  callback: (event: SocketEvent) => void;
  unsubscribe: () => void;
}

// ============================================
// Socket Configuration
// ============================================

export interface SocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  timeout?: number;
  autoConnect?: boolean;
}

// ============================================
// Specific Event Data Types
// ============================================

export interface NetworkSourceUpdateEvent {
  sourceId: string;
  status: "connected" | "disconnected" | "error";
  data?: Record<string, unknown>;
}

export interface DaqChannelUpdateEvent {
  channelId: string;
  value: number;
  timestamp: string;
  unit: string;
}

export interface SystemStatusEvent {
  status: "online" | "offline" | "maintenance";
  message?: string;
  affectedSections?: string[];
}
