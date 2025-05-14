/**
 * Common validation functions for form fields
 */
import { NumberLike } from '../types/validation';

// Basic validations
export const isRequired = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const isEmail = (value: string): boolean => {
  if (!value) return true; // Pass if empty (use with isRequired if needed)
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

export const isURL = (value: string): boolean => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    // Try with https:// if no protocol specified
    if (!value.match(/^[a-zA-Z]+:\/\//)) {
      try {
        new URL(`https://${value}`);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

export const isPhoneNumber = (value: string): boolean => {
  if (!value) return true;
  const phoneRegex = /^(\+?\d{1,3}[- ]?)?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return phoneRegex.test(value);
};

// String validations
export const minLength = (min: number) => (value: string): boolean => {
  if (!value) return true;
  return value.length >= min;
};

export const maxLength = (max: number) => (value: string): boolean => {
  if (!value) return true;
  return value.length <= max;
};

// Date validations
export const isDate = (value: string): boolean => {
  if (!value) return true;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const isAfterDate = (date: string | Date) => (value: string): boolean => {
  if (!value) return true;
  return new Date(value) > new Date(date);
};

export const isBeforeDate = (date: string | Date) => (value: string): boolean => {
  if (!value) return true;
  return new Date(value) < new Date(date);
};

export const isInDateRange = (min: string | Date, max: string | Date) => (value: string): boolean => {
  if (!value) return true;
  const inputDate = new Date(value);
  return inputDate >= new Date(min) && inputDate <= new Date(max);
};

// Number validations
export const isNumber = (value: NumberLike): boolean => {
  if (value === '' || value === null || value === undefined) return true;
  return !isNaN(Number(value));
};

export const isInteger = (value: NumberLike): boolean => {
  if (value === '' || value === null || value === undefined) return true;
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num);
};

export const min = (minValue: number) => (value: NumberLike): boolean => {
  if (value === '' || value === null || value === undefined) return true;
  return Number(value) >= minValue;
};

export const max = (maxValue: number) => (value: NumberLike): boolean => {
  if (value === '' || value === null || value === undefined) return true;
  return Number(value) <= maxValue;
};

// Pattern validation
export const isPattern = (pattern: RegExp) => (value: string): boolean => {
  if (!value) return true;
  return pattern.test(value);
};

// Rule creation helper
export const createValidationRule = <T>(validator: (value: T) => boolean, message: string) => ({
  validator,
  message,
});

// Common validation rules
export const requiredRule = (fieldName: string = 'Field') => 
  createValidationRule<unknown>(isRequired, `${fieldName} is required`);

export const emailRule = createValidationRule<string>(
  isEmail,
  'Please enter a valid email address'
);

export const urlRule = createValidationRule<string>(
  isURL,
  'Please enter a valid URL'
);

export const phoneRule = createValidationRule<string>(
  isPhoneNumber,
  'Please enter a valid phone number'
);

export const minLengthRule = (min: number, fieldName: string = 'Field') => 
  createValidationRule<string>(minLength(min), `${fieldName} must be at least ${min} characters`);

export const maxLengthRule = (max: number, fieldName: string = 'Field') => 
  createValidationRule<string>(maxLength(max), `${fieldName} must be at most ${max} characters`);

export const dateRule = createValidationRule<string>(
  isDate,
  'Please enter a valid date'
);

export const numberRule = createValidationRule<NumberLike>(
  isNumber,
  'Please enter a valid number'
);

export const integerRule = createValidationRule<NumberLike>(
  isInteger,
  'Please enter a valid integer'
);

export const minRule = (minValue: number, fieldName: string = 'Value') => 
  createValidationRule<number | string>(min(minValue), `${fieldName} must be at least ${minValue}`);

export const maxRule = (maxValue: number, fieldName: string = 'Value') => 
  createValidationRule<number | string>(max(maxValue), `${fieldName} must be at most ${maxValue}`); 