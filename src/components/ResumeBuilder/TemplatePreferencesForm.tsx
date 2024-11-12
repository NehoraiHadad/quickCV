import React, { useState } from "react";
import { TemplatePreferences } from "@/types/templates";
import { useCustomTemplates } from "../../hooks/useCustomTemplates";

interface TemplatePreferencesFormProps {
  onSubmit: (preferences: TemplatePreferences) => Promise<void>;
  isLoading: boolean;
  initialPreferences?: TemplatePreferences;
}

export default function TemplatePreferencesForm({
  onSubmit,
  isLoading,
  initialPreferences,
}: TemplatePreferencesFormProps) {
  const { resetTemplateCode } = useCustomTemplates();

  const [preferences, setPreferences] = useState<TemplatePreferences>({
    name: "", 
    layout: "single-column",
    headerStyle: {
      position: "top",
      alignment: "left",
      size: "medium",
    },
    sectionOrder: ["personal", "experience", "education", "skills", "projects"],
    colorScheme: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
    },
    visualElements: {
      useDividers: true,
      useIcons: false,
      borderStyle: "solid",
      useShapes: false,
    },
    spacing: "balanced",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout
        </label>
        <select
          value={preferences.layout}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              layout: e.target.value as TemplatePreferences["layout"],
            })
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
              setPreferences({
                ...preferences,
                headerStyle: {
                  ...preferences.headerStyle,
                  position: e.target.value as "top" | "side",
                },
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="top">Top</option>
            <option value="side">Side</option>
          </select>
          <select
            value={preferences.headerStyle.alignment}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                headerStyle: {
                  ...preferences.headerStyle,
                  alignment: e.target.value as "left" | "center" | "right",
                },
              })
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
                value={value}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    colorScheme: {
                      ...preferences.colorScheme,
                      [key]: e.target.value,
                    },
                  })
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
                setPreferences({
                  ...preferences,
                  visualElements: {
                    ...preferences.visualElements,
                    useDividers: e.target.checked,
                  },
                })
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
                setPreferences({
                  ...preferences,
                  visualElements: {
                    ...preferences.visualElements,
                    useIcons: e.target.checked,
                  },
                })
              }
              className="rounded text-blue-600"
            />
            <span className="text-sm">Use Icons</span>
          </label>
        </div>
      </div>
    </form>
  );
}
