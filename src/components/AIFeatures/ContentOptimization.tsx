import React, { useState } from "react";
import { generateAIContent } from "@/utils/aiApi";
import { useResume } from "@/context/ResumeContext";
import useAIApi from "@/hooks/useAIApi";
import SuggestionModal from "./SuggestionModal";

interface ContentOptimizationProps {
  initialText: string;
  field: string;
  onOptimize: (optimizedText: string) => void;
}

const ContentOptimization: React.FC<ContentOptimizationProps> = ({
  initialText,
  field,
  onOptimize,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { resumeData } = useResume();
  const { apiKey, service, currentModel } = useAIApi();

  const handleOptimize = async () => {
    setIsOptimizing(true);
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
        "optimize",
        currentModel || undefined
      );
      setSuggestions(response);
    } catch (err) {
      setError("Failed to optimize content. Please try again.");
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onOptimize(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOptimize}
        disabled={isOptimizing}
        className="text-blue-600 hover:text-blue-800 focus:outline-none relative"
        title="Optimize Content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-all duration-300 ${
            isOptimizing ? "animate-spin text-green-500" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
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
          modalType="optimize"
        />
      )}
    </div>
  );
};

export default ContentOptimization;
