import { ResumeData } from "@/types/resume";

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  additionalSections: [],
  colors: {
    primary: "#3B82F6",
    secondary: "#1F2937",
    accent: "#10B981",
  },
  selectedTemplate: "",
  layouts: {}, // Added this line
};
