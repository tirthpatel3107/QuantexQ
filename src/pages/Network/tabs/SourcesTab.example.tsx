/**
 * Sources Tab Example
 * Demonstrates how individual tabs manage their own state
 * 
 * Key Points:
 * - Receives initial data from parent (from GET API)
 * - Manages local form state
 * - Notifies parent of changes via onChange callback
 * - Parent handles the actual save operation
 */

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { SourcesTabData, SaveSourcesPayload, NetworkSource } from '@/services/api/network.types';

interface SourcesTabProps {
  data?: SourcesTabData;
  onChange: (payload: SaveSourcesPayload) => void;
}

const SourcesTab = ({ data, onChange }: SourcesTabProps) => {
  // Local state for form data
  const [sources, setSources] = useState<NetworkSource[]>([]);
  const [defaultSource, setDefaultSource] = useState<string | undefined>();

  // Initialize form with data from API
  useEffect(() => {
    if (data) {
      setSources(data.sources);
      setDefaultSource(data.defaultSource);
    }
  }, [data]);

  // Notify parent whenever form data changes
  useEffect(() => {
    onChange({
      sources,
      defaultSource,
    });
  }, [sources, defaultSource, onChange]);

  const handleSourceChange = (id: string, field: keyof NetworkSource, value: any) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, [field]: value } : source
      )
    );
  };

  const handleAddSource = () => {
    const newSource: NetworkSource = {
      id: `src-${Date.now()}`,
      name: 'New Source',
      type: 'ethernet',
      enabled: false,
      status: 'disconnected',
    };
    setSources((prev) => [...prev, newSource]);
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((source) => source.id !== id));
  };

  if (!data) {
    return <div>Loading sources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Network Sources</h2>
        <Button onClick={handleAddSource} variant="outline">
          Add Source
        </Button>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={source.enabled}
                  onCheckedChange={(checked) =>
                    handleSourceChange(source.id, 'enabled', checked)
                  }
                />
                <span className="text-sm font-medium">
                  {source.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    source.status === 'connected'
                      ? 'bg-green-100 text-green-800'
                      : source.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {source.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSource(source.id)}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${source.id}`}>Name</Label>
                <Input
                  id={`name-${source.id}`}
                  value={source.name}
                  onChange={(e) =>
                    handleSourceChange(source.id, 'name', e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor={`type-${source.id}`}>Type</Label>
                <select
                  id={`type-${source.id}`}
                  value={source.type}
                  onChange={(e) =>
                    handleSourceChange(source.id, 'type', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="ethernet">Ethernet</option>
                  <option value="serial">Serial</option>
                  <option value="usb">USB</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>

              {source.type === 'ethernet' && (
                <>
                  <div>
                    <Label htmlFor={`ip-${source.id}`}>IP Address</Label>
                    <Input
                      id={`ip-${source.id}`}
                      value={source.ipAddress || ''}
                      onChange={(e) =>
                        handleSourceChange(source.id, 'ipAddress', e.target.value)
                      }
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`port-${source.id}`}>Port</Label>
                    <Input
                      id={`port-${source.id}`}
                      type="number"
                      value={source.port || ''}
                      onChange={(e) =>
                        handleSourceChange(source.id, 'port', parseInt(e.target.value))
                      }
                      placeholder="8080"
                    />
                  </div>
                </>
              )}

              {source.type === 'serial' && (
                <div>
                  <Label htmlFor={`baud-${source.id}`}>Baud Rate</Label>
                  <Input
                    id={`baud-${source.id}`}
                    type="number"
                    value={source.baudRate || ''}
                    onChange={(e) =>
                      handleSourceChange(source.id, 'baudRate', parseInt(e.target.value))
                    }
                    placeholder="9600"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id={`default-${source.id}`}
                name="defaultSource"
                checked={defaultSource === source.id}
                onChange={() => setDefaultSource(source.id)}
              />
              <Label htmlFor={`default-${source.id}`}>Set as default source</Label>
            </div>
          </div>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sources configured. Click "Add Source" to get started.
        </div>
      )}
    </div>
  );
};

export default SourcesTab;
