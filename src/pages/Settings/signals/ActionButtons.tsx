import { CommonButton } from "@/components/shared";
import { Plus, Settings, Upload, Download } from "lucide-react";

interface ActionButtonsProps {
  onAddSignal: () => void;
  onConfigureTags: () => void;
  onImportTags?: () => void;
  onExportTags?: () => void;
}

export function ActionButtons({
  onAddSignal,
  onConfigureTags,
  onImportTags,
  onExportTags,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CommonButton variant="outline" icon={Plus} onClick={onAddSignal}>
        Add Signal
      </CommonButton>
      <CommonButton variant="outline" icon={Settings} onClick={onConfigureTags}>
        Configure Tags
      </CommonButton>
      <CommonButton variant="outline" icon={Upload} onClick={onImportTags}>
        Import Tags
      </CommonButton>
      <CommonButton variant="outline" icon={Download} onClick={onExportTags}>
        Export Tags
      </CommonButton>
    </div>
  );
}
