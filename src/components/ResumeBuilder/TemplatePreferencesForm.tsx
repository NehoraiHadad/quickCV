import React from "react";
import { TemplatePreferences } from "@/types/templates";

interface TemplatePreferencesFormProps {
  preferences: TemplatePreferences;
  onChange: (preferences: TemplatePreferences) => void;
}

export default function TemplatePreferencesForm({
  preferences,
  onChange,
}: TemplatePreferencesFormProps) {
  // Function to handle any change in the preferences
  const handleChange = (newValues: Partial<TemplatePreferences>) => {
    onChange({
      ...preferences,
      ...newValues,
    });
  };

  // Update header style properties
  const updateHeaderStyle = (key: string, value: string | boolean | number | Record<string, string>) => {
    onChange({
      ...preferences,
      headerStyle: {
        ...preferences.headerStyle,
        [key]: value,
      },
    });
  };

  // Update color scheme properties
  const updateColorScheme = (key: string, value: string) => {
    onChange({
      ...preferences,
      colorScheme: {
        ...preferences.colorScheme,
        [key]: value,
      },
    });
  };

  // Update visual elements properties
  const updateVisualElements = (key: string, value: string | boolean | Record<string, unknown>) => {
    onChange({
      ...preferences,
      visualElements: {
        ...preferences.visualElements,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout
        </label>
        <select
          value={preferences.layout}
          onChange={(e) =>
            handleChange({ layout: e.target.value as TemplatePreferences["layout"] })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="single-column">Single Column</option>
          <option value="two-column">Two Columns</option>
          <option value="mixed">Mixed Layout</option>
        </select>
      </div>

      {/* Header Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Header Style
        </label>
        <div className="grid grid-cols-3 gap-4">
          <select
            value={preferences.headerStyle.position}
            onChange={(e) =>
              updateHeaderStyle("position", e.target.value as "top" | "side" | "custom")
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="top">Top</option>
            <option value="side">Side</option>
          </select>
          <select
            value={preferences.headerStyle.alignment}
            onChange={(e) =>
              updateHeaderStyle("alignment", e.target.value as "left" | "center" | "right" | "custom")
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Color Scheme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Scheme
        </label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(preferences.colorScheme).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="color"
                value={value.toString()}
                onChange={(e) =>
                  updateColorScheme(key, e.target.value)
                }
                className="w-full h-8 rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Visual Elements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visual Elements
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.visualElements.useDividers}
              onChange={(e) =>
                updateVisualElements("useDividers", e.target.checked)
              }
              className="rounded text-blue-600"
            />
            <span className="text-sm">Use Dividers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.visualElements.useIcons}
              onChange={(e) =>
                updateVisualElements("useIcons", e.target.checked)
              }
              className="rounded text-blue-600"
            />
            <span className="text-sm">Use Icons</span>
          </label>
        </div>
      </div>
    </div>
  );
}
