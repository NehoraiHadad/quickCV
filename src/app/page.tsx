"use client";
import { useState } from "react";
import LanguageSelector from "@/components/Home/LanguageSelector";
import Link from "next/link";
import ApiKeyInput from "@/components/Home/ApiKeyInput";
import Image from "next/image";

export default function HomePage() {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg w-full px-6 sm:px-8 py-10 sm:py-14 bg-white rounded-xl shadow-lg animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          <span className="text-blue-600">Welcome to</span>
          <Image
            src="/images/logo.png"
            alt="QuickCV Logo"
            width={200}
            height={50}
            priority
            className="inline-block ml-2 pb-2"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "200px",
              maxHeight: "50px",
            }}
          />
        </h1>
        <LanguageSelector
          onLanguageChange={handleLanguageChange}
          initialLanguage={language}
        />
        <ApiKeyInput />
        <Link
          href={`/${language}/resume-builder`}
          className="mt-10 block w-full text-center text-white bg-blue-600 hover:bg-blue-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-300 hover:shadow-md"
        >
          Continue to Resume Builder
        </Link>
      </div>
    </div>
  );
}
