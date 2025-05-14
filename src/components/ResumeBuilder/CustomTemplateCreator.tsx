/**
 * CustomTemplateCreator compatibility layer
 * 
 * This file provides backward compatibility for existing imports while 
 * forwarding to the new modular component structure.
 * 
 * After all imports have been updated to use the new structure,
 * this file can be safely removed.
 */

import CustomTemplateCreator from './CustomTemplateCreator/index';
export * from './CustomTemplateCreator/types';
export default CustomTemplateCreator;

// Log a deprecation warning in development mode
if (process.env.NODE_ENV === 'development') {
  console.warn(
    'src/components/ResumeBuilder/CustomTemplateCreator.tsx is deprecated and will be removed. ' +
    'Please update imports to use the new modular structure from src/components/ResumeBuilder/CustomTemplateCreator/* instead.'
  );
}
