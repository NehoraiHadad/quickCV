// Define default colors and styles for DefaultTemplate
export const defaultColors = {
  primary: '#3B82F6',  // Blue
  secondary: '#1F2937', // Dark gray
  accent: '#10B981',   // Green
};

export const getTemplateColors = (colors: Record<string, string> = {}) => {
  // Merge default colors with user-defined colors
  return { ...defaultColors, ...colors };
};

// Common style functions that can be used across template components
export const getSectionHeaderStyle = (color: string) => ({
  color,
});

export const getBackgroundStyle = (color: string, opacity: number = 0.1) => ({
  backgroundColor: `${color}${Math.round(opacity * 100)}`,
});

export const getLinkStyle = (color: string) => ({
  color,
});

export const getBorderStyle = (color: string) => ({
  borderColor: color,
}); 