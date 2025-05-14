/**
 * Utilities for formatting template code
 */

/**
 * Formats template code for better readability
 */
export const formatTemplateCode = (code: string): string => {
  try {
    let formattedCode = code.trim();

    // Make sure there's a return statement if needed
    if (!formattedCode.startsWith("return") && !formattedCode.startsWith("() =>")) {
      formattedCode = `return ${formattedCode}`;
    }

    // Add line breaks after closing braces
    formattedCode = formattedCode.replace(/}\s*/g, "}\n");

    // Indent code based on nesting level
    let indent = 0;
    formattedCode = formattedCode
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (line.includes("}") && !line.includes("{")) {
          indent = Math.max(0, indent - 1);
        }
        const formattedLine = "  ".repeat(indent) + line;
        if (line.includes("{") && !line.includes("}")) {
          indent++;
        }
        return formattedLine;
      })
      .join("\n");

    // Format commas
    formattedCode = formattedCode.replace(/,([^\s])/g, ", $1");

    // Format semicolons
    formattedCode = formattedCode.replace(/;([^\s])/g, "; $1");

    // Improve React.createElement formatting
    formattedCode = formattedCode.replace(
      /React\.createElement\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      (match, component, props, children) => {
        // For nested React.createElement calls
        if (children.includes("React.createElement")) {
          return `React.createElement(\n  ${component},\n  ${props},\n  ${children.trim()}\n)`;
        }
        return `React.createElement(${component}, ${props}, ${children})`;
      }
    );

    // Break lines for readability at reasonable width
    formattedCode = formattedCode.replace(/(React\.createElement\(.{80,}?)([,)])/g, "$1\n$2");

    return formattedCode;
  } catch (error) {
    console.error("Failed to format code:", error);
    return code;
  }
};

/**
 * Cleans generated code by removing markdown code blocks and ensuring proper format
 */
export const cleanGeneratedCode = (code: string): string => {
  // If empty code, return simple return statement
  if (!code || !code.trim()) {
    return "return null;";
  }
  
  // Remove markdown code blocks and trim
  let cleanCode = code
    .replace(/```(jsx|javascript|typescript|js|ts|react)?[\s\n]?|```$/g, "")
    .trim();

  // Check for React.createElement to ensure it's a valid template
  if (!cleanCode.includes("React.createElement")) {
    console.warn("Warning: Template code doesn't contain React.createElement");
  }

  // Add return statement if missing
  if (!cleanCode.trim().startsWith("return")) {
    cleanCode = `return ${cleanCode}`;
  }

  // Only attempt to fix array mapping keys if we see .map() calls
  if (cleanCode.includes(".map(")) {
    try {
      cleanCode = fixArrayMappingKeys(cleanCode);
    } catch (error) {
      console.error("Error fixing array mapping keys:", error);
      // Continue with the original code if there's an error
    }
  }

  console.log("Cleaned template code:", cleanCode);
  return cleanCode;
};

/**
 * Attempts to fix key issues in array mappings
 */
const fixArrayMappingKeys = (code: string): string => {
  // First, identify array mapping contexts
  const mapContexts: {start: number, end: number, itemVar: string}[] = [];
  let depth = 0;
  let mapStart = -1;
  let currentItemVar = '';
  
  // Find all map function contexts and capture the item variable name
  for (let i = 0; i < code.length; i++) {
    if (code.slice(i, i+5) === '.map(' && mapStart === -1) {
      mapStart = i;
      
      // Try to extract the item variable name
      const mapMatch = code.slice(i).match(/\.map\(\s*\(?([a-zA-Z0-9_]+)(?:,\s*[a-zA-Z0-9_]+)?\)?/);
      currentItemVar = mapMatch ? mapMatch[1] : 'item';
    }
    if (mapStart >= 0) {
      if (code[i] === '(') depth++;
      if (code[i] === ')') {
        depth--;
        if (depth === 0) {
          mapContexts.push({ start: mapStart, end: i, itemVar: currentItemVar });
          mapStart = -1;
          currentItemVar = '';
        }
      }
    }
  }
  
  // Now process the map contexts in reverse order (to avoid messing up indices)
  let result = code;
  for (let i = mapContexts.length - 1; i >= 0; i--) {
    const ctx = mapContexts[i];
    const mapSection = code.slice(ctx.start, ctx.end + 1);
    const itemVar = ctx.itemVar;
    
    // Check if this map context already uses keys - look for specific key property patterns
    if (mapSection.includes('key:') || mapSection.includes('key=') || 
        mapSection.includes('"key":') || mapSection.includes("'key':")) {
      continue; // Already has keys, no need to modify
    }
    
    // Add proper key to map functions - ensure index param is included
    const fixedMapSection = mapSection.replace(
      /\.map\(\s*\(?([a-zA-Z0-9_]+)(?:,\s*([a-zA-Z0-9_]+))?\)?\s*=>\s*/,
      (match, item, index) => {
        // If mapping has the form .map((item) => React.createElement(...))
        // or .map(item => React.createElement(...))
        const newIndex = index || 'idx';
        return `.map((${item}, ${newIndex}) => `;
      }
    );
    
    // Add key properties to React.createElement inside this map context only
    // Make sure to use String() for IDs to avoid object key errors
    const fixedWithKeys = fixedMapSection.replace(
      /React\.createElement\(\s*(['"][^'"]+['"]|[^,]+),\s*(\{[^}]*\}|\{|\}|null)/g,
      (match, component, props) => {
        if (props === 'null' || props === '{' || props === '}') {
          // Replace null props with object containing key
          return `React.createElement(${component}, { key: String(${itemVar}.id || idx) }`;
        } else if (!props.includes('key:') && !props.includes('"key":') && !props.includes("'key':")) {
          // Add key to existing props object 
          // Use a safe string conversion to avoid object-to-string coercion issues
          return `React.createElement(${component}, { key: String(${itemVar}.id || idx), ${props.slice(1)}`;
        }
        return match;
      }
    );
    
    // Replace the map section in the code
    result = result.slice(0, ctx.start) + fixedWithKeys + result.slice(ctx.end + 1);
  }
  
  return result;
}; 