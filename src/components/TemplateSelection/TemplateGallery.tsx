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
  }, [loadTemplatesFromStorage]);

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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 relative group"
        >
          <div className="flex items-center gap-2">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 1266.000000 1324.000000"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
              className="w-6 h-6 text-white hover:text-purple-800 transition-colors duration-300 cursor-pointer"
            >
              <g
              
                transform="translate(0.000000,1524.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path
                  className="star-1"
                  d="M8266 14479 c-9 -30 -20 -76 -25 -104 -12 -61 -38 -162 -45 -174 -3 -5 -58 -28 -121 -51 -63 -24 -115 -49 -115 -55 0 -19 17 -29 123 -72 144 -59 142 -56 172 -201 27 -135 30 -142 50 -142 16 0 16 0 50 153 39 178 29 165 155 212 25 9 65 26 89 37 56 25 50 31 -89 88 -58 24 -114 52 -126 64 -15 15 -29 57 -48 146 -14 68 -32 131 -40 139 -13 12 -17 7 -30 -40z"
                />
                <path
                  className="star-2"
                  d="M7156 13418 c-8 -18 -41 -94 -75 -168 -65 -145 -75 -157 -236 -294 -76 -64 -105 -94 -105 -106 0 -5 63 -60 140 -124 l139 -117 83 -167 c52 -105 89 -167 98 -167 15 0 77 115 141 263 30 69 41 81 163 190 72 63 135 122 139 129 11 18 -3 34 -92 105 -175 140 -166 129 -259 315 -92 186 -109 203 -136 141z"
                />
                <path
                  className="star-3"
                  d="M8755 12553 c-4 -16 -12 -55 -19 -88 -8 -33 -24 -114 -37 -180 -19 -97 -28 -125 -48 -145 -15 -14 -93 -54 -174 -89 -109 -47 -147 -68 -145 -80 2 -10 46 -31 123 -59 163 -59 195 -73 205 -91 6 -13 76 -289 95 -376 6 -28 32 -61 41 -53 4 4 10 27 14 50 18 110 73 364 82 375 11 13 76 45 230 112 115 51 132 75 63 93 -63 17 -263 93 -277 105 -10 9 -32 82 -58 191 -61 255 -81 304 -95 235z"
                />
                <path d="M5675 11150 c-366 -15 -947 -59 -1170 -90 -298 -41 -533 -78 -665 -105 -36 -7 -101 -20 -145 -29 -44 -9 -116 -23 -160 -32 -191 -37 -653 -164 -765 -209 -19 -7 -78 -30 -130 -50 -195 -75 -228 -89 -350 -150 -586 -292 -801 -616 -636 -959 66 -136 196 -270 381 -392 109 -72 368 -202 516 -259 109 -42 164 -63 199 -77 58 -23 280 -93 360 -115 435 -116 781 -184 1255 -247 632 -85 1123 -116 1840 -116 796 0 1276 34 2055 146 149 21 285 43 360 59 36 7 135 28 220 46 85 17 198 43 250 57 52 13 113 28 135 34 105 24 398 117 515 163 19 8 78 30 130 51 159 61 399 183 519 263 135 89 289 236 344 328 43 71 74 154 83 222 8 61 -19 187 -57 264 -124 253 -448 476 -1004 690 -254 98 -590 194 -885 253 -82 16 -176 35 -285 58 -80 16 -213 39 -365 61 -116 17 -282 41 -375 55 -33 5 -127 14 -210 20 -82 6 -197 15 -255 20 -465 43 -1191 60 -1705 40z m1210 -599 c500 -22 826 -54 1255 -122 256 -41 350 -63 585 -141 158 -52 272 -102 319 -139 35 -28 86 -106 86 -133 0 -68 -116 -168 -256 -220 -171 -63 -226 -80 -354 -110 -170 -40 -382 -82 -460 -91 -30 -3 -95 -12 -145 -20 -148 -23 -605 -65 -950 -87 -268 -17 -1230 -17 -1515 0 -334 20 -810 64 -950 87 -47 8 -112 17 -145 20 -107 11 -486 91 -615 131 -377 116 -518 242 -417 376 25 33 54 54 134 94 106 53 299 121 438 155 44 11 94 24 110 29 42 13 366 68 510 85 406 51 655 71 1070 85 154 6 289 12 300 15 31 6 774 -4 1000 -14z" />{" "}
                <path d="M3402 8293 c-5 -10 -12 -162 -16 -338 -9 -462 -51 -987 -117 -1475 -22 -168 -106 -678 -119 -730 -5 -19 -16 -71 -24 -115 -53 -269 -103 -491 -126 -565 -49 -152 -50 -262 -3 -379 55 -138 190 -285 373 -406 225 -150 436 -242 855 -375 139 -44 393 -99 645 -139 494 -79 638 -91 1180 -98 452 -6 714 3 990 32 376 40 814 117 1055 187 39 11 84 23 100 28 47 13 201 65 295 99 400 148 694 341 844 555 108 155 128 297 67 485 -10 31 -26 88 -35 126 -9 39 -21 87 -27 107 -9 37 -92 448 -109 543 -27 150 -52 298 -60 355 -5 36 -18 124 -29 195 -68 453 -114 986 -132 1550 -6 193 -13 353 -16 358 -7 11 -45 8 -94 -7 -24 -7 -70 -21 -101 -30 -38 -11 -62 -25 -69 -39 -9 -16 -11 -150 -6 -527 10 -729 31 -1173 68 -1409 6 -35 14 -107 19 -160 17 -182 93 -653 146 -906 14 -66 29 -143 34 -172 5 -29 15 -62 22 -75 8 -15 13 -60 13 -123 0 -94 -2 -104 -34 -169 -54 -110 -181 -234 -327 -322 -140 -83 -261 -141 -271 -130 -4 4 31 44 77 89 47 45 100 104 117 131 112 170 107 276 -63 1146 -24 124 -51 263 -59 310 -9 47 -22 119 -30 160 -59 307 -81 684 -93 1575 l-7 510 -50 0 c-77 -1 -208 -27 -222 -44 -23 -27 -10 -1288 16 -1606 23 -273 88 -786 126 -995 9 -47 25 -134 35 -195 10 -60 32 -177 49 -260 21 -111 26 -152 18 -157 -16 -10 -99 -10 -114 0 -6 4 -21 55 -33 112 -12 58 -25 123 -30 145 -4 22 -15 76 -24 120 -8 44 -20 106 -26 138 -13 67 -18 98 -59 382 -16 116 -35 255 -41 310 -6 55 -15 134 -20 175 -28 233 -42 575 -49 1225 l-6 590 -55 -1 c-30 0 -140 -10 -245 -22 -104 -12 -248 -27 -320 -32 -71 -6 -187 -15 -256 -20 -405 -32 -1246 -29 -1699 5 -449 34 -877 82 -1080 121 -343 65 -447 86 -530 105 -52 11 -106 23 -120 26 -14 3 -45 11 -70 18 -86 26 -118 27 -128 8z" />{" "}
              </g>{" "}
            </svg>
            Create Template
          </div>
          <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-full text-black">
            ALPHA
          </span>
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
