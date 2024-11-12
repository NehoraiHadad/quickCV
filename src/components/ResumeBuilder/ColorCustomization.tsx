import React from 'react';
import { useResume } from '@/context/ResumeContext';

const colorOptions = [
  { name: 'Primary', key: 'primary' },
  { name: 'Secondary', key: 'secondary' },
  { name: 'Accent', key: 'accent' },
];

export default function ColorCustomization() {
  const { resumeData, updateColors } = useResume();
  const { colors } = resumeData;

  const handleColorChange = (key: string, value: string) => {
    updateColors({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Color Customization</h2>
      {colorOptions.map((option) => (
        <div key={option.key} className="flex items-center space-x-4">
          <label htmlFor={option.key} className="w-24 font-medium text-gray-700">
            {option.name}
          </label>
          <input
            type="color"
            id={option.key}
            value={colors[option.key as keyof typeof colors] || '#000000'}
            onChange={(e) => handleColorChange(option.key, e.target.value)}
            className="w-12 h-8 border border-gray-300 rounded-md shadow-sm cursor-pointer"
            aria-label={`Pick ${option.name.toLowerCase()} color`}
            data-testid={`${option.key}-color-picker`}
          />
          <input
            type="text"
            value={colors[option.key as keyof typeof colors] || '#000000'}
            onChange={(e) => handleColorChange(option.key, e.target.value)}
            className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            data-testid={`${option.key}-color-text`}
          />
        </div>
      ))}
    </div>
  );
}