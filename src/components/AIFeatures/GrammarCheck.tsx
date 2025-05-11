import React, { useState } from "react";
import { generateAIContent } from "@/utils/aiApi";
import { useResume } from "@/context/ResumeContext";
import { useAIApi } from "@/hooks/useAIApi";
import SuggestionModal from "./SuggestionModal";

interface GrammarCheckProps {
  initialText: string;
  field: string;
  onCorrect: (correctedText: string) => void;
}

const GrammarCheck: React.FC<GrammarCheckProps> = ({
  initialText,
  field,
  onCorrect,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { resumeData } = useResume();
  const { apiKey, service, currentModel } = useAIApi();

  const handleCheck = async () => {
    setIsChecking(true);
    setError(null);
    try {
      if (!apiKey || !service) {
        throw new Error("AI API key or service not found");
      }
      const context = JSON.stringify(resumeData);

      const response = await generateAIContent(
        apiKey,
        service,
        initialText,
        field,
        context,
        "grammar",
        currentModel || undefined
      );
      setSuggestions(response);
    } catch (err) {
      setError("Failed to check grammar. Please try again.");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onCorrect(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCheck}
        disabled={isChecking}
        className="text-blue-600 hover:text-blue-800 focus:outline-none relative"
        title="Check Grammar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-all duration-300 ${
            isChecking ? "animate-bounce text-red-600" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {suggestions.length > 0 && (
        <SuggestionModal
          initialText={initialText}
          suggestions={suggestions}
          onAccept={handleSelectSuggestion}
          onReject={() => setSuggestions([])}
          modalType="grammar"
        />
      )}
    </div>
  );
};

export default GrammarCheck;
