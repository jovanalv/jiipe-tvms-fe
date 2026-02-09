import { useState, useCallback } from "react";

export function useForm(initialValues, validationSchema = {}, options = {}) {
  const { useInternalHandleChange = true } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const internalHandleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    for (const key in validationSchema) {
      const rules = validationSchema[key];
      const value = values[key]?.toString().trim() || "";

      if (rules.required && !value) {
        newErrors[key] = rules.message || `${key} is required`;
        continue;
      }

      if (rules.minLength && value.length < rules.minLength) {
        newErrors[key] =
          rules.message ||
          `${key} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[key] =
          rules.message ||
          `${key} must not exceed ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[key] = rules.message || `${key} is invalid format`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(
    async (onSubmit) => {
      if (!validate()) return;

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (err) {
        console.error("Submit error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate]
  );

  return {
    values,
    setValues,
    errors,
    isSubmitting,
    handleChange: useInternalHandleChange ? internalHandleChange : undefined,
    handleSubmit,
    validate,
  };
}
