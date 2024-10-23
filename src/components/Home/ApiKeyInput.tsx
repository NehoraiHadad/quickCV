'use client';
import { useState, useEffect } from 'react';
import { validateApiKey } from '@/utils/aiApi';

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('');
  const [service, setService] = useState('openai');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('aiApiKey');
    const storedService = localStorage.getItem('aiService');
    if (storedKey && storedService) {
      setApiKey(storedKey);
      setService(storedService);
      setHasStoredKey(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    const valid = await validateApiKey(apiKey, service);
    setIsValid(valid);
    setIsValidating(false);
    if (valid) {
      localStorage.setItem('aiApiKey', apiKey);
      localStorage.setItem('aiService', service);
      setHasStoredKey(true);
    }
  };

  const handleDelete = () => {
    localStorage.removeItem('aiApiKey');
    localStorage.removeItem('aiService');
    setApiKey('');
    setService('openai');
    setIsValid(null);
    setHasStoredKey(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
        Enter your AI API Key
      </label>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your API Key"
        />
        <div className="flex space-x-2">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="groq">Groq</option>
            <option value="google">Google AI</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
            disabled={isValidating}
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
        </div>
      </div>
      {isValid !== null && (
        <p className={`mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {isValid ? 'API key is valid!' : 'Invalid API key. Please try again.'}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Providing an API key enables advanced AI features. You can still use the app without one.
        The API key is stored in your browser's local storage.
      </p>
      {hasStoredKey && (
        <button
          type="button"
          onClick={handleDelete}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Delete API key
        </button>
      )}
    </form>
  );
}