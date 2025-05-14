/**
 * Template utilities barrel file
 * Provides a unified API for template-related functionality
 */

// Re-export from formatter
export { 
  formatTemplateCode,
  cleanGeneratedCode 
} from './formatter';

// Re-export from validator
export {
  validateTemplateCode,
  checkForCommonTemplateErrors,
  checkForMissingKeys,
  checkForInvalidIndexUsage
} from './validator';

// Re-export types
export * from './types'; 