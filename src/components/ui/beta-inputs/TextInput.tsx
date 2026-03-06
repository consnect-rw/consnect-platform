"use client";

import { TTextInputProps } from "./input.types";
import { validateInput, getCharCountColor } from "./input.utils";
import { useState, useEffect, useMemo } from "react";
import { FiX, FiAlertCircle, FiCheck } from "react-icons/fi";

/**
 * TextInput - Professional single-line text input with validation
 * Features: Character count, validation, clear button, icons, error states
 */
export default function TextInput({
  label,
  placeholder,
  helperText,
  error: externalError,
  size = "md",
  variant = "light",
  disabled = false,
  required = false,
  fullWidth = false,
  className = "",
  validationRules = [],
  showCharCount = false,
  maxLength,
  minLength,
  type = "text",
  value: controlledValue,
  leftIcon,
  rightIcon,
  clearable = false,
  onChange,
  onValidationChange,
  ...rest
}: TTextInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Calculate validation errors using useMemo (derived state)
  const validation = useMemo(() => {
    if (validationRules.length > 0 && touched) {
      return validateInput(value, validationRules);
    }
    return { isValid: true, errors: [] };
  }, [value, validationRules, touched]);

  // Notify parent of validation changes
  useEffect(() => {
    if (touched && validationRules.length > 0) {
      onValidationChange?.(validation.isValid, validation.errors);
    }
  }, [validation.isValid, validation.errors, touched, validationRules.length, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Enforce maxLength if provided
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    setIsFocused(false);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChange?.("");
  };

  const showError = (externalError || (touched && validation.errors.length > 0)) && !isFocused;
  const displayError = externalError || validation.errors[0];
  const isValid = !showError && touched && value.length > 0;

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3.5 text-lg",
  };

  // Variant classes
  const variantClasses = {
    light: {
      base: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
      focus: "focus:border-orange-500 focus:ring-orange-500",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      disabled: "bg-gray-100 text-gray-500 cursor-not-allowed",
    },
    dark: {
      base: "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500",
      focus: "focus:border-orange-500 focus:ring-orange-500",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      disabled: "bg-gray-800 text-gray-600 cursor-not-allowed",
    },
  };

  const inputClasses = `
    w-full rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${disabled ? variantClasses[variant].disabled : variantClasses[variant].base}
    ${!disabled && (showError ? variantClasses[variant].error : isValid ? variantClasses[variant].success : variantClasses[variant].focus)}
    ${leftIcon ? "pl-10" : ""}
    ${(rightIcon || clearable || showError || isValid) ? "pr-10" : ""}
  `;

  const charCount = maxLength ? value.length : 0;
  const charCountColor = maxLength ? getCharCountColor(charCount, maxLength, variant) : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 ${variant === "light" ? "text-gray-700" : "text-gray-300"}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${variant === "light" ? "text-gray-400" : "text-gray-500"}`}>
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          className={inputClasses}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          {...rest}
        />

        {/* Right Icons (Clear, Error, Success) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {clearable && value && !disabled && !showError && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className={`${variant === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"} transition-colors`}
            >
              <FiX size={18} />
            </button>
          )}

          {showError && (
            <FiAlertCircle size={18} className="text-red-500" />
          )}

          {isValid && (
            <FiCheck size={18} className="text-green-500" />
          )}

          {rightIcon && !clearable && !showError && !isValid && (
            <div className={variant === "light" ? "text-gray-400" : "text-gray-500"}>
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Helper Text, Error, and Character Count */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex-1">
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

        {/* Character Count */}
        {showCharCount && maxLength && (
          <p className={`text-xs font-medium ${charCountColor}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
