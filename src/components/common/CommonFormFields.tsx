import * as React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { CommonInput, CommonInputProps } from "./CommonInput";
import { CommonSelect, CommonSelectProps } from "./CommonSelect";
import { CommonToggle, CommonToggleProps } from "./CommonToggle";
import { CommonCheckbox, CommonCheckboxProps } from "./CommonCheckbox";

// ============================================
// CommonFormInput
// ============================================

export type CommonFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<CommonInputProps, "name" | "value" | "onChange" | "onBlur" | "ref"> & {
  control: Control<TFieldValues>;
  name: TName;
  containerClassName?: string;
};

export function CommonFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  containerClassName,
  ...props
}: CommonFormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={containerClassName}>
          <CommonInput {...field} {...props} />
          {fieldState.error && (
            <p className="text-sm text-destructive mt-0.5 ml-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

// ============================================
// CommonFormSelect
// ============================================

export type CommonFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<CommonSelectProps, "value" | "onValueChange"> & {
  control: Control<TFieldValues>;
  name: TName;
  containerClassName?: string;
};

export function CommonFormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  containerClassName,
  ...props
}: CommonFormSelectProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={containerClassName}>
          <CommonSelect
            value={field.value}
            onValueChange={field.onChange}
            {...props}
          />
          {fieldState.error && (
            <p className="text-sm text-destructive ml-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

// ============================================
// CommonFormToggle
// ============================================

export type CommonFormToggleProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<CommonToggleProps, "checked" | "onCheckedChange"> & {
  control: Control<TFieldValues>;
  name: TName;
  containerClassName?: string;
};

export function CommonFormToggle<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  containerClassName,
  ...props
}: CommonFormToggleProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={containerClassName}>
          <CommonToggle
            checked={field.value}
            onCheckedChange={field.onChange}
            {...props}
          />
          {fieldState.error && (
            <p className="text-sm text-destructive ml-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

// ============================================
// CommonFormCheckbox
// ============================================

export type CommonFormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<CommonCheckboxProps, "checked" | "onCheckedChange"> & {
  control: Control<TFieldValues>;
  name: TName;
  containerClassName?: string;
};

export function CommonFormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  containerClassName,
  ...props
}: CommonFormCheckboxProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={containerClassName}>
          <CommonCheckbox
            checked={field.value}
            onCheckedChange={field.onChange}
            {...props}
          />
          {fieldState.error && (
            <p className="text-sm text-destructive ml-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
