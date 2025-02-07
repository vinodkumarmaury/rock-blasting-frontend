import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validationUtils';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const { errors: fieldErrors } = validateForm(
        { [name]: values[name] },
        { [name]: validationRules[name] }
      );
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  }, [values, validationRules]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    const { isValid, errors: validationErrors } = validateForm(values, validationRules);
    
    setErrors(validationErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        // Handle submission error
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    }
    setIsSubmitting(false);
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
};