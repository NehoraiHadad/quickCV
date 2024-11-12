import { render, act } from "@testing-library/react";
import { ResumeProvider, useResume } from "@/context/ResumeContext";

// Test component that uses the context
const TestComponent = () => {
  const context = useResume();
  return (
    <div data-testid="test-component">{JSON.stringify(context.resumeData)}</div>
  );
};

describe("ResumeContext", () => {
  it("provides initial resume data", () => {
    const { getByTestId } = render(
      <ResumeProvider>
        <TestComponent />
      </ResumeProvider>
    );

    const component = getByTestId("test-component");
    const contextData = JSON.parse(component.textContent || "{}");

    expect(contextData.personalInfo).toEqual({
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    });
    expect(contextData.workExperience).toEqual([]);
    expect(contextData.education).toEqual([]);
    expect(contextData.skills).toEqual([]);
    expect(contextData.projects).toEqual([]);
    expect(contextData.additionalSections).toEqual([]);
    expect(contextData.colors).toEqual({
      primary: "#3B82F6",
      secondary: "#1F2937",
      accent: "#10B981",
    });
  });

  it("updates personal information", () => {
    const TestUpdater = () => {
      const { updatePersonalInfo, resumeData } = useResume();

      return (
        <div>
          <button
            onClick={() => updatePersonalInfo({ name: "John Doe" })}
            data-testid="update-button"
          >
            Update
          </button>
          <div data-testid="name-display">{resumeData.personalInfo.name}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestUpdater />
      </ResumeProvider>
    );

    act(() => {
      getByTestId("update-button").click();
    });

    expect(getByTestId("name-display").textContent).toBe("John Doe");
  });

  it("manages work experience", () => {
    const TestWorkExperience = () => {
      const {
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        resumeData,
      } = useResume();

      return (
        <div>
          <button
            onClick={() =>
              addWorkExperience({
                company: "Tech Corp",
                position: "Developer",
                startDate: "2020-01",
                endDate: "2023-01",
                description: "Worked on projects",
              })
            }
            data-testid="add-button"
          >
            Add
          </button>
          <div data-testid="experience-count">
            {resumeData.workExperience.length}
          </div>
          {resumeData.workExperience.map((exp) => (
            <div key={exp.id}>
              <span data-testid="company-name">{exp.company}</span>
              <button
                onClick={() =>
                  updateWorkExperience(exp.id, { company: "New Corp" })
                }
                data-testid="update-button"
              >
                Update
              </button>
              <button
                onClick={() => removeWorkExperience(exp.id)}
                data-testid="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };

    const { getByTestId, queryByTestId } = render(
      <ResumeProvider>
        <TestWorkExperience />
      </ResumeProvider>
    );

    // Test adding
    act(() => {
      getByTestId("add-button").click();
    });
    expect(getByTestId("experience-count").textContent).toBe("1");
    expect(getByTestId("company-name").textContent).toBe("Tech Corp");

    // Test updating
    act(() => {
      getByTestId("update-button").click();
    });
    expect(getByTestId("company-name").textContent).toBe("New Corp");

    // Test removing
    act(() => {
      getByTestId("remove-button").click();
    });
    expect(getByTestId("experience-count").textContent).toBe("0");
    expect(queryByTestId("company-name")).toBeNull();
  });

  it("manages skills", () => {
    const TestSkills = () => {
      const { addSkill, removeSkill, resumeData } = useResume();

      return (
        <div>
          <button
            onClick={() => addSkill("JavaScript")}
            data-testid="add-button"
          >
            Add
          </button>
          <div data-testid="skills-list">{resumeData.skills.join(",")}</div>
          <button
            onClick={() => removeSkill("JavaScript")}
            data-testid="remove-button"
          >
            Remove
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestSkills />
      </ResumeProvider>
    );

    // Test adding skill
    act(() => {
      getByTestId("add-button").click();
    });
    expect(getByTestId("skills-list").textContent).toBe("JavaScript");

    // Test removing skill
    act(() => {
      getByTestId("remove-button").click();
    });
    expect(getByTestId("skills-list").textContent).toBe("");
  });

  it("handles save and load functionality", () => {
    const TestSaveLoad = () => {
      const { saveResumeData, loadResumeData, updatePersonalInfo, resumeData } =
        useResume();

      return (
        <div>
          <button
            onClick={() => updatePersonalInfo({ name: "John Doe" })}
            data-testid="update-button"
          >
            Update
          </button>
          <button
            onClick={() => {
              const data = saveResumeData();
              loadResumeData(data);
            }}
            data-testid="save-load-button"
          >
            Save and Load
          </button>
          <div data-testid="name-display">{resumeData.personalInfo.name}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestSaveLoad />
      </ResumeProvider>
    );

    // Update data
    act(() => {
      getByTestId("update-button").click();
    });
    expect(getByTestId("name-display").textContent).toBe("John Doe");

    // Save and load data
    act(() => {
      getByTestId("save-load-button").click();
    });
    expect(getByTestId("name-display").textContent).toBe("John Doe");
  });

  it("throws error when useResume is used outside provider", () => {
    const TestError = () => {
      useResume(); // This should throw
      return null;
    };

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestError />);
    }).toThrow("useResume must be used within a ResumeProvider");

    console.error = originalError;
  });
});

describe("ResumeContext - Additional Tests", () => {
  it("manages education records", () => {
    const TestEducation = () => {
      const { addEducation, updateEducation, removeEducation, resumeData } =
        useResume();

      return (
        <div>
          <button
            onClick={() =>
              addEducation({
                institution: "Test University",
                degree: "BSc",
                fieldOfStudy: "Computer Science",
                startDate: "2018-09",
                endDate: "2022-06",
                description: "Major in Software Engineering",
              })
            }
            data-testid="add-button"
          >
            Add
          </button>
          <div data-testid="education-count">{resumeData.education.length}</div>
          {resumeData.education.map((edu) => (
            <div key={edu.id}>
              <span data-testid="institution-name">{edu.institution}</span>
              <button
                onClick={() =>
                  updateEducation(edu.id, { institution: "New University" })
                }
                data-testid="update-button"
              >
                Update
              </button>
              <button
                onClick={() => removeEducation(edu.id)}
                data-testid="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };

    const { getByTestId, queryByTestId } = render(
      <ResumeProvider>
        <TestEducation />
      </ResumeProvider>
    );

    // Test adding
    act(() => {
      getByTestId("add-button").click();
    });
    expect(getByTestId("education-count").textContent).toBe("1");
    expect(getByTestId("institution-name").textContent).toBe("Test University");

    // Test updating
    act(() => {
      getByTestId("update-button").click();
    });
    expect(getByTestId("institution-name").textContent).toBe("New University");

    // Test removing
    act(() => {
      getByTestId("remove-button").click();
    });
    expect(getByTestId("education-count").textContent).toBe("0");
    expect(queryByTestId("institution-name")).toBeNull();
  });

  it("manages projects", () => {
    const TestProjects = () => {
      const { addProject, updateProject, removeProject, resumeData } =
        useResume();

      return (
        <div>
          <button
            onClick={() =>
              addProject({
                name: "Test Project",
                description: "A test project",
                technologies: "React, TypeScript",
                link: "https://test.com",
                github: "https://github.com/test",
              })
            }
            data-testid="add-button"
          >
            Add
          </button>
          <div data-testid="projects-count">{resumeData.projects.length}</div>
          {resumeData.projects.map((project) => (
            <div key={project.id}>
              <span data-testid="project-name">{project.name}</span>
              <button
                onClick={() =>
                  updateProject(project.id, { name: "Updated Project" })
                }
                data-testid="update-button"
              >
                Update
              </button>
              <button
                onClick={() => removeProject(project.id)}
                data-testid="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };

    const { getByTestId, queryByTestId } = render(
      <ResumeProvider>
        <TestProjects />
      </ResumeProvider>
    );

    // Test adding
    act(() => {
      getByTestId("add-button").click();
    });
    expect(getByTestId("projects-count").textContent).toBe("1");
    expect(getByTestId("project-name").textContent).toBe("Test Project");

    // Test updating
    act(() => {
      getByTestId("update-button").click();
    });
    expect(getByTestId("project-name").textContent).toBe("Updated Project");

    // Test removing
    act(() => {
      getByTestId("remove-button").click();
    });
    expect(getByTestId("projects-count").textContent).toBe("0");
    expect(queryByTestId("project-name")).toBeNull();
  });

  it("manages additional sections", () => {
    const TestAdditionalSections = () => {
      const {
        addAdditionalSection,
        updateAdditionalSection,
        removeAdditionalSection,
        resumeData,
      } = useResume();

      return (
        <div>
          <button
            onClick={() =>
              addAdditionalSection({
                title: "Test Section",
                content: "Test Content",
              })
            }
            data-testid="add-button"
          >
            Add
          </button>
          <div data-testid="sections-count">
            {resumeData.additionalSections.length}
          </div>
          {resumeData.additionalSections.map((section) => (
            <div key={section.id}>
              <span data-testid="section-title">{section.title}</span>
              <button
                onClick={() =>
                  updateAdditionalSection(section.id, {
                    title: "Updated Section",
                  })
                }
                data-testid="update-button"
              >
                Update
              </button>
              <button
                onClick={() => removeAdditionalSection(section.id)}
                data-testid="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };

    const { getByTestId, queryByTestId } = render(
      <ResumeProvider>
        <TestAdditionalSections />
      </ResumeProvider>
    );

    // Test adding
    act(() => {
      getByTestId("add-button").click();
    });
    expect(getByTestId("sections-count").textContent).toBe("1");
    expect(getByTestId("section-title").textContent).toBe("Test Section");

    // Test updating
    act(() => {
      getByTestId("update-button").click();
    });
    expect(getByTestId("section-title").textContent).toBe("Updated Section");

    // Test removing
    act(() => {
      getByTestId("remove-button").click();
    });
    expect(getByTestId("sections-count").textContent).toBe("0");
    expect(queryByTestId("section-title")).toBeNull();
  });

  it("manages template selection", () => {
    const TestTemplateSelection = () => {
      const { selectedTemplate, setSelectedTemplate } = useResume();

      return (
        <div>
          <div data-testid="selected-template">{selectedTemplate}</div>
          <button
            onClick={() => setSelectedTemplate("modern")}
            data-testid="select-button"
          >
            Select Template
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestTemplateSelection />
      </ResumeProvider>
    );

    act(() => {
      getByTestId("select-button").click();
    });
    expect(getByTestId("selected-template").textContent).toBe("modern");
  });

  it("manages color customization", () => {
    const TestColorCustomization = () => {
      const { colors, updateColors } = useResume();

      return (
        <div>
          <div data-testid="primary-color">{colors.primary}</div>
          <button
            onClick={() => updateColors({ primary: "#FF0000" })}
            data-testid="update-color-button"
          >
            Update Color
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestColorCustomization />
      </ResumeProvider>
    );

    act(() => {
      getByTestId("update-color-button").click();
    });
    expect(getByTestId("primary-color").textContent).toBe("#FF0000");
  });
});

describe("ResumeContext - Default Values", () => {
  it("should have correct default colors", () => {
    const TestColors = () => {
      const { colors } = useResume();
      return (
        <div>
          <div data-testid="primary-color">{colors.primary}</div>
          <div data-testid="secondary-color">{colors.secondary}</div>
          <div data-testid="accent-color">{colors.accent}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <ResumeProvider>
        <TestColors />
      </ResumeProvider>
    );

    expect(getByTestId("primary-color").textContent).toBe("#3B82F6");
    expect(getByTestId("secondary-color").textContent).toBe("#1F2937");
    expect(getByTestId("accent-color").textContent).toBe("#10B981");
  });
});

it("manages color customization without affecting other colors", () => {
  const TestColorCustomization = () => {
    const { colors, updateColors } = useResume();

    return (
      <div>
        <div data-testid="primary-color">{colors.primary}</div>
        <div data-testid="secondary-color">{colors.secondary}</div>
        <button
          onClick={() => updateColors({ primary: "#FF0000" })}
          data-testid="update-color-button"
        >
          Update Color
        </button>
      </div>
    );
  };

  const { getByTestId } = render(
    <ResumeProvider>
      <TestColorCustomization />
    </ResumeProvider>
  );

  const originalSecondaryColor = getByTestId("secondary-color").textContent;

  act(() => {
    getByTestId("update-color-button").click();
  });
  
  expect(getByTestId("primary-color").textContent).toBe("#FF0000");
  expect(getByTestId("secondary-color").textContent).toBe(originalSecondaryColor);
});

it("handles complete data save and load", async () => {
  const TestCompleteData = () => {
    const { 
      saveResumeData, 
      loadResumeData, 
      updatePersonalInfo, 
      addWorkExperience,
      addSkill,
      resumeData 
    } = useResume();

    return (
      <div>
        <button
          onClick={() => {
            updatePersonalInfo({ 
              name: "John Doe", 
              email: "john@example.com" 
            });
          }}
          data-testid="update-info-button"
        >
          Update Info
        </button>
        <button
          onClick={() => {
            addWorkExperience({
              company: "Test Company",
              position: "Developer",
              startDate: "2020-01",
              endDate: "2023-01",
              description: "Test description"
            });
          }}
          data-testid="add-experience-button"
        >
          Add Experience
        </button>
        <button
          onClick={() => {
            addSkill("JavaScript");
          }}
          data-testid="add-skill-button"
        >
          Add Skill
        </button>
        <button
          onClick={() => {
            const data = saveResumeData();
            loadResumeData(data);
          }}
          data-testid="save-load-button"
        >
          Save and Load
        </button>
        <div data-testid="name-display">{resumeData.personalInfo.name}</div>
        <div data-testid="email-display">{resumeData.personalInfo.email}</div>
        <div data-testid="work-experience-count">
          {resumeData.workExperience.length}
        </div>
        <div data-testid="skills-list">
          {resumeData.skills.join(',')}
        </div>
      </div>
    );
  };

  const { getByTestId } = render(
    <ResumeProvider>
      <TestCompleteData />
    </ResumeProvider>
  );

  // עדכון מידע אישי
  await act(async () => {
    getByTestId("update-info-button").click();
  });

  // הוספת ניסיון עבודה
  await act(async () => {
    getByTestId("add-experience-button").click();
  });

  // הוספת כישור
  await act(async () => {
    getByTestId("add-skill-button").click();
  });

  // שמירה וטעינה
  await act(async () => {
    getByTestId("save-load-button").click();
  });

  // בדיקת התוצאות
  expect(getByTestId("name-display").textContent).toBe("John Doe");
  expect(getByTestId("email-display").textContent).toBe("john@example.com");
  expect(getByTestId("work-experience-count").textContent).toBe("1");
  expect(getByTestId("skills-list").textContent).toBe("JavaScript");
});
