import React from 'react';

interface FormDatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  helpText?: string;
  min?: string;
  max?: string;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
  min,
  max,
}) => {
  const inputBaseClasses = 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1';
  const inputStateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
        className={`
          ${inputBaseClasses}
          ${inputStateClasses}
          ${disabledClasses}
          ${inputClassName}
        `}
      />
      
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

export default FormDatePicker; 