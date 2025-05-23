import { ResumeData } from './resume';

export interface TemplatePreferences {
  layout: "single-column" | "two-column" | "mixed" | "custom";
  name: string;
  headerStyle: {
    position: "top" | "side" | "custom";
    alignment: "left" | "center" | "right" | "custom";
    size: "small" | "medium" | "large" | "custom";
    customStyles?: {
      padding?: string;
      margin?: string;
      background?: string;
      borderRadius?: string;
    };
  };
  sectionOrder: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    custom?: Record<string, string>;
  };
  visualElements: {
    useDividers: boolean;
    useIcons: boolean;
    borderStyle: "none" | "solid" | "dashed" | "custom";
    useShapes: boolean;
    customElements?: {
      dividerStyle?: string;
      iconSet?: string;
      customBorders?: string;
      shapes?: Array<{
        type: string;
        position: string;
        color: string;
      }>;
    };
  };
  spacing: "compact" | "balanced" | "spacious" | "custom";
  customCSS?: string;
  freeformDescription?: string;
  gridConfiguration?: GridConfiguration;
}

export interface GridConfiguration {
  columns: 1 | 2 | 3;
  // Potentially other properties like gap, layout definition per column, etc.
}

export interface CustomTemplate {
  id: string;
  name: string;
  code: string;
  preferences: TemplatePreferences;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  render: (resumeData: ResumeData, colors?: Record<string, string>) => React.ReactElement;
  preview: React.ReactElement;
}
