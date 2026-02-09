import { useState, useCallback } from "react";

export default function useFormModal(initialData = {}, options = {}) {
  const {
    onChangeOverride = null,
    validateField = null,
    transformValue = null,
  } = options;

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (name, value, useExternalHandler = false) => {
      if (useExternalHandler && onChangeOverride) {
        const result = onChangeOverride(name, value, formData);

        if (result === false) return;

        if (typeof result === "object" && result !== null) {
          setFormData((prev) => ({
            ...prev,
            ...result,
          }));
          return;
        }
      }

      let finalValue = value;
      if (transformValue) {
        finalValue = transformValue(name, value, formData);
      }

      if (validateField) {
        const error = validateField(name, finalValue, formData);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    },
    [formData, onChangeOverride, validateField, transformValue]
  );

  const handleChangeFromEvent = useCallback(
    (e, useExternalHandler = false) => {
      const { name, value, type, checked } = e.target;
      const finalValue = type === "checkbox" ? checked : value;
      handleChange(name, finalValue, useExternalHandler);
    },
    [handleChange]
  );

  const setMultipleFields = useCallback((fields) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const clearForm = useCallback(() => {
    setFormData({});
    setErrors({});
  }, []);

  const updateFormData = useCallback((newData) => {
    setFormData(newData || {});
    setErrors({});
  }, []);

  const getError = useCallback((name) => errors[name], [errors]);

  const isValid = useCallback(() => {
    return Object.values(errors).every((error) => !error);
  }, [errors]);

  return {
    formData,
    errors,
    handleChange,
    handleChangeFromEvent,
    setMultipleFields,
    resetForm,
    clearForm,
    updateFormData,
    getError,
    isValid,
    setFormData,
    setErrors,
  };
}