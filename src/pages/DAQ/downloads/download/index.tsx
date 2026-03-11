import { useState } from "react";
import { Download as DownloadIcon, FolderOpen } from "lucide-react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/shared/CommonButton";
import {
  CommonTabs,
  CommonTabsContent,
  CommonTabsList,
  CommonTabsTrigger,
} from "@/components/shared/CommonTabs";
import { Download } from "./Download";
import { DcsSets } from "./DcsSets";
import { DownloadPatch } from "./DownloadPatch";

export function DownloadPanel() {
  const [activeTab, setActiveTab] = useState("downloads");

  return (
    <PanelCard
      title={
        <div className="flex items-center gap-2">
          <DownloadIcon className="h-4 w-4" />
          <span>Downloads</span>
        </div>
      }
      headerAction={
        <CommonButton variant="outline" size="sm" icon={FolderOpen}>
          Open Downloads Folder
        </CommonButton>
      }
    >
      <CommonTabs value={activeTab} onValueChange={setActiveTab}>
        <CommonTabsList>
          <CommonTabsTrigger value="downloads">Downloads</CommonTabsTrigger>
          <CommonTabsTrigger value="dcs-sets">DCS Sets</CommonTabsTrigger>
          <CommonTabsTrigger value="download-patch">
            Download Patch
          </CommonTabsTrigger>
        </CommonTabsList>

        <CommonTabsContent value="downloads" className="space-y-6">
          <Download />
        </CommonTabsContent>

        <CommonTabsContent value="dcs-sets">
          <DcsSets />
        </CommonTabsContent>

        <CommonTabsContent value="download-patch">
          <DownloadPatch />
        </CommonTabsContent>
      </CommonTabs>
    </PanelCard>
  );
}
