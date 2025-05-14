/**
 * Utilities for validating template code
 */
import { ValidationResult, MapContext, TEMPLATE_DATA_PROPS } from './types';

/**
 * Validates template code for React syntax errors
 */
export const validateTemplateCode = (code: string): ValidationResult => {
  try {
    // Check if it's empty
    if (!code || !code.trim()) {
      return { isValid: false, error: "Template code is empty" };
    }
    
    // Check if it contains React.createElement, which is required
    if (!code.includes("React.createElement")) {
      return { isValid: false, error: "Invalid template: Must use React.createElement" };
    }

    // Check for common template errors
    const commonError = checkForCommonTemplateErrors(code);
    if (commonError) {
      return { isValid: false, error: commonError };
    }

    // Warn about potential key issues in array mappings
    const mapWithoutKeyWarning = checkForMissingKeys(code);
    if (mapWithoutKeyWarning) {
      console.warn(mapWithoutKeyWarning);
      // Don't invalidate the template, but log a warning
    }

    // Check for incorrect use of index outside of mappings
    const indexErrorMsg = checkForInvalidIndexUsage(code);
    if (indexErrorMsg) {
      return { isValid: false, error: indexErrorMsg };
    }

    // Make sure the code has a return statement
    let codeToValidate = code.trim();
    if (!codeToValidate.startsWith("return")) {
      codeToValidate = `return ${codeToValidate}`;
    }
    
    // Create a function to validate syntax
    new Function(
      "React",
      "personalInfo",
      "workExperience", 
      "education",
      "skills",
      "projects",
      "templateColors",
      codeToValidate
    );
    
    return { isValid: true };
  } catch (error) {
    console.error("Template validation error:", error);
    return { 
      isValid: false, 
      error: error instanceof Error ? `Syntax error: ${error.message}` : "Unknown error" 
    };
  }
};

/**
 * Checks for common template coding errors
 */
export const checkForCommonTemplateErrors = (code: string): string | null => {
  // Check for direct object rendering in jsx
  // This will check for patterns like: {skills} instead of {skills.map(...)}
  for (const prop of TEMPLATE_DATA_PROPS) {
    // Look for direct object references that aren't in a mapping or property access
    const directObjectPattern = new RegExp(`{\\s*${prop}\\s*}`, 'g');
    if (directObjectPattern.test(code)) {
      return `Error: Trying to directly render ${prop} object. Use ${prop}.map() to render arrays.`;
    }
  }
  
  // No errors found
  return null;
};

/**
 * Checks for array mappings that might be missing keys
 */
export const checkForMissingKeys = (code: string): string | null => {
  // Look for .map() calls
  const mapCalls = code.match(/\.map\(\s*[^)]+\)/g);
  if (!mapCalls) return null;

  // Check if any map calls don't have key properties
  for (const mapCall of mapCalls) {
    // If map call doesn't add a key property in the props object
    if (!mapCall.includes('key:') && !mapCall.includes('"key":') && !mapCall.includes("'key':")) {
      return "Warning: Possible missing keys in array mapping. React requires unique keys for list items.";
    }
  }

  return null;
};

/**
 * Checks for incorrect use of index variables outside array mapping contexts
 */
export const checkForInvalidIndexUsage = (code: string): string | null => {
  // Identify array mapping contexts
  const mapContexts: MapContext[] = [];
  let depth = 0;
  let mapStart = -1;
  
  // Find all map function contexts
  for (let i = 0; i < code.length; i++) {
    if (code.slice(i, i+5) === '.map(' && mapStart === -1) {
      mapStart = i;
    }
    if (mapStart >= 0) {
      if (code[i] === '(') depth++;
      if (code[i] === ')') {
        depth--;
        if (depth === 0) {
          mapContexts.push({ start: mapStart, end: i });
          mapStart = -1;
        }
      }
    }
  }
  
  // Check for index/idx usage outside of map contexts
  let nonMapCode = code;
  
  // Remove all map contexts from the code (in reverse to not mess up indices)
  for (let i = mapContexts.length - 1; i >= 0; i--) {
    const ctx = mapContexts[i];
    nonMapCode = nonMapCode.slice(0, ctx.start) + " ".repeat(ctx.end - ctx.start + 1) + nonMapCode.slice(ctx.end + 1);
  }
  
  // Check for idx or index outside of map contexts
  if (/\bidx\b(?!\s*=>)/.test(nonMapCode) || /\bindex\b(?!\s*=>)/.test(nonMapCode)) {
    return "Invalid code: 'idx' or 'index' variable used outside of array mapping context";
  }
  
  return null;
}; 