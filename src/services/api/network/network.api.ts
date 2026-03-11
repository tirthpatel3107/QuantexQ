/**
 * Network Section API Handlers
 * TanStack Query hooks for Network section (Sources, Destinations, Protocols tabs)
 * Each tab has its own GET API endpoint
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, SaveResult } from "../types";
import type {
  SourcesTabData,
  ProtocolsTabData,
  RoutingTabData,
  SecurityTabData,
  DiagnosticsTabData,
  SaveSourcesPayload,
  SaveProtocolsPayload,
  SaveRoutingPayload,
  SaveSecurityPayload,
  SaveDiagnosticsPayload,
  SourcesOptionsData,
  ProtocolsOptionsData,
  RoutingOptionsData,
  SecurityOptionsData,
  DiagnosticsOptionsData,
} from "./network.types";

// ============================================
// Query Keys
// ============================================

export const networkKeys = {
  all: ["network"] as const,
  sources: () => [...networkKeys.all, "sources"] as const,
  sourcesOptions: () => [...networkKeys.all, "sources", "options"] as const,
  protocols: () => [...networkKeys.all, "protocols"] as const,
  protocolsOptions: () => [...networkKeys.all, "protocols", "options"] as const,
  routing: () => [...networkKeys.all, "routing"] as const,
  routingOptions: () => [...networkKeys.all, "routing", "options"] as const,
  security: () => [...networkKeys.all, "security"] as const,
  securityOptions: () => [...networkKeys.all, "security", "options"] as const,
  diagnostics: () => [...networkKeys.all, "diagnostics"] as const,
  diagnosticsOptions: () =>
    [...networkKeys.all, "diagnostics", "options"] as const,
};

// ============================================
// API Base URL
// ============================================

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// ============================================
// GET: Sources Tab
// ============================================

const fetchSourcesData = async (): Promise<ApiResponse<SourcesTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.SOURCES}`);
  // if (!response.ok) throw new Error('Failed to fetch sources data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          rigPlc: {
            enabled: true,
            connectionStatus: "Primary",
            sourceType: "PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)",
            endpoint: "10.1.0.113",
            port: "502",
            tagMap: "502",
            dataRate: "100ms",
          },
          pwdWits: {
            enabled: true,
            endpoint: "10.1.0.113",
            port: "502",
            dataRate: "none",
            frequency: "1x",
            tagMap: "10.1.0.113",
          },
          devices: {
            enabled: true,
            items: [
              {
                id: "chokes",
                name: "Chokes (A/B)",
                tags: "ChokeA_Pos, ChokeB_Pos, Choke_SP",
                healthStatus: "OK",
                healthCount: "3/3",
              },
              {
                id: "flow-meter",
                name: "Flow Meter",
                tags: "Flow_In, Flow_Out, Aux_Flow",
                healthStatus: "OK",
                healthCount: "3/3",
              },
            ],
          },
          healthMonitoring: {
            sources: [
              {
                name: "Rig PLC (Primary Source)",
                status: "Connected",
                lastSeen: "2s ago",
                latency: "12ms",
              },
              {
                name: "PWD / LWD Service",
                status: "Validating",
                lastSeen: "5s ago",
              },
              {
                name: "Internal Simulator",
                status: "Disconnected",
              },
            ],
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch Sources tab data
 */
export const useSourcesData = () => {
  return useQuery({
    queryKey: networkKeys.sources(),
    queryFn: fetchSourcesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// GET: Sources Options (Dropdown Data)
// ============================================

const fetchSourcesOptions = async (): Promise<
  ApiResponse<SourcesOptionsData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.SOURCES_OPTIONS}`);
  // if (!response.ok) throw new Error('Failed to fetch sources options');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          tagMapOptions: [
            { value: "502", label: "502" },
            { value: "503", label: "503" },
            { value: "504", label: "504" },
          ],
          dataRateOptions: [
            { value: "50ms", label: "50 ms" },
            { value: "100ms", label: "100 ms" },
            { value: "200ms", label: "200 ms" },
            { value: "500ms", label: "500 ms" },
            { value: "1000ms", label: "1000 ms" },
          ],
          frequencyOptions: [
            { value: "1x", label: "1x / sec" },
            { value: "2x", label: "2x / sec" },
            { value: "5x", label: "5x / sec" },
            { value: "10x", label: "10x / sec" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

/**
 * Hook to fetch Sources options for dropdowns
 */
export const useSourcesOptions = () => {
  return useQuery({
    queryKey: networkKeys.sourcesOptions(),
    queryFn: fetchSourcesOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes (options don't change often)
  });
};

// ============================================
// GET: Protocols Tab
// ============================================

const fetchProtocolsData = async (): Promise<ApiResponse<ProtocolsTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.PROTOCOLS}`);
  // if (!response.ok) throw new Error('Failed to fetch protocols data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          rigPlc: {
            type: "modbus-tcp",
            modbusEndpoints: ["10.1.0.1:13:502", "10.1.0.113:502"],
          },
          pwd: {
            type: "direct-wits",
            endpoint: "1.0.1:250.49155",
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch Protocols tab data
 */
export const useProtocolsData = () => {
  return useQuery({
    queryKey: networkKeys.protocols(),
    queryFn: fetchProtocolsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Protocols Options (Dropdown Data)
// ============================================

const fetchProtocolsOptions = async (): Promise<
  ApiResponse<ProtocolsOptionsData>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          protocolTypeOptions: [
            { value: "modbus-tcp", label: "Modbus TCP" },
            { value: "opc-ua", label: "OPC-UA (UA-TCP)" },
            { value: "ethernet-ip", label: "Ethernet/IP" },
          ],
          endpointOptions: [
            { value: "10.1.0.113:502", label: "10.1.0.113:502" },
            { value: "10.1.0.114:502", label: "10.1.0.114:502" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

/**
 * Hook to fetch Protocols options for dropdowns
 */
export const useProtocolsOptions = () => {
  return useQuery({
    queryKey: networkKeys.protocolsOptions(),
    queryFn: fetchProtocolsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Routing Tab
// ============================================

const fetchRoutingData = async (): Promise<ApiResponse<RoutingTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.ROUTING}`);
  // if (!response.ok) throw new Error('Failed to fetch routing data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          routes: [
            {
              id: "tag-mapping",
              name: "Tag Mapping",
              type: "tag-mapping",
              description:
                "Map source register tags to internal system variables (SBP, MW_IN, etc).",
              enabled: true,
              settings: {},
            },
            {
              id: "dualq-control",
              name: "DualQ Control",
              type: "dualq-control",
              description:
                "Primary/Backup source switching logic with auto-failover thresholds.",
              enabled: true,
              settings: {},
            },
            {
              id: "slc-logic",
              name: "Single Loop Control",
              type: "slc-logic",
              description:
                "Direct PID routing from sensor input to valve output with low latency.",
              enabled: false,
              settings: {},
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch Routing tab data
 */
export const useRoutingData = () => {
  return useQuery({
    queryKey: networkKeys.routing(),
    queryFn: fetchRoutingData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Routing Options (Dropdown Data)
// ============================================

const fetchRoutingOptions = async (): Promise<
  ApiResponse<RoutingOptionsData>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          portOptions: [
            { value: "502", label: "502" },
            { value: "503", label: "503" },
            { value: "100ms", label: "100 ms" },
          ],
          tagMapOptions: [
            { value: "ChokeA_Pos", label: "ChokeA_Pos" },
            { value: "ChokeB_Pos", label: "ChokeB_Pos" },
            { value: "MPD SBP", label: "MPD SBP" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

/**
 * Hook to fetch Routing options for dropdowns
 */
export const useRoutingOptions = () => {
  return useQuery({
    queryKey: networkKeys.routingOptions(),
    queryFn: fetchRoutingOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Security Tab
// ============================================

const fetchSecurityData = async (): Promise<ApiResponse<SecurityTabData>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.SECURITY}`);
  // if (!response.ok) throw new Error('Failed to fetch security data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          securityProfiles: [
            {
              id: "tls-mgmt",
              name: "TLS / SSL Management",
              type: "tls",
              description:
                "Install certificates, manage CA bundles, enforce minimum TLS 1.2/1.3.",
              enabled: true,
              settings: {},
            },
            {
              id: "auth-profiles",
              name: "Authentication Profiles",
              type: "auth",
              description:
                "Radius, LDAP, Local User/Pass, or JWT token-based source auth.",
              enabled: true,
              settings: {},
            },
            {
              id: "firewall-rules",
              name: "Internal Firewall",
              type: "firewall",
              description:
                "IP Whitelisting, Port filtering, and Rate limiting per data source.",
              enabled: false,
              settings: {},
            },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch Security tab data
 */
export const useSecurityData = () => {
  return useQuery({
    queryKey: networkKeys.security(),
    queryFn: fetchSecurityData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Security Options (Dropdown Data)
// ============================================

const fetchSecurityOptions = async (): Promise<
  ApiResponse<SecurityOptionsData>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          authMethodOptions: [
            { value: "none", label: "None" },
            { value: "user-pass", label: "User / Pass" },
            { value: "certificate", label: "Certificate (SSL)" },
          ],
          portOptions: [
            { value: "502", label: "502" },
            { value: "503", label: "503" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

/**
 * Hook to fetch Security options for dropdowns
 */
export const useSecurityOptions = () => {
  return useQuery({
    queryKey: networkKeys.securityOptions(),
    queryFn: fetchSecurityOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// GET: Diagnostics Tab
// ============================================

const fetchDiagnosticsData = async (): Promise<
  ApiResponse<DiagnosticsTabData>
> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.DIAGNOSTICS}`);
  // if (!response.ok) throw new Error('Failed to fetch diagnostics data');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          diagnosticTools: [
            {
              id: "jitter-analysis",
              name: "Jitter & Latency",
              type: "jitter",
              description:
                "Real-time packet arrival analysis, dropped frame detection, and round-trip time.",
              status: "idle",
            },
            {
              id: "integrity-check",
              name: "Data Integrity Summary",
              type: "integrity",
              description:
                "Check sum validation, range clamping status, and stale data detection.",
              status: "idle",
            },
            {
              id: "adv-tools",
              name: "Advanced Tools",
              type: "advanced",
              description:
                "Enable Packet Capture (90 sec duration), Start capture, Export PCAP for deep network analysis.",
              status: "idle",
            },
            {
              id: "diag-report",
              name: "Diagnostic Report",
              type: "report",
              description:
                "Run Full Diagnostic and Export Report (PDF/CSV) — Report ID: DIAG-000128, last run: 06 Feb 2026 16:41.",
              status: "completed",
            },
          ],
          lastReport: {
            id: "DIAG-000128",
            timestamp: "06 Feb 2026 16:41",
            status: "OK",
          },
        },
        timestamp: new Date().toISOString(),
      });
    }, 500);
  });
};

/**
 * Hook to fetch Diagnostics tab data
 */
export const useDiagnosticsData = () => {
  return useQuery({
    queryKey: networkKeys.diagnostics(),
    queryFn: fetchDiagnosticsData,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// GET: Diagnostics Options (Dropdown Data)
// ============================================

const fetchDiagnosticsOptions = async (): Promise<
  ApiResponse<DiagnosticsOptionsData>
> => {
  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          durationOptions: [
            { value: "30", label: "30 sec" },
            { value: "60", label: "60 sec" },
            { value: "90", label: "90 sec" },
            { value: "120", label: "120 sec" },
          ],
          testTypeOptions: [
            { value: "ping", label: "Ping Test" },
            { value: "tcp-port", label: "TCP Port Test" },
            { value: "handshake", label: "Protocol Handshake" },
          ],
        },
        timestamp: new Date().toISOString(),
      });
    }, 300);
  });
};

/**
 * Hook to fetch Diagnostics options for dropdowns
 */
export const useDiagnosticsOptions = () => {
  return useQuery({
    queryKey: networkKeys.diagnosticsOptions(),
    queryFn: fetchDiagnosticsOptions,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// SAVE: Sources Tab
// ============================================

const saveSourcesData = async (
  payload: SaveSourcesPayload,
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.SOURCES}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save sources');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Sources Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Sources saved successfully",
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.sources() });
    },
  });
};

// ============================================
// SAVE: Protocols Tab
// ============================================

const saveProtocolsData = async (
  payload: SaveProtocolsPayload,
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.PROTOCOLS}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save protocols');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Protocols Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Protocols saved successfully",
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
      queryClient.invalidateQueries({ queryKey: networkKeys.protocols() });
    },
  });
};

// ============================================
// SAVE: Routing Tab
// ============================================

const saveRoutingData = async (
  payload: SaveRoutingPayload,
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.ROUTING}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save routing');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Routing Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Routing saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Routing tab data
 */
export const useSaveRoutingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRoutingData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.routing() });
    },
  });
};

// ============================================
// SAVE: Security Tab
// ============================================

const saveSecurityData = async (
  payload: SaveSecurityPayload,
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.SECURITY}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save security');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Security Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Security settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Security tab data
 */
export const useSaveSecurityData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSecurityData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.security() });
    },
  });
};

// ============================================
// SAVE: Diagnostics Tab
// ============================================

const saveDiagnosticsData = async (
  payload: SaveDiagnosticsPayload,
): Promise<ApiResponse<SaveResult>> => {
  // TODO: Uncomment when real API is ready
  // const response = await fetch(`${API_BASE_URL}${SERVER_ROUTES.NETWORK.DIAGNOSTICS}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Failed to save diagnostics');
  // return response.json();

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving Diagnostics Tab:", payload);
      resolve({
        success: true,
        data: {
          success: true,
          message: "Diagnostics settings saved successfully",
          updatedAt: new Date().toISOString(),
        },
      });
    }, 800);
  });
};

/**
 * Mutation hook to save Diagnostics tab data
 */
export const useSaveDiagnosticsData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDiagnosticsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKeys.diagnostics() });
    },
  });
};
