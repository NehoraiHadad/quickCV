import React from "react";
import { Template } from "@/components/TemplateSelection/TemplateGallery";
import { ResumeData } from "@/types/resume";
import DefaultTemplate, { getSections as getDefaultSections } from "@/components/Templates/DefaultTemplate";
import { getTemplateColors as getDefaultTemplateColors } from "@/components/Templates/DefaultTemplate/styles";
import ModernTemplate from "@/components/Templates/ModernTemplate";
import CleanCardTemplate from "@/components/Templates/CleanCardTemplate";
import MinimalTemplate from "@/components/Templates/MinimalTemplate";
import { CustomTemplate } from "@/types/templates";

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    title: "Developer",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "New York, NY",
    summary:
      "Experienced software developer with a passion for creating innovative solutions.",
  },
  workExperience: [
    {
      id: "1",
      company: "Tech Co",
      position: "Senior Developer",
      startDate: "2018-01",
      endDate: "Present",
      description:
        "Leading development of web applications using React and Node.js.",
    },
    {
      id: "2",
      company: "Tech Co",
      position: "Senior Developer",
      startDate: "2018-01",
      endDate: "Present",
      description:
        "Leading development of web applications using React and Node.js.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "Focused on software engineering and data structures.",
    },
  ],
  skills: [
    { id: "skill-1", name: "JavaScript" },
    { id: "skill-2", name: "React" },
    { id: "skill-3", name: "Node.js" },
    { id: "skill-4", name: "Python" },
    { id: "skill-5", name: "AWS" },
    { id: "skill-6", name: "Docker" }
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Developed a scalable e-commerce platform using React, Node.js, and MongoDB.",
      technologies: "React, Node.js, MongoDB, AWS",
      link: "https://example.com/ecommerce-platform",
      github: "https://github.com/johndoe/ecommerce-platform",
    },
    {
      id: "2",
      name: "AI Chatbot",
      description:
        "Created an AI-powered chatbot for customer service using Python and TensorFlow.",
      technologies: "Python, TensorFlow, NLP, Docker",
      link: "https://example.com/ai-chatbot",
      github: "https://github.com/johndoe/ai-chatbot",
    },
  ],
  additionalSections: [
    {
      id: "1",
      title: "Certifications",
      content: "AWS Certified Solutions Architect, Certified Scrum Master",
    },
    {
      id: "2",
      title: "Languages",
      content: "English (Native), Spanish (Fluent), French (Basic)",
    },
  ],
  colors: {
    primary: "#000000",
    secondary: "#144790",
    accent: "#6175db",
  },
  selectedTemplate: "default"
};

const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    render: (resumeData: ResumeData) =>
      React.createElement(DefaultTemplate, { resumeData }),
    preview: React.createElement(DefaultTemplate, {
      resumeData: sampleResumeData,
    }),
    // Add new properties for DefaultTemplate
    getSections: getDefaultSections,
    getTemplateColors: getDefaultTemplateColors,
    defaultLayouts: { // Moved from TemplateDisplay.tsx
      lg: [
        { i: 'header', x: 0, y: 0, w: 12, h: 2, static: true },
        { i: 'experience', x: 0, y: 2, w: 8, h: 4 },
        { i: 'education', x: 8, y: 2, w: 4, h: 4 },
        { i: 'skills', x: 0, y: 6, w: 12, h: 2 },
        { i: 'projects', x: 0, y: 8, w: 12, h: 3 },
        { i: 'additional', x: 0, y: 11, w: 12, h: 2 },
      ],
      md: [ 
        { i: 'header', x: 0, y: 0, w: 10, h: 2, static: true },
        { i: 'experience', x: 0, y: 2, w: 6, h: 4 },
        { i: 'education', x: 6, y: 2, w: 4, h: 4 },
        { i: 'skills', x: 0, y: 6, w: 10, h: 2 },
        { i: 'projects', x: 0, y: 8, w: 10, h: 3 },
        { i: 'additional', x: 0, y: 11, w: 10, h: 2 },
      ]
    },
  },
  {
    id: "modern",
    name: "Modern",
    render: (resumeData: ResumeData) =>
      React.createElement(ModernTemplate, { resumeData }),
    preview: React.createElement(ModernTemplate, {
      resumeData: sampleResumeData,
    }),
  },
  {
    id: "CleanCard",
    name: "CleanCard",
    render: (resumeData: ResumeData) =>
      React.createElement(CleanCardTemplate, { resumeData }),
    preview: React.createElement(CleanCardTemplate, {
      resumeData: sampleResumeData,
    }),
  },
  {
    id: "minimal",
    name: "Minimal",
    render: (resumeData: ResumeData) =>
      React.createElement(MinimalTemplate, { resumeData }),
    preview: React.createElement(MinimalTemplate, {
      resumeData: sampleResumeData,
    }),
  },
];

export const createCustomTemplateObject = (
  customTemplate: CustomTemplate
): Template => {
  console.log("Creating template object for:", customTemplate.id);

  const template = {
    id: customTemplate.id,
    name: customTemplate.name,
    render: (resumeData: ResumeData) => {
      try {
        console.log("Rendering template:", customTemplate.id);
        const templateFunction = new Function(
          "React",
          "resumeData",
          "templateColors",
          `
          const { personalInfo, workExperience, education, skills, projects, additionalSections } = resumeData;
          try {
            with (React) {
              ${
                customTemplate.code.trim().startsWith("return")
                  ? customTemplate.code
                  : `return (${customTemplate.code})`
              }
            }
          } catch (error) {
            console.error("Template execution error:", error);
            throw error;
          }
          `
        );

        return templateFunction(React, resumeData, resumeData.colors || {});
      } catch (err: unknown) {
        console.error("Error rendering custom template:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Unknown error";

        return React.createElement(
          "div",
          {
            className: "p-4 text-red-500 border border-red-300 rounded",
          },
          "Render Error: " + errorMessage
        );
      }
    },
    preview: (() => {
      try {
        const templateFunction = new Function(
          "React",
          "resumeData",
          "templateColors",
          `
          const { personalInfo, workExperience, education, skills, projects, additionalSections } = resumeData;
          try {
            with (React) {
              ${
                customTemplate.code.trim().startsWith("return")
                  ? customTemplate.code
                  : `return (${customTemplate.code})`
              }
            }
          } catch (error) {
            console.error("Template execution error:", error);
            throw error;
          }
          `
        );

        return templateFunction(
          React,
          sampleResumeData,
          sampleResumeData.colors || {}
        );
      } catch (err: unknown) {
        console.error("Error rendering custom template preview:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Unknown error";

        return React.createElement(
          "div",
          {
            className: "p-4 text-red-500 border border-red-300 rounded",
          },
          "Preview Error: " + errorMessage
        );
      }
    })(),
  };

  console.log("Created template object:", template.id);
  return template;
};

export default templates;
