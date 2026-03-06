import { ValidationRule } from "./input.types";

export const validateInput = (
  value: string,
  rules: ValidationRule[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value || value.trim() === "") {
          errors.push(rule.message);
        }
        break;

      case "minLength":
        if (typeof rule.value === "number" && value.length < rule.value) {
          errors.push(rule.message);
        }
        break;

      case "maxLength":
        if (typeof rule.value === "number" && value.length > rule.value) {
          errors.push(rule.message);
        }
        break;

      case "pattern":
        if (rule.value instanceof RegExp && !rule.value.test(value)) {
          errors.push(rule.message);
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.push(rule.message);
        }
        break;

      case "url":
        try {
          if (value) new URL(value);
        } catch {
          errors.push(rule.message);
        }
        break;

      case "custom":
        // Custom validation can be handled by parent component
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getCharCountColor = (
  currentLength: number,
  maxLength: number,
  variant: "light" | "dark" = "light"
): string => {
  const percentage = (currentLength / maxLength) * 100;
  
  if (percentage >= 100) {
    return "text-red-600";
  } else if (percentage >= 90) {
    return "text-orange-600";
  } else if (percentage >= 75) {
    return "text-yellow-600";
  } else {
    return variant === "light" ? "text-gray-500" : "text-gray-400";
  }
};
