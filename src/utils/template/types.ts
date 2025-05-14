/**
 * Type definitions for template utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface MapContext {
  start: number;
  end: number;
  itemVar?: string;
}

export const TEMPLATE_DATA_PROPS = ['workExperience', 'education', 'skills', 'projects'] as const;
export type TemplateDataProp = typeof TEMPLATE_DATA_PROPS[number]; 