import React from "react";
import { Template } from "@/components/TemplateSelection/TemplateGallery";
import { ResumeData } from "@/types/resume";
import DefaultTemplate from "@/components/Templates/DefaultTemplate";
import ModernTemplate from "@/components/Templates/ModernTemplate";
import CleanCardTemplate from "@/components/Templates/CleanCardTemplate";

const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "John Doe",
    title: "Developer",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "New York, NY",
    summary: "Experienced software developer with a passion for creating innovative solutions."
  },
  workExperience: [
    {
      id: "1",
      company: "Tech Co",
      position: "Senior Developer",
      startDate: "2018-01",
      endDate: "Present",
      description: "Leading development of web applications using React and Node.js."
    },
    {
      id: "2",
      company: "Tech Co",
      position: "Senior Developer",
      startDate: "2018-01",
      endDate: "Present",
      description: "Leading development of web applications using React and Node.js."
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "Focused on software engineering and data structures."
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Developed a scalable e-commerce platform using React, Node.js, and MongoDB.",
      technologies: "React, Node.js, MongoDB, AWS",
      link: "https://github.com/johndoe/ecommerce-platform"
    },
    {
      id: "2",
      name: "AI Chatbot",
      description: "Created an AI-powered chatbot for customer service using Python and TensorFlow.",
      technologies: "Python, TensorFlow, NLP, Docker",
      link: "https://github.com/johndoe/ai-chatbot"
    }
  ],
  additionalSections: [
    {
      id: "1",
      title: "Certifications",
      content: "AWS Certified Solutions Architect, Certified Scrum Master"
    },
    {
      id: "2",
      title: "Languages",
      content: "English (Native), Spanish (Fluent), French (Basic)"
    }
  ], 
  colors: {
    primary: "#000000",
    secondary: "#144790",
    accent: "#6175db"
  }
};

const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    render: (resumeData: ResumeData) =>
      // React.createElement(DefaultTemplate, { resumeData: sampleResumeData }),
      React.createElement(DefaultTemplate, { resumeData }),
    preview: React.createElement(DefaultTemplate, { resumeData: sampleResumeData }),
  },
  {
    id: "modern",
    name: "Modern",
    render: (resumeData: ResumeData) =>
      // React.createElement(ModernTemplate, { resumeData: sampleResumeData }),
      React.createElement(ModernTemplate, { resumeData }),
    preview: React.createElement(ModernTemplate, { resumeData: sampleResumeData }),
  },
  {
    id: "CleanCard",
    name: "CleanCard",
    render: (resumeData: ResumeData) =>
      // React.createElement(CleanCardTemplate, { resumeData: sampleResumeData }),
      React.createElement(CleanCardTemplate, { resumeData }),
    preview: React.createElement(CleanCardTemplate, { resumeData: sampleResumeData }),
  },
];

export default templates;
