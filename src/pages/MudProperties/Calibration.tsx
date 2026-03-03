// React & Hooks
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  RestoreDefaultsButton,
  SectionSkeleton,
  FormSaveDialog,
  CommonFormInput,
  StatusBadge,
  CommonButton,
} from "@/components/common";

// Components - Local
import { PanelCard } from "@/components/dashboard/PanelCard";

// Services & API
import {
  useCalibrationData,
  useSaveCalibrationData,
  useCalibrationOptions,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import {
  calibrationFormSchema,
  type CalibrationFormValues,
} from "@/utils/schemas/calibration-schema";
import type { SaveCalibrationPayload } from "@/services/api/mudproperties/mudproperties.types";

// Contexts
import { useMudPropertiesContext } from "@/context/MudProperties";

// Icons
import { Check, X } from "lucide-react";

/**
 * Calibration Component
 *
 * Manages the calibration settings for gas/compressibility sensors,
 * sanity checks, validation status, and audit logs.
 *
 * @returns JSX.Element
 */
export function Calibration() {
  // ---- Data & State ----
  const { data: calibrationResponse, isLoading } = useCalibrationData();
  const { data: optionsResponse } = useCalibrationOptions();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<CalibrationFormValues>({
    resolver: zodResolver(calibrationFormSchema),
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Re-validate on change
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (calibrationResponse?.data && !hasSetInitial) {
      reset(calibrationResponse.data);
      setHasSetInitial(true);
    }
  }, [calibrationResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveCalibrationPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveCalibrationData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Calibration settings saved successfully",
    errorMessage: "Failed to save calibration settings",
    confirmTitle: "Save Calibration Settings",
    confirmDescription:
      "Are you sure you want to save these calibration changes?",
  });

  /**
   * Register the save handler with the MudPropertiesContext.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      const payload: SaveCalibrationPayload = {
        gasCompressibility: {
          densitySensorOffset: validData.gasCompressibility.densitySensorOffset,
          pvYpCorrectionFactor:
            validData.gasCompressibility.pvYpCorrectionFactor,
          temperatureSensorOffset:
            validData.gasCompressibility.temperatureSensorOffset,
          gasCut: validData.gasCompressibility.gasCut,
        },
        sanityCheck: {
          enabled: validData.sanityCheck.enabled,
        },
      };
      saveWithConfirmation.requestSave(payload);
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

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !calibrationResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  const { sanityCheck, validationStatus, auditLog } = calibrationResponse.data;

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid griid-cols-1 gap-3">
          <div className="grid grid-cols-[1fr_2fr] gap-3 auto-rows-max">
            {/* ---- Gas / Compressibility Section ---- */}
            <PanelCard
              title="Gas / Compressibility"
              headerAction={<RestoreDefaultsButton />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {/* Density sensor offset */}
                  <div className="flex flex-col gap-1">
                    <CommonFormInput
                      name="gasCompressibility.densitySensorOffset"
                      control={control}
                      label="Density sensor offset"
                      placeholder="0.00030"
                      type="text"
                      suffix="1/psi"
                      containerClassName="flex-1"
                    />
                  </div>

                  {/* PV/YP correction factor */}
                  <div className="flex flex-col gap-1">
                    <CommonFormInput
                      name="gasCompressibility.pvYpCorrectionFactor"
                      control={control}
                      label="PV/YP correction factor (%)"
                      placeholder="0"
                      type="text"
                      suffix="%"
                      containerClassName="flex-1"
                    />
                  </div>

                  {/* Temperature sensor offset */}
                  <div className="flex flex-col gap-1">
                    <CommonFormInput
                      name="gasCompressibility.temperatureSensorOffset"
                      control={control}
                      label="Temperature sensor offset"
                      placeholder="0"
                      type="text"
                      suffix="°F"
                      containerClassName="flex-1"
                    />
                  </div>
                </div>

                {/* Gas-cut */}

                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="gasCompressibility.gasCut"
                    control={control}
                    label="Gas-cut"
                    placeholder="0"
                    type="text"
                    suffix="% SG"
                    containerClassName="flex-1"
                  />
                </div>
              </div>
            </PanelCard>

            {/* ---- Sanity Check & Run Summary Section ---- */}
            <PanelCard title="Sanity Check & Run Summary">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sanity check</p>
                    {sanityCheck.lastCheck && (
                      <p className="text-sm text-muted-foreground">
                        Last check: {sanityCheck.lastCheck}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {sanityCheck.densityMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Density : 12.4 ppg (OBM 70/30) = MATCH</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {sanityCheck.rheologyMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      Rheology (PV/YP/gels): 20 cP, 15 / 12 /20 lb/100ft² =
                      MATCH
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {sanityCheck.temperatureMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Temperature gradients: +0.62°F / 100 ft = MATCH</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">
                    Typical Sensor Offsets
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• OBM: {options?.typicalSensorOffsets.obm}</div>
                    <div>• WBM: {options?.typicalSensorOffsets.wbm}</div>
                    <div>• Visco: {options?.typicalSensorOffsets.visco}</div>
                    <div>• Temp: {options?.typicalSensorOffsets.temp}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-5">
                  <CommonButton type="button" variant="default">
                    Import
                  </CommonButton>
                  <CommonButton variant="outline">
                    Upload or download mud calibration settings in pure JSON
                    format
                  </CommonButton>
                </div>
              </div>
            </PanelCard>
          </div>
          <div className="grid griid-cols-1">
            {/* ---- Audit Log / Previous Checks Section ---- */}
            <PanelCard
              title="Audit Log / Previous Checks"
              headerAction={
                <CommonButton variant="outline">Export CSV Data</CommonButton>
              }
            >
              <div className="space-y-2">
                <div className="space-y-1">
                  {auditLog.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent/50 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {log.timestamp}
                        </span>
                        <span>{log.checkType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.details && (
                          <span className="text-muted-foreground">
                            {log.details}
                          </span>
                        )}
                        {log.matchCount > 1 && (
                          <StatusBadge status="Primary" className="text-sm" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PanelCard>
          </div>
        </div>

        {/* ---- Sidebar: Validation Status ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <PanelCard title="Validation Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  <StatusBadge status="OK" className="text-sm mr-2" />
                  OK
                </span>
                <span className="text-sm">
                  <StatusBadge status="Warning" className="text-sm mr-2" />
                  WARN
                </span>
                <span className="text-sm">
                  <StatusBadge status="Error" className="text-sm mr-2" />
                  BAD
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span>Annular temperature</span>
                  <span className="font-medium">
                    {validationStatus.annularTemperature} °F
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>ECD @ Bit</span>
                  <span className="font-medium">
                    {validationStatus.ecdAtBit} ppg
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Required inputs</span>
                  <StatusBadge
                    status={validationStatus.requiredInputs ? "OK" : "Error"}
                    className="text-sm"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Density within range</span>
                  <StatusBadge
                    status={
                      validationStatus.densityWithinRange ? "OK" : "Error"
                    }
                    className="text-sm"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>Temp/pressure logic</span>
                  <StatusBadge
                    status={validationStatus.tempPressureLogic ? "OK" : "Error"}
                    className="text-sm"
                  />
                </div>

                <div className="flex justify-between items-center text-sm pt-3 border-t">
                  <span className="font-medium">Required inputs complete</span>
                  <span className="font-medium">
                    {validationStatus.requiredInputsComplete}
                  </span>
                </div>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
