/**
 * Network Page Example
 * Demonstrates how to use the API-driven architecture with TanStack Query
 * 
 * Key Features:
 * - Single GET API fetches all tab data
 * - Each tab has its own SAVE mutation
 * - Save button only saves the active tab
 * - Socket integration for real-time updates
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// API hooks
import {
  useNetworkData,
  useSaveSourcesData,
  useSaveDestinationsData,
  useSaveProtocolsData,
} from '@/services/api/network/network.api';

// Socket integration
import { useSocketIntegration, useSocketConnection } from '@/services/socket/useSocketIntegration';
import { networkKeys } from '@/services/api/network/network.api';

// Tab components (you'll create these)
import SourcesTab from './tabs/SourcesTab';
import DestinationsTab from './tabs/DestinationsTab';
import ProtocolsTab from './tabs/ProtocolsTab';

type NetworkTab = 'sources' | 'destinations' | 'protocols';

const NetworkPage = () => {
  const [activeTab, setActiveTab] = useState<NetworkTab>('sources');

  // Connect to socket (optional - for real-time updates)
  useSocketConnection(true);

  // Fetch all network data (used by all tabs)
  const { data, isLoading, error } = useNetworkData();

  // Save mutations for each tab
  const saveSourcesMutation = useSaveSourcesData();
  const saveDestinationsMutation = useSaveDestinationsData();
  const saveProtocolsMutation = useSaveProtocolsData();

  // Socket integration - update cache when events arrive
  useSocketIntegration('network:sources:update', networkKeys.data());
  useSocketIntegration('network:destinations:update', networkKeys.data());
  useSocketIntegration('network:protocols:update', networkKeys.data());

  // Local state for each tab (managed by child components)
  const [sourcesFormData, setSourcesFormData] = useState<any>(null);
  const [destinationsFormData, setDestinationsFormData] = useState<any>(null);
  const [protocolsFormData, setProtocolsFormData] = useState<any>(null);

  /**
   * Handle Save button click
   * Only saves the currently active tab
   */
  const handleSave = async () => {
    try {
      switch (activeTab) {
        case 'sources':
          if (!sourcesFormData) {
            toast.error('No changes to save');
            return;
          }
          await saveSourcesMutation.mutateAsync(sourcesFormData);
          toast.success('Sources saved successfully');
          break;

        case 'destinations':
          if (!destinationsFormData) {
            toast.error('No changes to save');
            return;
          }
          await saveDestinationsMutation.mutateAsync(destinationsFormData);
          toast.success('Destinations saved successfully');
          break;

        case 'protocols':
          if (!protocolsFormData) {
            toast.error('No changes to save');
            return;
          }
          await saveProtocolsMutation.mutateAsync(protocolsFormData);
          toast.success('Protocols saved successfully');
          break;
      }
    } catch (error) {
      toast.error('Failed to save changes');
      console.error('Save error:', error);
    }
  };

  const isSaving =
    saveSourcesMutation.isPending ||
    saveDestinationsMutation.isPending ||
    saveProtocolsMutation.isPending;

  if (isLoading) {
    return <div>Loading network data...</div>;
  }

  if (error) {
    return <div>Error loading network data: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Save button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Network Configuration</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NetworkTab)} className="flex-1">
        <TabsList className="w-full justify-start border-b rounded-none">
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="flex-1 p-4">
          <SourcesTab
            data={data?.data.sources}
            onChange={setSourcesFormData}
          />
        </TabsContent>

        <TabsContent value="destinations" className="flex-1 p-4">
          <DestinationsTab
            data={data?.data.destinations}
            onChange={setDestinationsFormData}
          />
        </TabsContent>

        <TabsContent value="protocols" className="flex-1 p-4">
          <ProtocolsTab
            data={data?.data.protocols}
            onChange={setProtocolsFormData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkPage;
