import React, { useState } from "react";
import { generateAIContent } from "@/utils/aiApi";
import { useResume } from "@/context/ResumeContext";
import { useAIApi } from "@/hooks/useAIApi";
import SuggestionModal from "./SuggestionModal";

interface ContentSuggestionsProps {
  initialText: string;
  field: string;
  onSuggest: (suggestedText: string) => void;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  initialText,
  field,
  onSuggest,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { resumeData } = useResume();
  const { apiKey, service } = useAIApi();

  const handleSuggest = async () => {
    setIsSuggesting(true);
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
        "suggest"
      );
      setSuggestions(response);
    } catch (err) {
      setError("Failed to suggest content. Please try again.");
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onSuggest(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <button
        onClick={handleSuggest}
        disabled={isSuggesting}
        className="text-blue-600 hover:text-blue-800 focus:outline-none relative"
        title="Suggest Content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-all duration-300 ${
            isSuggesting ? 'animate-pulse text-yellow-400' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {suggestions.length > 0 && (
        <SuggestionModal
          initialText={initialText}
          suggestions={suggestions}
          onAccept={handleSelectSuggestion}
          onReject={() => setSuggestions([])}
          modalType="suggest"
        />
      )}
    </div>
  );
};

export default ContentSuggestions;
