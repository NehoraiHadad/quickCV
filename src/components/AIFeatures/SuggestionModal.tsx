import React, { useState } from "react";

interface SuggestionModalProps {
  initialText: string;
  suggestions: string[];
  onAccept: (suggestion: string) => void;
  onReject: () => void;
  modalType: "grammar" | "optimize" | "suggest";
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  initialText,
  suggestions,
  onAccept,
  onReject,
  modalType,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const modalTitle = {
    grammar: "Grammar Check",
    optimize: "Content Optimization",
    suggest: "Content Suggestions",
  }[modalType];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full relative z-50 p-6">
        <button
          onClick={onReject}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{modalTitle}</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold mb-2 text-gray-700">Original Text:</h3>
            <div className="bg-gray-100 rounded-md p-4 h-40 overflow-y-auto">
              <p className="text-sm text-gray-600">{initialText}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold mb-2 text-gray-700">
              {modalType === "grammar" ? "Corrected Text:" : "Suggestions:"}
            </h3>
            {modalType === "grammar" ? (
              <div className="bg-blue-50 rounded-md p-4 h-40 overflow-y-auto">
                <p className="text-sm text-gray-700">{suggestions[0]}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                      selectedIndex === index
                        ? "bg-blue-100 border-blue-300 border"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <h4 className="font-medium text-sm text-gray-800 mb-1">
                      Suggestion {index + 1}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {suggestion.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {modalType === "grammar" ? (
          ""
        ) : (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-gray-700">
              Selected Suggestion:
            </h3>
            <div className="bg-blue-50 rounded-md p-4 h-40 overflow-y-auto">
              <p className="text-sm text-gray-700">
                {suggestions[selectedIndex]}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onAccept(suggestions[selectedIndex])}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Accept {modalType === "grammar" ? "Correction" : "Suggestion"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
