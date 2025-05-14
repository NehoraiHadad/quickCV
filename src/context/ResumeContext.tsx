"use client";
// This file is maintained for backward compatibility.
// New components should import from src/context/resume directly.

export {
  ResumeContext,
  ResumeContextProvider as ResumeProvider,
  useResume
} from './resume';

// Re-export types for backward compatibility
export type { ResumeContextValue } from './resume';
