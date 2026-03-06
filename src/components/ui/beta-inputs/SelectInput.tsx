"use client";

import { TSelectInputProps } from "./input.types";
import { validateInput } from "./input.utils";
import { useState, useEffect, useMemo } from "react";
import { FiAlertCircle, FiCheck, FiChevronDown } from "react-icons/fi";

/**
 * SelectInput - Professional dropdown select with validation
 */
export default function SelectInput({
  label,
  helperText,
  error: externalError,
  size = "md",
  variant = "light",
  disabled = false,
  required = false,
  fullWidth = false,
  className = "",
  validationRules = [],
  value: controlledValue,
  options,
  emptyOption = "Select an option...",
  onChange,
  onValidationChange,
  ...rest
}: TSelectInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const validation = useMemo(() => {
    if (validationRules.length > 0 && touched) {
      return validateInput(value, validationRules);
    }
    return { isValid: true, errors: [] };
  }, [value, validationRules, touched]);

  useEffect(() => {
    if (touched && validationRules.length > 0) {
      onValidationChange?.(validation.isValid, validation.errors);
    }
  }, [validation.isValid, validation.errors, touched, validationRules.length, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    setIsFocused(false);
  };

  const showError = (externalError || (touched && validation.errors.length > 0)) && !isFocused;
  const displayError = externalError || validation.errors[0];
  const isValid = !showError && touched && value.length > 0;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm pr-8",
    md: "px-4 py-2.5 text-base pr-10",
    lg: "px-5 py-3.5 text-lg pr-12",
  };

  const variantClasses = {
    light: {
      base: "bg-white border-gray-300 text-gray-900",
      focus: "focus:border-orange-500 focus:ring-orange-500",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      disabled: "bg-gray-100 text-gray-500 cursor-not-allowed",
    },
    dark: {
      base: "bg-gray-900 border-gray-700 text-white",
      focus: "focus:border-orange-500 focus:ring-orange-500",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      disabled: "bg-gray-800 text-gray-600 cursor-not-allowed",
    },
  };

  const selectClasses = `
    w-full rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:cursor-not-allowed appearance-none
    ${sizeClasses[size]}
    ${disabled ? variantClasses[variant].disabled : variantClasses[variant].base}
    ${!disabled && (showError ? variantClasses[variant].error : isValid ? variantClasses[variant].success : variantClasses[variant].focus)}
  `;

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${variant === "light" ? "text-gray-700" : "text-gray-300"}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          required={required}
          className={selectClasses}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          {...rest}
        >
          <option value="" disabled={required}>
            {emptyOption}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${variant === "light" ? "text-gray-400" : "text-gray-500"}`}>
          <FiChevronDown size={20} />
        </div>

        {/* Validation Icons */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          {showError && <FiAlertCircle size={18} className="text-red-500" />}
          {isValid && <FiCheck size={18} className="text-green-500" />}
        </div>
      </div>

      <div className="mt-1.5">
        {showError && displayError ? (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {displayError}
          </p>
        ) : helperText ? (
          <p className={`text-sm ${variant === "light" ? "text-gray-500" : "text-gray-400"}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
