// src/components/Home/LanguageSelector.tsx
'use client';
import { useState } from 'react';
import { Card, ResponsiveContainer } from '@/components/ui';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  initialLanguage: string;
}

export default function LanguageSelector({ onLanguageChange, initialLanguage }: LanguageSelectorProps) {
  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  return (
    <ResponsiveContainer maxWidth="lg" className="mb-6">
      <Card>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          disabled // For now, only English is supported.
        >
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </Card>
    </ResponsiveContainer>
  );
}