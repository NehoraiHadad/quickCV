import React from 'react';
import ContentOptimization from "./ContentOptimization";
import ContentSuggestions from "./ContentSuggestions";
import GrammarCheck from "./GrammarCheck";
import useAIApi from "@/hooks/useAIApi";
import styles from "./TextImprovement.module.css";

interface TextImprovementProps {
  initialText: string;
  field: string;
  onImprove: (improvedText: string) => void;
}

const TextImprovement: React.FC<TextImprovementProps> = ({
  initialText,
  field,
  onImprove,
}) => {
  const { apiKey } = useAIApi();

  if (!apiKey) {
    return null;
  }
  
  return (
    <div className="relative group" data-testid="text-improvement">
      <div className={`cursor-pointer text-purple-600 hover:text-purple-800 transition-colors duration-300 ${styles.starContainer}`}>
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 1266.000000 1324.000000"
          preserveAspectRatio="xMidYMid meet"
          fill="currentColor"
          className="w-6 h-6"
        >
          <g
            transform="translate(0.000000,1524.000000) scale(0.100000,-0.100000)"
            stroke="none"
          >
            <path
              className={styles.star1}
              d="M8266 14479 c-9 -30 -20 -76 -25 -104 -12 -61 -38 -162 -45 -174 -3 -5 -58 -28 -121 -51 -63 -24 -115 -49 -115 -55 0 -19 17 -29 123 -72 144 -59 142 -56 172 -201 27 -135 30 -142 50 -142 16 0 16 0 50 153 39 178 29 165 155 212 25 9 65 26 89 37 56 25 50 31 -89 88 -58 24 -114 52 -126 64 -15 15 -29 57 -48 146 -14 68 -32 131 -40 139 -13 12 -17 7 -30 -40z"
            />
            <path
              className={styles.star2}
              d="M7156 13418 c-8 -18 -41 -94 -75 -168 -65 -145 -75 -157 -236 -294 -76 -64 -105 -94 -105 -106 0 -5 63 -60 140 -124 l139 -117 83 -167 c52 -105 89 -167 98 -167 15 0 77 115 141 263 30 69 41 81 163 190 72 63 135 122 139 129 11 18 -3 34 -92 105 -175 140 -166 129 -259 315 -92 186 -109 203 -136 141z"
            />
            <path
              className={styles.star3}
              d="M8755 12553 c-4 -16 -12 -55 -19 -88 -8 -33 -24 -114 -37 -180 -19 -97 -28 -125 -48 -145 -15 -14 -93 -54 -174 -89 -109 -47 -147 -68 -145 -80 2 -10 46 -31 123 -59 163 -59 195 -73 205 -91 6 -13 76 -289 95 -376 6 -28 32 -61 41 -53 4 4 10 27 14 50 18 110 73 364 82 375 11 13 76 45 230 112 115 51 132 75 63 93 -63 17 -263 93 -277 105 -10 9 -32 82 -58 191 -61 255 -81 304 -95 235z"
            />
            <path d="M5675 11150 c-366 -15 -947 -59 -1170 -90 -298 -41 -533 -78 -665 -105 -36 -7 -101 -20 -145 -29 -44 -9 -116 -23 -160 -32 -191 -37 -653 -164 -765 -209 -19 -7 -78 -30 -130 -50 -195 -75 -228 -89 -350 -150 -586 -292 -801 -616 -636 -959 66 -136 196 -270 381 -392 109 -72 368 -202 516 -259 109 -42 164 -63 199 -77 58 -23 280 -93 360 -115 435 -116 781 -184 1255 -247 632 -85 1123 -116 1840 -116 796 0 1276 34 2055 146 149 21 285 43 360 59 36 7 135 28 220 46 85 17 198 43 250 57 52 13 113 28 135 34 105 24 398 117 515 163 19 8 78 30 130 51 159 61 399 183 519 263 135 89 289 236 344 328 43 71 74 154 83 222 8 61 -19 187 -57 264 -124 253 -448 476 -1004 690 -254 98 -590 194 -885 253 -82 16 -176 35 -285 58 -80 16 -213 39 -365 61 -116 17 -282 41 -375 55 -33 5 -127 14 -210 20 -82 6 -197 15 -255 20 -465 43 -1191 60 -1705 40z m1210 -599 c500 -22 826 -54 1255 -122 256 -41 350 -63 585 -141 158 -52 272 -102 319 -139 35 -28 86 -106 86 -133 0 -68 -116 -168 -256 -220 -171 -63 -226 -80 -354 -110 -170 -40 -382 -82 -460 -91 -30 -3 -95 -12 -145 -20 -148 -23 -605 -65 -950 -87 -268 -17 -1230 -17 -1515 0 -334 20 -810 64 -950 87 -47 8 -112 17 -145 20 -107 11 -486 91 -615 131 -377 116 -518 242 -417 376 25 33 54 54 134 94 106 53 299 121 438 155 44 11 94 24 110 29 42 13 366 68 510 85 406 51 655 71 1070 85 154 6 289 12 300 15 31 6 774 -4 1000 -14z" />{" "}
            <path d="M3402 8293 c-5 -10 -12 -162 -16 -338 -9 -462 -51 -987 -117 -1475 -22 -168 -106 -678 -119 -730 -5 -19 -16 -71 -24 -115 -53 -269 -103 -491 -126 -565 -49 -152 -50 -262 -3 -379 55 -138 190 -285 373 -406 225 -150 436 -242 855 -375 139 -44 393 -99 645 -139 494 -79 638 -91 1180 -98 452 -6 714 3 990 32 376 40 814 117 1055 187 39 11 84 23 100 28 47 13 201 65 295 99 400 148 694 341 844 555 108 155 128 297 67 485 -10 31 -26 88 -35 126 -9 39 -21 87 -27 107 -9 37 -92 448 -109 543 -27 150 -52 298 -60 355 -5 36 -18 124 -29 195 -68 453 -114 986 -132 1550 -6 193 -13 353 -16 358 -7 11 -45 8 -94 -7 -24 -7 -70 -21 -101 -30 -38 -11 -62 -25 -69 -39 -9 -16 -11 -150 -6 -527 10 -729 31 -1173 68 -1409 6 -35 14 -107 19 -160 17 -182 93 -653 146 -906 14 -66 29 -143 34 -172 5 -29 15 -62 22 -75 8 -15 13 -60 13 -123 0 -94 -2 -104 -34 -169 -54 -110 -181 -234 -327 -322 -140 -83 -261 -141 -271 -130 -4 4 31 44 77 89 47 45 100 104 117 131 112 170 107 276 -63 1146 -24 124 -51 263 -59 310 -9 47 -22 119 -30 160 -59 307 -81 684 -93 1575 l-7 510 -50 0 c-77 -1 -208 -27 -222 -44 -23 -27 -10 -1288 16 -1606 23 -273 88 -786 126 -995 9 -47 25 -134 35 -195 10 -60 32 -177 49 -260 21 -111 26 -152 18 -157 -16 -10 -99 -10 -114 0 -6 4 -21 55 -33 112 -12 58 -25 123 -30 145 -4 22 -15 76 -24 120 -8 44 -20 106 -26 138 -13 67 -18 98 -59 382 -16 116 -35 255 -41 310 -6 55 -15 134 -20 175 -28 233 -42 575 -49 1225 l-6 590 -55 -1 c-30 0 -140 -10 -245 -22 -104 -12 -248 -27 -320 -32 -71 -6 -187 -15 -256 -20 -405 -32 -1246 -29 -1699 5 -449 34 -877 82 -1080 121 -343 65 -447 86 -530 105 -52 11 -106 23 -120 26 -14 3 -45 11 -70 18 -86 26 -118 27 -128 8z" />{" "}
          </g>
        </svg>
      </div>
      <div className="absolute z-10 right-8 top-0 flex flex-col space-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
        <div className="relative flex items-center">
          <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs rounded py-1 px-2 transition-all duration-300 whitespace-nowrap">
            Suggest Content
          </span>
          <ContentSuggestions
            initialText={initialText}
            field={field}
            onSuggest={onImprove}
          />
        </div>
        <div className="relative flex items-center">
          <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs rounded py-1 px-2 duration-300 whitespace-nowrap">
            Optimize Content
          </span>
          <ContentOptimization
            initialText={initialText}
            field={field}
            onOptimize={onImprove}
          />
        </div>
        <div className="relative flex items-center">
          <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs rounded py-1 px-2 duration-300 whitespace-nowrap">
            Check Grammar
          </span>
          <GrammarCheck
            initialText={initialText}
            field={field}
            onCorrect={onImprove}
          />
        </div>
      </div>
    </div>
  );
};

export default TextImprovement;
