import React, { useRef, useEffect, useState, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import templates from "@/data/templates";
import { ResumeData } from "@/types/resume";
import { CustomTemplate } from "@/types/templates";
import CustomTemplateCreator from "../ResumeBuilder/CustomTemplateCreator";
import { useCustomTemplates } from "@/hooks/useCustomTemplates";
import { TemplateCard } from "./TemplateCard";

export interface Template {
  id: string;
  name: string;
  render: (
    resumeData: ResumeData,
    colors?: Record<string, string>
  ) => React.ReactElement;
  preview: React.ReactElement;
  isCustom?: boolean;
}

const SCALE_CONSTANTS = {
  MOBILE_BREAKPOINT: "(min-width: 640px)",
  MOBILE_PADDING: 32,
  DESKTOP_GAP: 24,
  MOBILE_SCALE_FACTOR: 0.263,
  DESKTOP_SCALE_FACTOR: 0.275,
  MIN_SCALE: 0.1,
  MAX_SCALE: 1,
  HEIGHT_FACTOR: 0.8,
  A4_WIDTH: 210,
  A4_HEIGHT: 297,
} as const;

const TemplateGallery: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const {
    customTemplates,
    saveTemplate,
    deleteTemplate,
    getTemplateForEditing,
    loadTemplatesFromStorage,
  } = useCustomTemplates();

  const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(() =>
      typeof window !== "undefined" ? window.matchMedia(query).matches : false
    );

    useEffect(() => {
      if (typeof window === "undefined") return;

      const mediaQuery = window.matchMedia(query);
      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }, [query]);

    return matches;
  };

  const isDesktop = useMediaQuery(SCALE_CONSTANTS.MOBILE_BREAKPOINT);

  const calculateCardWidth = useCallback(
    (containerWidth: number) => {
      if (!isDesktop) {
        return containerWidth - SCALE_CONSTANTS.MOBILE_PADDING;
      }
      return containerWidth / 2 - SCALE_CONSTANTS.DESKTOP_GAP;
    },
    [isDesktop]
  );

  const calculateScale = useCallback(
    (cardWidth: number, containerHeight: number) => {
      const widthScale =
        (!isDesktop
          ? SCALE_CONSTANTS.MOBILE_SCALE_FACTOR
          : SCALE_CONSTANTS.DESKTOP_SCALE_FACTOR) *
        (cardWidth / SCALE_CONSTANTS.A4_WIDTH);

      const heightScale =
        SCALE_CONSTANTS.HEIGHT_FACTOR *
        (containerHeight / SCALE_CONSTANTS.A4_HEIGHT);

      const newScale = Math.min(widthScale, heightScale);
      return Math.max(
        SCALE_CONSTANTS.MIN_SCALE,
        Math.min(newScale, SCALE_CONSTANTS.MAX_SCALE)
      );
    },
    [isDesktop]
  );

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = window.innerHeight;

      const cardWidth = calculateCardWidth(containerWidth);
      const newScale = calculateScale(cardWidth, containerHeight);

      setScale(newScale);
    }
  }, [calculateCardWidth, calculateScale]);

  useEffect(() => {
    loadTemplatesFromStorage();
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver.disconnect();
    };
  }, [updateScale]);

  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      if (templateId.startsWith("custom-")) {
        await loadTemplatesFromStorage();
      }
      setSelectedTemplate(templateId);
    },
    [loadTemplatesFromStorage, setSelectedTemplate]
  );

  const handleEditTemplate = useCallback(
    (templateId: string) => {
      const templateToEdit = getTemplateForEditing(templateId);
      if (templateToEdit) {
        setEditingTemplate(templateToEdit);
        setIsCreatorOpen(true);
      }
    },
    [getTemplateForEditing]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsCreatorOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Custom Template
        </button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 sm:px-0"
        ref={containerRef}
      >
        {[...templates, ...customTemplates].map((template) => (
          <div key={template.id}>
            <TemplateCard
              template={template}
              isSelected={selectedTemplate === template.id}
              scale={scale}
              onSelect={handleTemplateSelect}
              onEdit={handleEditTemplate}
              onDelete={deleteTemplate}
            />
          </div>
        ))}
      </div>

      <CustomTemplateCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setEditingTemplate(null);
        }}
        onTemplateCreate={saveTemplate}
        editingTemplate={editingTemplate}
      />
    </div>
  );
};

export default TemplateGallery;
