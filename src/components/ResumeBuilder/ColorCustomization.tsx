import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { ResumeSection, FormInput, Card } from '@/components/ui';

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
    <ResumeSection title="Color Customization">
      <Card>
        <div className="space-y-4">
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
              <FormInput
                id={`${option.key}-text`}
                label=""
                value={colors[option.key as keyof typeof colors] || '#000000'}
                onChange={(e) => handleColorChange(option.key, e.target.value)}
                className="w-24"
                data-testid={`${option.key}-color-text`}
              />
            </div>
          ))}
        </div>
      </Card>
    </ResumeSection>
  );
}