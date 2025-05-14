"use client";
import React, { useState, useEffect } from "react";
import { validateApiKey } from "@/utils/aiApi";
import ModelInfoDisplay from "./ModelInfoDisplay";
import useAIApi from "@/hooks/useAIApi";
import { 
  FormInput, 
  ResponsiveStack, 
  Button, 
  Card,
  ResponsiveContainer
} from "@/components/ui";

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [service, setService] = useState("openai");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  
  const { currentModel, updateCurrentModel } = useAIApi();

  useEffect(() => {
    const storedKey = localStorage.getItem("aiApiKey");
    const storedService = localStorage.getItem("aiService");
    if (storedKey && storedService) {
      setApiKey(storedKey);
      setService(storedService);
      setHasStoredKey(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationMessage(null);
    
    try {
      const valid = await validateApiKey(apiKey, service, currentModel || undefined);
      setIsValid(valid);
      
      if (valid) {
        localStorage.setItem("aiApiKey", apiKey);
        localStorage.setItem("aiService", service);
        setHasStoredKey(true);
        setValidationMessage(`Successfully connected to ${service} API${currentModel ? ` with model ${currentModel}` : ''}.`);
      } else {
        setValidationMessage(`Invalid API key${currentModel ? ` or model ${currentModel} not available` : ''}. Please check your key and try again.`);
      }
    } catch (error) {
      console.error("Error validating key:", error);
      setIsValid(false);
      setValidationMessage("Error validating API key. Please check your network connection and try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleDelete = () => {
    localStorage.removeItem("aiApiKey");
    localStorage.removeItem("aiService");
    localStorage.removeItem("aiCurrentModel");
    setApiKey("");
    setService("openai");
    setIsValid(null);
    setHasStoredKey(false);
    setValidationMessage(null);
    updateCurrentModel("");
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setService(e.target.value);
    // Reset current model when changing service
    updateCurrentModel("");
  };

  return (
    <ResponsiveContainer maxWidth="lg" className="mb-6">
      <Card>
        <form onSubmit={handleSubmit} className="mb-3">
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your AI API Key
          </label>
          
          <ResponsiveStack 
            direction="row" 
            breakpoint="sm" 
            spacing={2} 
            alignment="center"
          >
            <div className="flex-grow">
              <FormInput
                id="apiKey"
                label=""
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API Key"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={service}
                onChange={handleServiceChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="groq">Groq</option>
                <option value="google">Google AI</option>
              </select>
              <Button
                type="submit"
                variant="primary"
                disabled={isValidating}
              >
                {isValidating ? "Validating..." : "Validate"}
              </Button>
            </div>
          </ResponsiveStack>
          
          {validationMessage && (
            <p
              className={`mt-2 text-sm ${
                isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {validationMessage}
            </p>
          )}
          
          <p className="mt-2 text-xs text-gray-500">
            Providing an API key enables advanced AI features. After validation, you can select a specific model to use from each provider.
          </p>
          
          {hasStoredKey && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="danger"
              size="sm"
              className="mt-2"
            >
              Delete API key and settings
            </Button>
          )}
        </form>
      </Card>
      
      {hasStoredKey && <ModelInfoDisplay />}
    </ResponsiveContainer>
  );
}
