/**
 * Socket Service (Singleton)
 * Manages WebSocket/Socket.IO connections for real-time updates
 *
 * Features:
 * - Singleton pattern (one connection for entire app)
 * - Subscribe/unsubscribe to specific events
 * - Automatic reconnection
 * - Integration with TanStack Query cache
 *
 * Usage:
 * const socket = SocketService.getInstance();
 * socket.connect();
 * const subscription = socket.subscribe('network:sources:update', (event) => {
 *   console.log('Received update:', event);
 * });
 * // Later: subscription.unsubscribe();
 */

import type {
  SocketConfig,
  SocketConnectionInfo,
  SocketEvent,
  SocketEventType,
  SocketStatus,
  SocketSubscription,
} from "./socket.types";

class SocketService {
  private static instance: SocketService;
  private socket: WebSocket | null = null;
  private config: SocketConfig;
  private subscriptions: Map<string, SocketSubscription> = new Map();
  private connectionInfo: SocketConnectionInfo = { status: "disconnected" };
  private reconnectTimer: NodeJS.Timeout | null = null;
  private subscriptionIdCounter = 0;

  private constructor(config?: Partial<SocketConfig>) {
    this.config = {
      url: import.meta.env.VITE_SOCKET_URL || "ws://localhost:8080",
      reconnect: true,
      reconnectAttempts: 5,
      reconnectDelay: 3000,
      timeout: 10000,
      autoConnect: false,
      ...config,
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<SocketConfig>): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(config);
    }
    return SocketService.instance;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log("[Socket] Already connected");
      return;
    }

    this.updateConnectionStatus("connecting");

    // TODO: Uncomment when real WebSocket server is ready
    // try {
    //   this.socket = new WebSocket(this.config.url);
    //   this.setupSocketListeners();
    // } catch (error) {
    //   console.error('[Socket] Connection error:', error);
    //   this.handleConnectionError(error);
    // }

    // MOCK: Simulate connection
    console.log(`[Socket] Connecting to ${this.config.url}...`);
    setTimeout(() => {
      this.updateConnectionStatus("connected");
      console.log("[Socket] Connected (mock)");
    }, 1000);
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.updateConnectionStatus("disconnected");
    console.log("[Socket] Disconnected");
  }

  /**
   * Subscribe to specific event type
   */
  public subscribe(
    eventType: SocketEventType,
    callback: (event: SocketEvent) => void,
  ): SocketSubscription {
    const id = `sub-${++this.subscriptionIdCounter}`;

    const subscription: SocketSubscription = {
      id,
      eventType,
      callback,
      unsubscribe: () => this.unsubscribe(id),
    };

    this.subscriptions.set(id, subscription);
    console.log(`[Socket] Subscribed to ${eventType} (ID: ${id})`);

    return subscription;
  }

  /**
   * Unsubscribe from event
   */
  private unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      this.subscriptions.delete(subscriptionId);
      console.log(
        `[Socket] Unsubscribed from ${subscription.eventType} (ID: ${subscriptionId})`,
      );
    }
  }

  /**
   * Emit event to server
   */
  public emit(eventType: string, data: unknown): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("[Socket] Cannot emit - not connected");
      return;
    }

    // TODO: Uncomment when real WebSocket is ready
    // this.socket.send(JSON.stringify({ type: eventType, data }));

    console.log(`[Socket] Emit (mock): ${eventType}`, data);
  }

  /**
   * Get current connection status
   */
  public getConnectionInfo(): SocketConnectionInfo {
    return { ...this.connectionInfo };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connectionInfo.status === "connected";
  }

  // ============================================
  // Private Methods
  // ============================================

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.updateConnectionStatus("connected");
      console.log("[Socket] Connection established");
    };

    this.socket.onmessage = (event) => {
      try {
        const socketEvent: SocketEvent = JSON.parse(event.data);
        this.handleIncomingEvent(socketEvent);
      } catch (error) {
        console.error("[Socket] Failed to parse message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("[Socket] Error:", error);
      this.handleConnectionError(error);
    };

    this.socket.onclose = () => {
      console.log("[Socket] Connection closed");
      this.updateConnectionStatus("disconnected");
      this.attemptReconnect();
    };
  }

  private handleIncomingEvent(event: SocketEvent): void {
    console.log("[Socket] Received event:", event.type, event);

    // Notify all subscribers for this event type
    // Use requestAnimationFrame to batch callbacks and prevent blocking
    requestAnimationFrame(() => {
      this.subscriptions.forEach((subscription) => {
        if (subscription.eventType === event.type) {
          try {
            subscription.callback(event);
          } catch (error) {
            console.error(`[Socket] Error in subscription callback:`, error);
          }
        }
      });
    });
  }

  private updateConnectionStatus(status: SocketStatus): void {
    this.connectionInfo = {
      ...this.connectionInfo,
      status,
      connectedAt:
        status === "connected" ? new Date().toISOString() : undefined,
    };
  }

  private handleConnectionError(error: unknown): void {
    this.updateConnectionStatus("error");
    this.connectionInfo.lastError =
      error instanceof Error ? error.message : "Unknown error";
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (!this.config.reconnect) return;

    const attempts = this.connectionInfo.reconnectAttempts || 0;
    if (attempts >= (this.config.reconnectAttempts || 5)) {
      console.log("[Socket] Max reconnection attempts reached");
      return;
    }

    this.connectionInfo.reconnectAttempts = attempts + 1;

    console.log(
      `[Socket] Reconnecting in ${this.config.reconnectDelay}ms (attempt ${attempts + 1})`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectDelay);
  }
}

export default SocketService;
