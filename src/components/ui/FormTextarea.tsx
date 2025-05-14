import React from 'react';

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  helpText?: string;
  maxLength?: number;
  rightIcon?: React.ReactNode;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  helpText,
  maxLength,
  rightIcon,
}) => {
  const textareaBaseClasses = 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1';
  const textareaStateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  const charCount = value.length;
  const showCharCount = maxLength !== undefined;
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between">
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {showCharCount && (
          <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
          className={`
            ${textareaBaseClasses}
            ${textareaStateClasses}
            ${disabledClasses}
            ${rightIcon ? 'pr-10' : ''}
            ${textareaClassName}
          `}
        />
        
        {rightIcon && (
          <div className="absolute top-2 right-2">
            {rightIcon}
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p id={`${id}-description`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormTextarea; 