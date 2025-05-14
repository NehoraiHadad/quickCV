/**
 * Types for validation utilities
 */

// Generic form value types
export type FormValuePrimitive = string | number | boolean | null | undefined;
export type FormValueArray = Array<FormValuePrimitive | Record<string, unknown>>;
export type FormValueObject = Record<string, unknown>;
export type FormValue = FormValuePrimitive | FormValueArray | FormValueObject;

// Number validation type
export type NumberLike = string | number; 