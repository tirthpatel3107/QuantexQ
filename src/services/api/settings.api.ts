/**
 * Settings Section API Handlers
 * TanStack Query hooks for Settings section
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, SaveResult } from './types';
import type {
  SettingsData,
  SaveGeneralSettingsPayload,
  SaveDisplaySettingsPayload,
  SaveNotificationsSettingsPayload,
} from './settings.types';

// ============================================
// Query Keys
// ============================================

export const settingsKeys = {
  all: ['settings'] as const,
  data: () => [...settingsKeys.all, 'data'] as const,
};

// ============================================
// API Base URL
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ============================================
// GET: Fetch All Settings Data
// ============================================

const fetchSettingsData = async (): Promise<ApiResponse<SettingsData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/settings`);
  // if (!response.ok) throw new Error('Failed to fetch settings');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          general: {
            applicationName: 'Quantex Q',
            language: 'en',
            timezone: 'America/New_York',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            autoSave: true,
            autoSaveInterval: 300,
          },
          display: {
            theme: 'dark',
            accentColor: '#3b82f6',
            fontSize: 'medium',
            compactMode: false,
            showGridLines: true,
            animationsEnabled: true,
          },
          notifications: {
            emailNotifications: true,
            pushNotifications: false,
            soundEnabled: true,
            notificationTypes: [
              {
                id: 'alert-1',
                name: 'System Alerts',
                enabled: true,
                priority: 'high',
              },
              {
                id: 'alert-2',
                name: 'Data Updates',
                enabled: true,
                priority: 'medium',
              },
              {
                id: 'alert-3',
                name: 'Maintenance',
                enabled: false,
                priority: 'low',
              },
            ],
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

export const useSettingsData = () => {
  return useQuery({
    queryKey: settingsKeys.data(),
    queryFn: fetchSettingsData,
    staleTime: 10 * 60 * 1000, // 10 minutes - settings change less frequently
  });
};

// ============================================
// SAVE: General Settings Tab
// ============================================

const saveGeneralSettings = async (
  payload: SaveGeneralSettingsPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/settings/general`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save general settings');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving General Settings Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'General settings saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveGeneralSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveGeneralSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.data() });
    },
  });
};

// ============================================
// SAVE: Display Settings Tab
// ============================================

const saveDisplaySettings = async (
  payload: SaveDisplaySettingsPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/settings/display`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save display settings');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Display Settings Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Display settings saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveDisplaySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDisplaySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.data() });
    },
  });
};

// ============================================
// SAVE: Notifications Settings Tab
// ============================================

const saveNotificationsSettings = async (
  payload: SaveNotificationsSettingsPayload
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save notifications settings');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving Notifications Settings Tab:', payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: 'Notifications settings saved successfully',
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

export const useSaveNotificationsSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNotificationsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.data() });
    },
  });
};
