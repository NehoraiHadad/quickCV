import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { TemplatePreferences } from "../../types/templates";
import TemplatePreferencesForm from "./TemplatePreferencesForm";
import { useAIApi } from "../../hooks/useAIApi";
import { AITemplateGenerator } from "../AIFeatures/AITemplateGenerator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CustomTemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreate: (template: CustomTemplate) => Promise<void>;
  editingTemplate?: CustomTemplate | null;
}

interface CustomTemplate {
  id: string;
  name: string;
  code: string;
  preferences: TemplatePreferences;
  createdAt: Date;
}

interface CodeViewState {
  mode: "split" | "preview" | "edit";
}

const cleanGeneratedCode = (code: string): string => {
  let cleanCode = code
    .replace(/^```(jsx|javascript|typescript)?\n|```$/g, "")
    .trim();

  if (!cleanCode.trim()) {
    return "return";
  }

  if (!cleanCode.trim().startsWith("return")) {
    cleanCode = `return ${cleanCode}`;
  }

  return cleanCode;
};

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 transition-colors duration-200 ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {children}
  </button>
);

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100 transition-shadow hover:shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const CodeEditor = ({
  code,
  onChange,
}: {
  code: string;
  onChange: (value: string) => void;
}) => {
  const formatCode = () => {
    try {
      let formattedCode = code.trim();

      formattedCode = formattedCode.replace(/}\s*/g, "}\n");

      let indent = 0;
      formattedCode = formattedCode
        .split("\n")
        .map((line) => {
          line = line.trim();
          if (line.includes("}")) {
            indent = Math.max(0, indent - 1);
          }
          const formattedLine = "  ".repeat(indent) + line;
          if (line.includes("{")) {
            indent++;
          }
          return formattedLine;
        })
        .join("\n");

      formattedCode = formattedCode.replace(/,([^\s])/g, ", $1");

      formattedCode = formattedCode.replace(/;([^\s])/g, "; $1");

      formattedCode = formattedCode.replace(
        /React\.createElement\((.*?)\)/g,
        (match, params) => {
          const parts = params.split(",").map((p: string) => p.trim());
          if (parts.length > 2) {
            return `React.createElement(\n  ${parts[0]},\n  ${
              parts[1]
            },\n  ${parts.slice(2).join(",\n  ")}\n)`;
          }
          return match;
        }
      );

      onChange(formattedCode);
    } catch (error) {
      console.error("Failed to format code:", error);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={formatCode}
          className="px-3 py-1.5 text-xs bg-gray-700 text-white rounded-md 
                   hover:bg-gray-600 transition-colors shadow-sm"
          title="Format code structure"
        >
          Format
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[500px] p-4 font-mono text-sm resize-none border 
                  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                  bg-gray-50 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};

const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const CustomTemplateCreator: React.FC<CustomTemplateCreatorProps> = ({
  isOpen,
  onClose,
  onTemplateCreate,
  editingTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<"generate" | "code">("generate");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [preferences, setPreferences] = useState<TemplatePreferences>({
    name: "",
    layout: "single-column",
    headerStyle: {
      position: "top",
      alignment: "left",
      size: "medium",
    },
    sectionOrder: ["personal", "experience", "education", "skills", "projects"],
    colorScheme: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
    },
    visualElements: {
      useDividers: true,
      useIcons: false,
      borderStyle: "solid",
      useShapes: false,
    },
    spacing: "balanced",
    customCSS: "",
    freeformDescription: "",
  });
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeViewMode, setCodeViewMode] =
    useState<CodeViewState["mode"]>("split");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [freeformDescription, setFreeformDescription] = useState("");

  const { apiKey, service, currentModel } = useAIApi();

  // Load editing template data when available
  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setCode(editingTemplate.code);
      setPreferences(editingTemplate.preferences);
      setActiveTab("code");
    } else {
      setName("");
      setCode("");
      setActiveTab("generate");
    }
  }, [editingTemplate]);

  const handleCreateTemplate = async (prefs: TemplatePreferences) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!apiKey || !service) {
        throw new Error("API key and service are required");
      }

      const enrichedPrefs = {
        ...prefs,
        freeformDescription: freeformDescription,
      };

      const response = await AITemplateGenerator(
        enrichedPrefs,
        apiKey,
        service,
        currentModel || undefined
      );

      const cleanedCode = cleanGeneratedCode(response.templateCode);
      setGeneratedCode(cleanedCode);
      setCode(cleanedCode);
      setPreferences(prefs);

      if (!response.success) {
        setError(response.error || "Failed to generate template");
      }

      setActiveTab("code");
    } catch (err) {
      setError("Failed to create template. Please try again.");
      console.error("Template creation error:", err);

      setActiveTab("code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      setError("Template name is required");
      return;
    }

    try {
      const finalTemplate: CustomTemplate = {
        id: editingTemplate?.id || `custom-${Date.now()}`,
        name,
        code: activeTab === "generate" ? generatedCode : code,
        preferences: {
          ...preferences,
          name,
        },
        createdAt: editingTemplate?.createdAt || new Date(),
      };

      await onTemplateCreate(finalTemplate);
      onClose();
      // Reset state
      setName("");
      setGeneratedCode("");
      setCode("");
      setError(null);
    } catch (error) {
      console.error("Failed to save template:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save template. Please try again."
      );
    }
  };

  const resetState = () => {
    setName("");
    setCode("");
    setGeneratedCode("");
    setError(null);
    setActiveTab("generate");
    setCodeViewMode("split");
    setShowAdvancedOptions(false);
    setFreeformDescription("");
    setPreferences({
      name: "",
      layout: "single-column",
      headerStyle: {
        position: "top",
        alignment: "left",
        size: "medium",
      },
      sectionOrder: [
        "personal",
        "experience",
        "education",
        "skills",
        "projects",
      ],
      colorScheme: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff",
      },
      visualElements: {
        useDividers: true,
        useIcons: false,
        borderStyle: "solid",
        useShapes: false,
      },
      spacing: "balanced",
      customCSS: "",
      freeformDescription: "",
    });
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleGenerateClick = async () => {
    await handleCreateTemplate(preferences);
  };

  const renderFreeformSection = () => (
    <FormSection title="Template Description">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Describe your desired template layout and styling
          </label>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
          >
            {showAdvancedOptions ? (
              <>
                <span>Hide Advanced</span>
                <ChevronUpIcon />
              </>
            ) : (
              <>
                <span>Show Advanced</span>
                <ChevronDownIcon />
              </>
            )}
          </button>
        </div>

        <textarea
          value={freeformDescription}
          onChange={handleFreeformChange}
          placeholder="Describe your template design in natural language... (e.g., 'Create a modern resume with a bold header, timeline-style experience section, and skill bars')"
          className="w-full h-32 p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-800 resize-none transition-colors"
        />

        {showAdvancedOptions && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS
              </label>
              <textarea
                value={preferences.customCSS || ""}
                onChange={handleCustomCSSChange}
                placeholder=".header {&#10;  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);&#10;  padding: 2rem;&#10;}&#10;.section-title {&#10;  font-size: 1.5rem;&#10;  color: #2d3748;&#10;}"
                className="w-full h-48 p-3 font-mono text-sm border border-gray-200 rounded-md bg-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Divider Style
                </label>
                <input
                  type="text"
                  value={
                    preferences.visualElements.customElements?.dividerStyle ||
                    ""
                  }
                  onChange={handleCustomElementsChange}
                  placeholder="e.g., 2px dashed #e2e8f0"
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Set
                </label>
                <input
                  type="text"
                  value={
                    preferences.visualElements.customElements?.iconSet || ""
                  }
                  onChange={handleIconSetChange}
                  placeholder="e.g., material-icons, feather"
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFreeformDescription(value);
    setPreferences((prev) => ({
      ...prev,
      freeformDescription: value,
    }));
  };

  const handleCustomCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPreferences((prev) => ({
      ...prev,
      customCSS: value,
    }));
  };

  const handleCustomElementsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPreferences((prev) => ({
      ...prev,
      visualElements: {
        ...prev.visualElements,
        customElements: {
          ...prev.visualElements.customElements,
          dividerStyle: value,
        },
      },
    }));
  };

  const handleIconSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPreferences((prev) => ({
      ...prev,
      visualElements: {
        ...prev.visualElements,
        customElements: {
          ...prev.visualElements.customElements,
          iconSet: value,
        },
      },
    }));
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="mx-auto w-full max-w-4xl rounded-lg bg-gray-50 shadow-xl 
                              flex flex-col max-h-[90vh] md:max-h-[80vh]"
        >
          <div className="p-4 border-b bg-white rounded-t-lg">
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              {editingTemplate ? "Edit Template" : "Create Custom Template"}
            </DialogTitle>
          </div>

          <div className="border-b bg-white">
            <div className="flex">
              <TabButton
                active={activeTab === "generate"}
                onClick={() => setActiveTab("generate")}
              >
                Generate Template
              </TabButton>
              <TabButton
                active={activeTab === "code"}
                onClick={() => setActiveTab("code")}
              >
                Edit Code
              </TabButton>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <FormSection title="Basic Information">
              <input
                type="text"
                placeholder="Enter template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white placeholder-gray-400 text-gray-800
                          transition-colors"
              />
            </FormSection>

            {activeTab === "generate" && (
              <>
                {generatedCode ? (
                  <FormSection title="Generated Code">
                    <div className="space-y-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setGeneratedCode("");
                            handleGenerateClick();
                          }}
                          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md 
                                    hover:bg-green-600 transition-colors flex items-center gap-1"
                          disabled={isLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {isLoading ? "Regenerating..." : "Regenerate"}
                        </button>
                        <button
                          onClick={() => setGeneratedCode("")}
                          className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md 
                                    hover:bg-gray-600 transition-colors flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Clear
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        {generatedCode}
                      </SyntaxHighlighter>
                    </div>
                  </FormSection>
                ) : (
                  <>
                    {renderFreeformSection()}
                    <TemplatePreferencesForm onSubmit={handleCreateTemplate} />
                  </>
                )}
              </>
            )}

            {activeTab === "code" && (
              <FormSection title="Template Code">
                <div className="flex justify-end gap-2 mb-2">
                  <button
                    onClick={() => setCodeViewMode("preview")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
                      ${
                        codeViewMode === "preview"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Preview
                  </button>
                  <button
                    onClick={() => setCodeViewMode("edit")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1
                      ${
                        codeViewMode === "edit"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>

                {codeViewMode === "preview" ? (
                  <div className="border rounded-md overflow-hidden">
                    <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        minHeight: "500px",
                      }}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <CodeEditor code={code} onChange={setCode} />
                )}
              </FormSection>
            )}
          </div>

          <div className="p-4 border-t bg-white rounded-b-lg flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors
                         flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel
            </button>

            {activeTab === "generate" && !generatedCode ? (
              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md 
                          hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Template"}
              </button>
            ) : (
              <button
                onClick={handleSaveTemplate}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md 
                          hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Template"}
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CustomTemplateCreator;
