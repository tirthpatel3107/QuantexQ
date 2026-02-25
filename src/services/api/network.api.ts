/**
 * Network Section API Handlers
 * TanStack Query hooks for Network section (Sources, Destinations, Protocols tabs)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, SaveResult } from './types';
import type {
  NetworkData,
  SaveSourcesPayload,
  SaveDestinationsPayload,
  SaveProtocolsPayload,
} from './network.types';

// ============================================
// Query Keys
// ============================================

export const networkKeys = {
  all: ['network'] as const,
  data: () => [...networkKeys.all, 'data'] as const,
  sources: () => [...networkKeys.all, 'sources'] as const,
  destinations: () => [...networkKeys.all, 'destinations'] as const,
  protocols: () => [...networkKeys.all, 'protocols'] as const,
};

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ============================================
// GET: Fetch All Network Data
// ============================================

/**
 * Fetches all network section data (all tabs)
 * This single API call returns data for Sources, Destinations, and Protocols tabs
 */
const fetchNetworkData = async (): Promise<ApiResponse<NetworkData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/network`);
  // if (!response.ok) throw new Error('Failed to fetch network data');
  // return response.json();

  // MOCK RESPONSE - Remove when real API is ready
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          sources: {
            sources: [
              {
                id: 'src-1',
                name: 'Primary Ethernet',
                type: 'ethernet',
                ipAddress: '192.168.1.100',
                port: 8080,
                enabled: true,
                status: 'connected',
                lastSeen: new Date().toISOString(),
              },
              {
                id: 'src-2',
                name: 'Serial Port 1',
                type: 'serial',
                baudRate: 9600,
                enabled: true,
                status: 'connected',
                lastSeen: new Date().toISOString(),
              },
            ],
            defaultSource: 'src-1',
          },
          destinations: {
            destinations: [
              {
                id: 'dest-1',
                name: 'Cloud Storage',
                type: 'cloud',
                endpoint: 'https://api.example.com/data',
                protocol: 'https',
                enabled: true,
                authentication: {
                  type: 'token',
                  credentials: { token: '***' },
                },
              },
            ],
            routingRules: [
              {
                id: 'rule-1',
                sourceId: 'src-1',
                destinationId: 'dest-1',
                priority: 1,
              },
            ],
          },
          protocols: {
            protocols: [
              {
                id: 'proto-1',
                name: 'Modbus TCP',
                type: 'modbus',
                enabled: true,
                settings: { slaveId: 1 },
                timeout: 5000,
                retryAttempts: 3,
              },
            ],
            globalSettings: {
              defaultTimeout: 5000,
              maxConnections: 10,
              keepAlive: true,
              compressionEnabled: false,
            },
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch all network data
 * Used by all tabs in the Network section
 */
export const useNetworkData = () => {
  return useQuery({
    queryKey: networkKeys.data(),
    queryFn: fetchNetworkData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// SAVE: Sources Tab
// ============================================

const saveSourcesData = async (
  payload: SaveSourcesPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/network/sources`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save sources');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Sources Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Sources saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Sources tab data
 */
export const useSaveSourcesData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSourcesData,
    onSuccess: (response) => {
      // Invalidate and refetch network data to get latest state
      queryClient.invalidateQueries({ queryKey: networkKeys.data() });
      
      // Optionally update cache optimistically
      // queryClient.setQueryData(networkKeys.data(), (old) => {
      //   if (!old) return old;
      //   return { ...old, data: { ...old.data, sources: payload.sources } };
      // });
    },
  });
};

// ============================================
// SAVE: Destinations Tab
// ============================================

const saveDestinationsData = async (
  payload: SaveDestinationsPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/network/destinations`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save destinations');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Destinations Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Destinations saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Destinations tab data
 */
export const useSaveDestinationsData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDestinationsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.data() });
    },
  });
};

// ============================================
// SAVE: Protocols Tab
// ============================================

const saveProtocolsData = async (
  payload: SaveProtocolsPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/network/protocols`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save protocols');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Protocols Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Protocols saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Protocols tab data
 */
export const useSaveProtocolsData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProtocolsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.data() });
    },
  });
};
