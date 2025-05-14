import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { FormValue } from '../types/validation';

// Types for validation rules
type Validator<T> = (value: unknown, formData?: T) => boolean;

type ValidationRule<T> = {
  validator: Validator<T>;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

// Types for form state and actions
type FormErrors<T> = {
  [K in keyof T]?: string;
};

type TouchedFields<T> = {
  [K in keyof T]?: boolean;
};

interface FormActions<T> {
  setValues: (values: Partial<T>, shouldValidate?: boolean) => void;
  resetForm: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K], shouldValidate?: boolean) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  setFieldTouched: <K extends keyof T>(field: K, isTouched?: boolean, shouldValidate?: boolean) => void;
  setTouched: (touched: TouchedFields<T>, shouldValidate?: boolean) => void;
  setErrors: (errors: FormErrors<T>) => void;
  validateForm: () => Promise<FormErrors<T>>;
  validateField: <K extends keyof T>(field: K) => Promise<string | undefined>;
}

interface UseFormProps<T> {
  initialValues: T;
  onSubmit?: (values: T, actions: FormActions<T>) => void | Promise<void>;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Custom hook for form state management with validation
 */
function useForm<T extends Record<string, FormValue>>({
  initialValues,
  onSubmit,
  validationRules = {} as ValidationRules<T>,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormProps<T>) {
  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate a single field
  const validateField = useCallback(
    async <K extends keyof T>(field: K): Promise<string | undefined> => {
      const value = values[field];
      const fieldRules = validationRules[field] || [];

      for (const rule of fieldRules) {
        const isValid = rule.validator(value, values);
        if (!isValid) {
          return rule.message;
        }
      }

      return undefined;
    },
    [values, validationRules]
  );

  // Validate all form fields
  const validateForm = useCallback(async (): Promise<FormErrors<T>> => {
    const validationErrors = {} as FormErrors<T>;
    const fieldsToValidate = Object.keys(validationRules) as Array<keyof T>;

    for (const field of fieldsToValidate) {
      const error = await validateField(field);
      if (error) {
        validationErrors[field] = error;
      }
    }

    setErrors(validationErrors);
    return validationErrors;
  }, [validateField, validationRules]);

  // Set a single field value
  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K], shouldValidate = validateOnChange) => {
      setValues(prev => ({ ...prev, [field]: value }));

      if (shouldValidate) {
        validateField(field).then(error => {
          setErrors(prev => ({ ...prev, [field]: error }));
        });
      }
    },
    [validateField, validateOnChange]
  );

  // Handle input change event
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const actualValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;
      
      setFieldValue(name as keyof T, actualValue as T[keyof T]);
    },
    [setFieldValue]
  );

  // Set field as touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, isTouched = true, shouldValidate = validateOnBlur) => {
      setTouched(prev => ({ ...prev, [field]: isTouched }));

      if (shouldValidate) {
        validateField(field).then(error => {
          setErrors(prev => ({ ...prev, [field]: error }));
        });
      }
    },
    [validateField, validateOnBlur]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFieldTouched(e.target.name as keyof T);
    },
    [setFieldTouched]
  );

  // Set field error
  const setFieldError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set multiple values at once
  const setFormValues = useCallback(
    (newValues: Partial<T>, shouldValidate = false) => {
      setValues(prev => ({ ...prev, ...newValues }));
      if (shouldValidate) validateForm();
    },
    [validateForm]
  );

  // Set multiple fields as touched
  const setMultipleTouched = useCallback(
    (touchedFields: TouchedFields<T>, shouldValidate = false) => {
      setTouched(prev => ({ ...prev, ...touchedFields }));
      if (shouldValidate) validateForm();
    },
    [validateForm]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      setSubmitCount(prev => prev + 1);
      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as TouchedFields<T>
      );
      setTouched(allTouched);

      // Validate form
      const validationErrors = await validateForm();
      
      // If no errors and onSubmit provided, call it
      if (Object.keys(validationErrors).length === 0 && onSubmit) {
        try {
          await onSubmit(values, {
            setValues: setFormValues,
            resetForm,
            setFieldValue,
            setFieldError,
            setFieldTouched,
            setTouched: setMultipleTouched,
            setErrors,
            validateForm,
            validateField,
          });
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    },
    [
      values,
      onSubmit,
      validateForm,
      setFormValues,
      resetForm,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      setMultipleTouched,
      setErrors,
      validateField,
    ]
  );

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    
    // Event handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Field manipulation
    setValues: setFormValues,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setTouched: setMultipleTouched,
    setErrors,
    
    // Validation
    validateForm,
    validateField,
  };
}

export default useForm; 