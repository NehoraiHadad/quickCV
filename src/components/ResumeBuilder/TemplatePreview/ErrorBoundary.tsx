import React from "react";
import { TemplateErrorBoundaryProps, TemplateErrorBoundaryState } from "./types";

/**
 * Error boundary to catch rendering errors in templates
 */
class TemplateErrorBoundary extends React.Component<
  TemplateErrorBoundaryProps, 
  TemplateErrorBoundaryState
> {
  constructor(props: TemplateErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Template rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default TemplateErrorBoundary; 