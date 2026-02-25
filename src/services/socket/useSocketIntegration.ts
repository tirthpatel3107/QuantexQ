/**
 * Socket Integration Hook
 * Integrates WebSocket events with TanStack Query cache
 * 
 * This hook:
 * - Subscribes to socket events
 * - Updates TanStack Query cache when events arrive
 * - Automatically cleans up subscriptions on unmount
 * 
 * Usage in components:
 * useSocketIntegration('network:sources:update', networkKeys.data(), (event) => {
 *   // Optional: custom handler before cache update
 *   console.log('Sources updated:', event);
 * });
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SocketService from './socket.service';
import type { SocketEvent, SocketEventType } from './socket.types';

interface UseSocketIntegrationOptions {
  /**
   * Whether to invalidate the query (refetch from server)
   * Default: true
   */
  invalidateQuery?: boolean;

  /**
   * Whether to update the cache directly with socket data
   * Default: false (use invalidateQuery instead)
   */
  updateCache?: boolean;

  /**
   * Custom cache updater function
   * Only used if updateCache is true
   */
  cacheUpdater?: (oldData: unknown, event: SocketEvent) => unknown;

  /**
   * Whether this integration is enabled
   * Default: true
   */
  enabled?: boolean;
}

/**
 * Hook to integrate socket events with TanStack Query
 */
export const useSocketIntegration = (
  eventType: SocketEventType,
  queryKey: readonly unknown[],
  options: UseSocketIntegrationOptions = {}
) => {
  const queryClient = useQueryClient();
  const {
    invalidateQuery = true,
    updateCache = false,
    cacheUpdater,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const socket = SocketService.getInstance();

    // Subscribe to socket event
    const subscription = socket.subscribe(eventType, (event) => {
      console.log(`[Socket Integration] Received ${eventType}:`, event);

      if (updateCache && cacheUpdater) {
        // Update cache directly with custom updater
        queryClient.setQueryData(queryKey, (oldData) => {
          return cacheUpdater(oldData, event);
        });
      } else if (invalidateQuery) {
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries({ queryKey });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [eventType, queryKey, queryClient, invalidateQuery, updateCache, cacheUpdater, enabled]);
};

/**
 * Hook to connect/disconnect socket based on component lifecycle
 */
export const useSocketConnection = (autoConnect = true) => {
  useEffect(() => {
    if (!autoConnect) return;

    const socket = SocketService.getInstance();
    socket.connect();

    // Optional: disconnect on unmount (usually you want to keep connection alive)
    // return () => {
    //   socket.disconnect();
    // };
  }, [autoConnect]);

  return SocketService.getInstance();
};

/**
 * Hook to get socket connection status
 */
export const useSocketStatus = () => {
  const socket = SocketService.getInstance();
  return socket.getConnectionInfo();
};
