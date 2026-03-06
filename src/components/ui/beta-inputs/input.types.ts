import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "light" | "dark";
export type ValidationRule = {
  type: "required" | "minLength" | "maxLength" | "pattern" | "email" | "url" | "custom";
  value?: number | RegExp | string;
  message: string;
  validator?: (value: string) => boolean;
};

// Base props shared by all inputs
export type TBaseInputProps = {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  validationRules?: ValidationRule[];
  showCharCount?: boolean;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
};

// TextInput - Single line text input
export type TTextInputProps = TBaseInputProps & {
  value?: string;
  type?: "text" | "email" | "url" | "tel" | "password";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">;

// TextAreaInput - Multi-line text input
export type TTextAreaInputProps = TBaseInputProps & {
  value?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  resizable?: boolean;
  autoGrow?: boolean;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

// SelectInput - Dropdown select
export type TSelectInputProps = TBaseInputProps & {
  value?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  emptyOption?: string;
  searchable?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange">;

// CheckboxInput - Single checkbox
export type TCheckboxInputProps = {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  error?: string;
  variant?: InputVariant;
  className?: string;
  onChange?: (checked: boolean) => void;
};

// RadioInput - Single radio button
export type TRadioInputProps = {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  name: string;
  variant?: InputVariant;
  className?: string;
  onChange?: (value: string) => void;
};

// RadioGroupInput - Group of radio buttons
export type TRadioGroupInputProps = {
  label?: string;
  name: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  error?: string;
  variant?: InputVariant;
  orientation?: "horizontal" | "vertical";
  onChange?: (value: string) => void;
};

// FileInput - File upload
export type TFileInputProps = {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onChange?: (files: File | File[] | undefined) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">;

// NumberInput - Number input with increment/decrement
export type TNumberInputProps = TBaseInputProps & {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  showControls?: boolean;
  onChange?: (value: number) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">;

// PasswordInput - Password input with show/hide toggle
export type TPasswordInputProps = TBaseInputProps & {
  value?: string;
  maxLength?: number;
  minLength?: number;
  showStrengthIndicator?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">;

// EmailInput - Specialized email input
export type TEmailInputProps = TBaseInputProps & {
  value?: string;
  maxLength?: number;
  minLength?: number;
  clearable?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">;

// DateInput - Date input with calendar
export type TDateInputProps = TBaseInputProps & {
  value?: string;
  min?: string;
  max?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">;

// OtpInput - One-time password input
export type TOtpInputProps = {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange" | "value">;

// SwitchInput - Toggle switch
export type TSwitchInputProps = {
  label?: string;
  helperText?: string;
  variant?: InputVariant;
  disabled?: boolean;
  size?: InputSize;
  checked?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange" | "checked">;
