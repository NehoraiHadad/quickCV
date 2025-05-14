import React from 'react';
import Button from './Button';

interface SectionActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  addLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  moveUpLabel?: string;
  moveDownLabel?: string;
  showAdd?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showMove?: boolean;
  className?: string;
}

const SectionActions: React.FC<SectionActionsProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  addLabel = 'Add',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  moveUpLabel = 'Move Up',
  moveDownLabel = 'Move Down',
  showAdd = true,
  showEdit = true,
  showDelete = true,
  showMove = false,
  className = '',
}) => {
  return (
    <div className={`flex space-x-2 items-center ${className}`}>
      {showAdd && onAdd && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          {addLabel}
        </Button>
      )}

      {showEdit && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
        >
          {editLabel}
        </Button>
      )}

      {showDelete && onDelete && (
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        >
          {deleteLabel}
        </Button>
      )}

      {showMove && (
        <div className="flex space-x-1">
          {onMoveUp && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveUp}
              aria-label={moveUpLabel}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              }
            >
              <span className="sr-only">{moveUpLabel}</span>
            </Button>
          )}

          {onMoveDown && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveDown}
              aria-label={moveDownLabel}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              }
            >
              <span className="sr-only">{moveDownLabel}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionActions; 