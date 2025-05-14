import React from "react";
import { SectionProps } from "./types";

const Experience: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { workExperience } = resumeData;

  if (workExperience.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: templateColors.primary }}
      >
        Work Experience
      </h2>
      {workExperience.map((job) => (
        <div
          key={job.id}
          className="mb-6 p-4 rounded-lg shadow-sm"
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          <h3
            className="font-semibold text-lg"
            style={{ color: templateColors.primary }}
          >
            {job.position}
          </h3>
          <p
            className="font-medium"
            style={{ color: templateColors.secondary }}
          >
            {job.company}
          </p>
          <p
            className="text-sm mb-2"
            style={{ color: templateColors.secondary }}
          >
            {job.startDate} - {job.endDate}
          </p>
          <p>{job.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Experience; 