import React from 'react';

interface DraggableHandleProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  // Add other props as needed, e.g., custom styling, orientation
}

const DraggableHandle: React.FC<DraggableHandleProps> = ({ onMouseDown }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        width: '100%',
        height: '10px', // Height of the draggable area
        cursor: 'ns-resize', // North-south resize cursor
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Semi-transparent blue, for visibility
        position: 'absolute', // Will be positioned relative to the section
        bottom: '-5px', // Positioned at the bottom edge of the section
        left: 0,
        zIndex: 50, // Ensure it's above other content
      }}
      className="draggable-handle" // For potential global styling or identification
    >
      {/* Optionally, add an icon or visual indicator within the handle */}
    </div>
  );
};

export default DraggableHandle;
