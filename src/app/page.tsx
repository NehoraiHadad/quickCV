'use client';
import { useState } from 'react';
import LanguageSelector from '@/components/Home/LanguageSelector';
import Link from 'next/link';
import ApiKeyInput from '@/components/Home/ApiKeyInput';

export default function HomePage() {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg w-full px-4 sm:px-6 py-8 sm:py-12 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">Welcome to QuickCV</h1>
        <LanguageSelector onLanguageChange={handleLanguageChange} initialLanguage={language} />
        <ApiKeyInput />
        <Link
          href={`/${language}/resume-builder`}
          className="mt-8 block w-full text-center text-white bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-4 rounded-md transition-colors duration-300"
        >
          Continue to Resume Builder
        </Link>
      </div>
    </div>
  );
}