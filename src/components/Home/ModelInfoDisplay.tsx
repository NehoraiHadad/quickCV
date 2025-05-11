"use client";
import React from 'react';
import { useAIApi } from '@/hooks/useAIApi';

const ModelInfoDisplay: React.FC = () => {
  const { 
    service, 
    currentModel, 
    modelInfo,
    availableModels,
    isLoadingModels,
    updateCurrentModel
  } = useAIApi();
  
  if (!service || !modelInfo) {
    return null;
  }
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = e.target.value;
    updateCurrentModel(selectedModel);
  };
  
  return (
    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
      <h3 className="font-medium">Active AI Model</h3>
      <div className="mt-1 flex flex-col">
        <span>
          <span className="text-gray-500">Service:</span> {service}
        </span>
        
        <div className="mt-2">
          <label htmlFor="model-select" className="block text-xs text-gray-500 mb-1">
            Select Model:
          </label>
          <select
            id="model-select"
            value={currentModel || ''}
            onChange={handleModelChange}
            disabled={isLoadingModels}
            className="w-full p-1 text-xs border border-gray-300 rounded"
          >
            {!currentModel && <option value="">Select a model</option>}
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model} {model === modelInfo.availableModels.preferred ? '(recommended)' : ''}
              </option>
            ))}
          </select>
          {isLoadingModels && <p className="text-xs italic mt-1">Loading models...</p>}
        </div>
        
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer text-blue-600">About model selection</summary>
          <p className="mt-1 text-xs text-gray-500">
            Select a model from the dropdown to use for AI requests. The system will use your selection for all requests
            until you change it. If a model fails, the system will try to use fallback models.
          </p>
        </details>
      </div>
    </div>
  );
};

export default ModelInfoDisplay; 