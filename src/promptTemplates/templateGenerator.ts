/**
 * Template for resume template generation prompts.
 * Uses placeholders in {{variableName}} format for easy replacement.
 */
export const templatePromptTemplate = `CRITICAL RESPONSE FORMAT:
1. Return ONLY pure React.createElement code
2. NO imports, NO exports, NO comments
3. NO markdown code blocks or backticks
4. Start directly with React.createElement
5. End with closing parenthesis
6. NO trailing characters or newlines
7. NO explanations or additional text

Create a professional, modern resume template that perfectly matches this user's vision:

PRIMARY USER REQUEST:
"{{freeformDescription}}"
This is the most important requirement - the template must closely follow this vision while maintaining professional standards.

INTERPRETATION OF USER'S VISION:
Let's implement this vision using:
- Layout: {{layout}} - organized to emphasize the user's preferred content flow
- Visual Style: {{useIcons}} - with icons: Modern with professional icons design approach
- Emphasis: Highlighting key information through {{headerSize}} headers and {{spacing}} spacing
- Visual Structure: {{useDividers}} - with dividers: Using subtle dividers to organize content as requested

DETAILED STYLE IMPLEMENTATION:
1. Header Design (Following user preference):
   - Position: {{headerPosition}}
   - Alignment: {{headerAlignment}}
   - Size: {{headerSize}}

2. Color Palette (As specified):
   - Primary ({{primaryColor}}): For main headers and emphasis
   - Secondary ({{secondaryColor}}): For subheaders and job titles
   - Accent ({{accentColor}}): For interactive elements and highlights
   - Background ({{backgroundColor}}): Base color

3. Content Organization:
   - Following user's preferred order: {{sectionOrder}}
   - Using {{spacing}} spacing for optimal readability
   - Maintaining clear visual hierarchy

4. Custom Elements:
   - Dividers: {{dividerStyle}}
   - Icons: {{iconSet}}
   - Borders: {{customBorders}}

{{customCSS}}

ENHANCED DESIGN FEATURES (aligned with user's vision):
1. Layout Implementation:
   - Primary Layout Strategy: {{gridInstructions}}
   - General approach: Ensure content hierarchy matches user's preferences, using Flexbox/Grid as appropriate for structure within the A4 page.
   - Aim for smooth transitions between sections.

2. Professional Details:
   - Interactive elements with subtle hover effects
   - Typography scaling for readability
   - Strategic use of whitespace
   - Refined visual elements

3. Visual Enhancements:
   - Subtle patterns/gradients where appropriate
   - Professional iconography
   - Elegant section transitions
   - Emphasis on key content areas

CRITICAL TECHNICAL REQUIREMENTS:
1. React.createElement syntax only
2. Strict type safety for all data
3. Proper color system usage via templateColors
4. Array handling with length checks
5. Key props for mapped elements
6. Direct variable access (no resumeData prefix)
7. Proper styling for all interactive elements

The final template must prioritize the user's specific requests while maintaining professional standards and technical requirements. Focus on creating a unique design that matches the user's vision exactly.

FINAL RESPONSE CHECKLIST:
- Starts with React.createElement
- Contains only React.createElement code
- No imports or exports
- No comments or explanations
- No markdown formatting
- Ends with closing parenthesis
- No trailing characters`;
