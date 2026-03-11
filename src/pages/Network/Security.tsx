// React & Hooks
import { useState, useEffect, useRef } from "react";

// Form & Validation
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@/components/ui/radio-group";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI
import { Badge } from "@/components/ui/badge";

// Components - Common
import {
  CommonButton,
  SectionSkeleton,
  FormSaveDialog,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
  CommonRadio,
} from "@/components/shared";

// Components - Local
import { HealthMonitoringPanel } from "./common/HealthMonitoringPanel";
import { PanelCard } from "@/components/dashboard/PanelCard";

// Services & API
import {
  useSecurityData,
  useSaveSecurityData,
  useSecurityOptions,
} from "@/services/api/network/network.api";

// Types & Schemas
import {
  securityFormSchema,
  type SecurityFormValues,
} from "@/utils/schemas/security";
import type { SaveSecurityPayload } from "@/services/api/network/network.types";

// Contexts
import { useNetworkContext } from "@/context/network";

// Icons
import { Plus, UploadCloud, X, FileCheck2 } from "lucide-react";

// ---- Certificate Upload Component ----
function CertificateUpload({
  file,
  onChange,
  id,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  id: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  };

  return (
    <div className="mt-2 ml-6 space-y-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pem,.crt,.cer,.p12,.pfx"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      {/* Dropzone — always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-1.5 px-4 py-4 rounded-md border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-primary bg-primary/10"
            : file
              ? "border-primary/40 bg-primary/5 hover:border-primary/60"
              : "border-border/50 hover:border-primary/50 hover:bg-accent/60"
        }`}
      >
        <UploadCloud
          className={`h-5 w-5 ${dragging || file ? "text-primary" : "text-muted-foreground"}`}
        />
        <span className="text-xs text-muted-foreground text-center">
          <span className="text-primary font-medium">
            {file ? "Replace file" : "Click to upload"}
          </span>{" "}
          {!file && "or drag & drop"}
        </span>
        {!file && (
          <span className="text-[10px] text-muted-foreground/70">
            .pem, .crt, .cer, .p12, .pfx
          </span>
        )}
      </div>

      {/* Selected file — shown below the dropzone */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-primary/40 bg-primary/5 text-sm">
          <FileCheck2 className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="flex-1 truncate text-foreground font-medium">
            {file.name}
          </span>
          <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
            aria-label="Remove certificate"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Security Component
 *
 * Manages security profiles for network connections, including SSL/TLS certificates,
 * authentication methods (User/Pass, Certificate), and endpoint-specific security settings.
 *
 * @returns JSX.Element
 */
export function Security() {
  // ---- Data & State ----
  const { data: securityResponse, isLoading } = useSecurityData();
  const { data: optionsResponse } = useSecurityOptions();
  const { mutate: saveSecurityData } = useSaveSecurityData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // Certificate file states (managed separately from react-hook-form for upload handling)
  const [authCertFile, setAuthCertFile] = useState<File | null>(null);
  const [pwdCertFile, setPwdCertFile] = useState<File | null>(null);

  // ---- Form Management ----
  const formMethods = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      rigPlc: {
        enabled: true,
        endpoint: "10.1.0.113",
        subnet: "0",
        port: "502",
        portConfig: "502",
      },
      authentication: {
        method: "certificate",
      },
      pwd: {
        authMethod: "none",
      },
    },
  });

  const { reset, control, handleSubmit } = formMethods;

  const authMethod = useWatch({ control, name: "authentication.method" });
  const pwdAuthMethod = useWatch({ control, name: "pwd.authMethod" });

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded.
   * Maps individual security profiles into the form structure.
   */
  useEffect(() => {
    if (securityResponse?.data && !hasSetInitial) {
      const { securityProfiles } = securityResponse.data;

      // Extract specific profiles from the collection
      const rigPlcProfile = securityProfiles.find(
        (p) => p.id === "rig-plc-security",
      );
      const authProfile = securityProfiles.find(
        (p) => p.id === "authentication",
      );
      const pwdProfile = securityProfiles.find((p) => p.id === "pwd-security");

      reset({
        rigPlc: {
          enabled: rigPlcProfile?.enabled ?? true,
          endpoint: (rigPlcProfile?.settings?.endpoint as string) || "",
          subnet: (rigPlcProfile?.settings?.subnet as string) || "",
          port: (rigPlcProfile?.settings?.port as string) || "",
          portConfig: (rigPlcProfile?.settings?.portConfig as string) || "",
        },
        authentication: {
          method:
            (authProfile?.settings?.authMethod as
              | "none"
              | "user-pass"
              | "certificate") || "certificate",
          username: (authProfile?.settings?.username as string) || "",
          password: (authProfile?.settings?.password as string) || "",
        },
        pwd: {
          authMethod:
            (pwdProfile?.settings?.authMethod as
              | "none"
              | "user-pass"
              | "certificate") || "none",
          username: (pwdProfile?.settings?.username as string) || "",
          password: (pwdProfile?.settings?.password as string) || "",
        },
      });
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setHasSetInitial(true), 0);
    }
  }, [securityResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   * Transforms the flat form structure back into the API-expected array of profiles.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveSecurityPayload>({
    onSave: () => {
      const formData = formMethods.getValues();

      const payload: SaveSecurityPayload = {
        securityProfiles: [
          {
            id: "rig-plc-security",
            name: "Rig PLC Security",
            type: "tls",
            description: "Modbus TCP connection security settings",
            enabled: formData.rigPlc.enabled,
            settings: {
              endpoint: formData.rigPlc.endpoint,
              subnet: formData.rigPlc.subnet,
              port: formData.rigPlc.port,
              portConfig: formData.rigPlc.portConfig,
            },
          },
          {
            id: "authentication",
            name: "Authentication",
            type: "auth",
            description: "Authentication method for primary connection",
            enabled: formData.authentication.method !== "none",
            settings: {
              authMethod: formData.authentication.method,
              ...(formData.authentication.method === "user-pass" && {
                username: formData.authentication.username,
                password: formData.authentication.password,
              }),
            },
          },
          {
            id: "pwd-security",
            name: "PWD Security",
            type: "auth",
            description: "PWD authentication settings",
            enabled: formData.pwd.authMethod !== "none",
            settings: {
              authMethod: formData.pwd.authMethod,
              ...(formData.pwd.authMethod === "user-pass" && {
                username: formData.pwd.username,
                password: formData.pwd.password,
              }),
            },
          },
        ],
      };

      return new Promise<void>((resolve, reject) => {
        saveSecurityData(payload, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Security settings saved successfully",
    errorMessage: "Failed to save security settings",
    confirmTitle: "Save Security Settings",
    confirmDescription: "Are you sure you want to save these security changes?",
  });

  /**
   * Register the save handler with the NetworkContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit(() => {
      saveWithConfirmation.requestSave({} as SaveSecurityPayload);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [
    handleSubmit,
    registerSaveHandler,
    unregisterSaveHandler,
    saveWithConfirmation,
  ]);

  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
          {/* Rig PLC Card */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Rig PLC</span>
                <Badge variant="secondary" className="text-xs">
                  Primary
                </Badge>
              </div>
            }
            headerAction={
              <CommonFormToggle
                name="rigPlc.enabled"
                control={control}
                label="Modbus TCP"
              />
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground pb-3">
                Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
              </p>

              <div className="grid grid-cols-1 gap-3 auto-rows-max">
                {/* Endpoint Data */}
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 text-sm">
                  <div className="flex gap-2">
                    <CommonFormInput
                      name="rigPlc.endpoint"
                      control={control}
                      label="EndPoint"
                      placeholder="10.1.0.11"
                      type="text"
                      containerClassName="flex-1"
                    />
                    <CommonFormInput
                      name="rigPlc.subnet"
                      control={control}
                      label=" "
                      placeholder="0"
                      type="text"
                      containerClassName="w-20"
                    />
                    <CommonFormInput
                      name="rigPlc.port"
                      control={control}
                      label=" "
                      placeholder="502"
                      type="text"
                      containerClassName="w-20"
                    />
                  </div>
                  <CommonFormSelect
                    name="rigPlc.portConfig"
                    control={control}
                    label="Port"
                    options={options?.portOptions || []}
                  />
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Authentication Card */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Authentication</span>
              </div>
            }
          >
            <RadioGroup
              value={authMethod}
              onValueChange={(value) => {
                formMethods.setValue(
                  "authentication.method",
                  value as "none" | "user-pass" | "certificate",
                );
              }}
            >
              <div className="space-y-3">
                <CommonRadio value="none" id="auth-none" label="None" />

                <div>
                  <CommonRadio
                    value="user-pass"
                    id="auth-user-pass"
                    label="User / Pass"
                  />
                  {/* Show username/password fields when user-pass is selected */}
                  {authMethod === "user-pass" && (
                    <div className="mt-2 ml-6 grid grid-cols-2 gap-3">
                      <CommonFormInput
                        name="authentication.username"
                        control={control}
                        label=""
                        placeholder="Username"
                        type="text"
                      />
                      <CommonFormInput
                        name="authentication.password"
                        control={control}
                        label=""
                        placeholder="Password"
                        type="password"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <CommonRadio
                    value="certificate"
                    id="auth-certificate"
                    label="Certificate (SSL)"
                  />
                  {authMethod === "certificate" && (
                    <CertificateUpload
                      id="auth-cert-upload"
                      file={authCertFile}
                      onChange={setAuthCertFile}
                    />
                  )}
                </div>
              </div>
            </RadioGroup>
          </PanelCard>

          {/* PWD Card */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>PWD</span>
              </div>
            }
          >
            <RadioGroup
              value={pwdAuthMethod}
              onValueChange={(value) => {
                formMethods.setValue(
                  "pwd.authMethod",
                  value as "none" | "user-pass" | "certificate",
                );
              }}
            >
              <div className="space-y-3">
                <CommonRadio value="none" id="pwd-auth-none" label="None" />

                <div>
                  <CommonRadio
                    value="user-pass"
                    id="pwd-auth-user-pass"
                    label="User / Pass"
                  />
                  {/* Show username/password fields when user-pass is selected */}
                  {pwdAuthMethod === "user-pass" && (
                    <div className="mt-2 ml-6 grid grid-cols-2 gap-3">
                      <CommonFormInput
                        name="pwd.username"
                        control={control}
                        label=""
                        placeholder="Username"
                        type="text"
                      />
                      <CommonFormInput
                        name="pwd.password"
                        control={control}
                        label=""
                        placeholder="Password"
                        type="password"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <CommonRadio
                    value="certificate"
                    id="pwd-auth-certificate"
                    label="Certificate (SSL)"
                  />
                  {pwdAuthMethod === "certificate" && (
                    <CertificateUpload
                      id="pwd-cert-upload"
                      file={pwdCertFile}
                      onChange={setPwdCertFile}
                    />
                  )}
                </div>
              </div>
            </RadioGroup>

            {/* TQs / PQ aux */}
            <div className="mt-6">
              <CommonButton variant="outline" size="sm" icon={Plus}>
                TQs / PQ aux
              </CommonButton>
            </div>
          </PanelCard>
        </div>

        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel />
        </div>
      </div>

      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
