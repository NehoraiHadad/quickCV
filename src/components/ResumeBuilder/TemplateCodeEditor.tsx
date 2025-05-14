import React from "react";
import { formatTemplateCode } from "../../utils/template/formatter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface TemplateCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  viewMode: "split" | "preview" | "edit";
}

/**
 * Template code editor component with formatting and syntax highlighting
 */
const TemplateCodeEditor: React.FC<TemplateCodeEditorProps> = ({
  code,
  onChange,
  viewMode,
}) => {
  const handleFormatCode = () => {
    const formattedCode = formatTemplateCode(code);
    onChange(formattedCode);
  };

  // Basic textarea editor
  const renderEditor = () => (
    <div className="relative h-full">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={handleFormatCode}
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
        className="w-full h-full min-h-[650px] p-4 font-mono text-sm resize-none border 
                  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                  bg-gray-50 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );

  // Syntax highlighted code
  const renderHighlightedCode = () => {
    // Format the code for display if it contains React.createElement
    const displayCode = code.includes("React.createElement") 
      ? formatTemplateCode(code)
      : code;
      
    return (
      <div className="border rounded-md h-full overflow-hidden">
        <SyntaxHighlighter
          language="javascript" 
          style={vscDarkPlus}
          customStyle={{
            height: "100%",
            minHeight: "650px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            overflow: "auto"
          }}
          wrapLines={true}
          showLineNumbers={true}
          wrapLongLines={true}
        >
          {displayCode}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Split view with editor and preview
  const renderSplitView = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="col-span-1 h-full">{renderEditor()}</div>
      <div className="col-span-1 h-full">{renderHighlightedCode()}</div>
    </div>
  );

  // Return appropriate view based on viewMode
  if (viewMode === "split") return renderSplitView();
  if (viewMode === "preview") return renderHighlightedCode();
  return renderEditor();
};

export default TemplateCodeEditor; 