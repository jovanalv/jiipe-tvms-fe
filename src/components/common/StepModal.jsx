import { useState, useEffect, useCallback } from "react";
import {
  X,
  ScanLine,
  Search,
  Building2,
  Check,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";
import * as lucideIcons from "lucide-react";
import FormSelect from "../form/FormSelect";
import FormInput from "../form/FormInput";
import FormTextArea from "../form/FormTextArea";
import FormSwitch from "../form/FormSwitch";

export default function StepModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  steps,
  initialData,
  isSubmitting,
  textNext,
  mode,
  formDataParent,
  title,
  saveNow = true,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});
  const [areaSearchTerm, setAreaSearchTerm] = useState("");

  useEffect(() => {
    setPreviews({});
    setFormData(initialData || {});
    setCurrentStep(0);
    setErrors({});
  }, [isOpen, initialData]);

  const handleChange = (input, event, maxLength) => {
    if (input.type === "file") {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (input.maxSize && file.size > input.maxSize) {
        const maxSizeInMB = (input.maxSize / (1024 * 1024)).toFixed(2);
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        const errorMessage = `File size (${fileSizeInMB}MB) exceeds maximum allowed size of ${maxSizeInMB}MB!`;

        setErrors((prev) => ({
          ...prev,
          [input.name]: errorMessage,
        }));

        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[input.name];
            return updatedErrors;
          });
        }, 3000);

        event.target.value = "";
        return;
      }

      if (
        input.accept &&
        file &&
        !input.accept.split(",").some((type) => {
          type = type.trim();
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        })
      ) {
        const errorMessage = `Invalid file type. Allowed types: ${input.accept}`;

        setErrors((prev) => ({
          ...prev,
          [input.name]: errorMessage,
        }));

        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[input.name];
            return updatedErrors;
          });
        }, 3000);

        event.target.value = "";
        return;
      }

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (input.onChange) {
            input.onChange({
              target: {
                name: input.name,
                value: reader.result,
              },
            });
          }

          setFormData((prev) => ({
            ...prev,
            [input.name]: reader.result,
          }));

          setPreviews((prev) => ({
            ...prev,
            [input.name]: reader.result,
          }));
        };

        reader.readAsDataURL(file);
      } else {
        console.error("The selected file is not an image.");
      }
    } else if (input.type === "number") {
      const value = event;
      const maxDigits = maxLength ? Number(maxLength) : null;

      let newErrors = { ...errors };

      if (value.length > maxDigits) {
        newErrors[input.name] = `The maximum length is ${maxDigits} digits!`;
        setErrors(newErrors);

        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[input.name];
            return updatedErrors;
          });
        }, 3000);

        return;
      }

      setErrors(newErrors);
      setFormData((prev) => ({
        ...prev,
        [input.name]: event,
      }));
    } else {
      let newErrors = { ...errors };

      if (maxLength && event.length >= maxLength) {
        newErrors[input.name] = `Maximal ${maxLength} character!`;

        setErrors(newErrors);

        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[input.name];
            return updatedErrors;
          });
        }, 3000);
      } else {
        delete newErrors[input.name];
      }

      setErrors(newErrors);
      setFormData((prev) => ({
        ...prev,
        [input.name]: event,
      }));
    }

    if (errors[input.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[input.name];
        return newErrors;
      });
    }

    return true;
  };

  const handleCheckboxChange = (
    input,
    value,
    isChecked,
    isSingleSelect = false
  ) => {
    let newSelectedItem;
    const baseData = formDataParent || formData;

    if (isSingleSelect) {
      newSelectedItem = isChecked ? value : [];
    } else {
      const currentArray = baseData[input.name] ?? [];
      newSelectedItem = isChecked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);
    }

    input.onChange({
      target: {
        name: input.name,
        value: newSelectedItem,
      },
    });

    setFormData((prev) => ({
      ...prev,
      [input.name]: newSelectedItem,
    }));
  };

  const validateStep = useCallback(
    (stepInputs) => {
      const newErrors = {};
      const dataToValidate = formDataParent || formData;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      stepInputs.forEach((input) => {
        const value = dataToValidate[input.name];
        const isVisible = !input.showWhen || input.showWhen(dataToValidate);

        if (!input.scan && isVisible) {
          if (input.required && (!value || value.toString().trim() === "")) {
            newErrors[input.name] = `${input.label} must be filled!`;
          }

          if (
            input.type === "email" &&
            value &&
            value.toString().trim() !== "" &&
            !emailRegex.test(value.toString().trim())
          ) {
            newErrors[input.name] = "Invalid email format!";
          }
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setTimeout(() => {
          setErrors({});
        }, 3000);
      }

      return Object.keys(newErrors).length === 0;
    },
    [formDataParent, formData]
  );
  const handleNext = () => {
    if (validateStep(steps[currentStep].inputs)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRemovePreview = (inputName) => {
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[inputName];
      return newPreviews;
    });
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[inputName];
      return newFormData;
    });
  };

  const handleSubmit = useCallback(async () => {
    let failedIndex = null;

    for (let i = 0; i < steps.length; i++) {
      const isValid = validateStep(steps[i].inputs);
      if (!isValid) {
        failedIndex = i;
        break;
      }
    }

    if (failedIndex !== null) {
      setCurrentStep(failedIndex);
      return;
    }

    try {
      setFormData((prevData) => ({
        ...prevData,
        cardid: "",
      }));
      await onSubmitSuccess(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }, [steps, formData, onSubmitSuccess, validateStep]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = event.target;

      if (activeElement.matches("input, textarea")) {
        return;
      }

      if (steps[currentStep].scan) {
        const cardIdInput = steps[currentStep]?.inputs?.find(
          (input) => input.scan == true
        );

        if (/^[A-Za-z0-9]$/.test(event.key)) {
          setFormData((prevData) => {
            const updatedCardId = (prevData.cardid || "") + event.key;

            // Panggil input.onChange jika ada
            if (cardIdInput?.onChange) {
              cardIdInput.onChange({
                target: {
                  name: cardIdInput.name,
                  value: updatedCardId,
                },
              });
            }

            return {
              ...prevData,
              cardid: updatedCardId,
            };
          });
        } else if (event.key === "Enter") {
          handleSubmit();

          setFormData((prevData) => {
            if (cardIdInput?.onChange) {
              cardIdInput.onChange({
                target: {
                  name: cardIdInput.name,
                  value: "",
                },
              });
            }

            return {
              ...prevData,
              cardid: "",
            };
          });
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, steps, currentStep, formData, handleSubmit]);

  if (!isOpen) return null;

  const renderInput = (input) => {
    if (input.showWhen && !input.showWhen(formData)) {
      return null;
    }

    switch (input.type) {
      case "select":
        return (
          <FormSelect
            name={input.name}
            tooltip={input.tooltip}
            options={input.options}
            placeholder={input.label}
            value={
              formDataParent?.[input.name]
                ? input.options?.find(
                    (option) => option.value === formDataParent[input.name]
                  ) || null
                : input.options?.find(
                    (option) => option.value === formData[input.name]
                  ) || null
            }
            onChange={(e) => {
              handleChange(e);
              if (input.onChange) input.onChange(e);
            }}
            isLoading={input.isLoading}
            required={input.required}
            errors={errors}
            disabled={input.disabled}
            autoFocus={input.autofocus}
            helpContent={input.helpContent}
            isClearable={true}
            noMb={true}
          />
        );
      case "textarea":
        return (
          <FormTextArea
            key={input.name}
            name={input.name}
            tooltip={input.tooltip}
            value={formDataParent?.[input.name] || formData[input.name] || ""}
            placeholder={input.placeholder}
            onChange={(e) => {
              handleChange(
                input,
                e.target.value,
                e.target.maxLength,
                e.target.max
              );
              if (input.onChange) {
                input.onChange(e);
              }
            }}
            required={input.required}
            maxLength={input.maxLength}
            helpContent={input.helpContent}
            errors={errors}
            noMb={true}
          />
        );
      case "switch":
        return (
          <FormSwitch
            name={input.name}
            value={formDataParent?.[input.name] || formData[input.name] || ""}
            onChange={(e) => {
              handleChange(e);
              if (input.onChange) {
                input.onChange(e);
              }
            }}
            labelTrue={input.labelTrue}
            labelFalse={input.labelFalse}
            variant={input.theme}
          />
        );
      case "file":
        return (
          <div>
            <div className="mb-2">
              {!previews[input.name] && !formDataParent?.[input.name] ? (
                <label
                  htmlFor={input.name}
                  className="flex flex-col items-center justify-center w-32 h-32 mx-auto transition-colors duration-200 border-2 border-gray-300 border-dashed rounded-full cursor-pointer hover:border-blue-400 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <lucideIcons.User className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {input.placeholder || "Upload Photo"}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      PNG, JPG, JPEG
                    </span>
                    {input.maxSize && (
                      <span className="mt-1 text-xs text-gray-400">
                        Max: {(input.maxSize / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    id={input.name}
                    name={input.name}
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={(e) => handleChange(input, e)}
                    className="sr-only"
                    aria-describedby={`${input.name}-description`}
                  />
                </label>
              ) : (
                // Image preview for profile photo
                <div className="relative w-32 h-32 mx-auto">
                  <div className="relative w-32 h-32 overflow-hidden border-2 border-gray-200 rounded-full group bg-gray-50">
                    <img
                      src={
                        previews[input.name]
                          ? previews[input.name].startsWith("data:image")
                            ? previews[input.name]
                            : `data:image/jpeg;base64,${previews[input.name]}`
                          : formDataParent?.[input.name]
                          ? typeof formDataParent[input.name] === "string"
                            ? formDataParent[input.name]
                            : URL.createObjectURL(formDataParent[input.name])
                          : ""
                      }
                      alt="Profile preview"
                      className="object-cover w-full h-full rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          handleRemovePreview(input.name);
                          input.onChange({
                            target: {
                              name: input.name,
                              value: null,
                            },
                          });
                          handleChange(input, {
                            target: { name: input.name, value: null },
                          });
                        }}
                        className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Change photo button */}
                  <label
                    htmlFor={input.name}
                    className="absolute bottom-0 right-0 p-2 text-white bg-blue-500 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Change photo"
                  >
                    <lucideIcons.Camera size={14} />
                    <input
                      type="file"
                      id={input.name}
                      name={input.name}
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => handleChange(input, e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}
            </div>

            {errors[input.name] && (
              <p
                className="mt-2 text-sm text-center text-red-600"
                id={`${input.name}-error`}
              >
                <AlertCircle size={14} className="inline mr-1" />
                {errors[input.name]}
              </p>
            )}

            {input.description && (
              <p
                className="mt-1 text-xs text-center text-gray-500"
                id={`${input.name}-description`}
              >
                {input.description}
              </p>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {input.isSearch && (
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Area..."
                  value={areaSearchTerm}
                  onChange={(e) => setAreaSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 h-[38px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-auto pr-2">
              {input.options
                .filter((item) =>
                  item.label
                    .toLowerCase()
                    .includes(areaSearchTerm.toLowerCase())
                )
                .map((item) => {
                  const currentData =
                    formData?.[input.name] || formDataParent?.[input.name];
                  const isSelected = currentData?.includes?.(item.value);

                  return (
                    <div
                      key={item.value}
                      className={`relative flex items-center p-3 transition-all duration-150 border rounded-md cursor-pointer group hover:border-blue-500 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => {
                        handleCheckboxChange(
                          input,
                          item.value,
                          !isSelected,
                          input.isSingleSelect
                        );
                      }}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 mr-3 rounded-md ${
                          isSelected
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Building2 size={18} />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-sm font-medium ${
                            isSelected
                              ? "text-primary-foreground"
                              : "text-gray-900"
                          }`}
                        >
                          {item.label}
                        </h3>
                      </div>
                      <div
                        className={`flex items-center justify-center w-5 h-5 transition-all duration-150 border rounded-full ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300 group-hover:border-blue-500"
                        }`}
                      >
                        <Check
                          size={12}
                          className={isSelected ? "opacity-100" : "opacity-0"}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {errors[input.name] && (
              <span className="mt-1 text-xs text-red-500">
                {errors[input.name]}
              </span>
            )}
          </div>
        );
      default:
        return (
          <div>
            {input.scan === true && (
              <div className="flex flex-col items-center justify-center text-center">
                <ScanLine size={160} color="#7B7B7B" />

                {isSubmitting && formDataParent?.[input.name] ? (
                  <div className="flex items-center text-center mt-[10px] gap-[5px]">
                    <span className="font-[500] text-sm text-[#7B7B7B]">
                      Scanning in progress...
                    </span>
                    <div>
                      <lucideIcons.Loader
                        className="w-[18px] h-[18px] animate-spin"
                        color="#7B7B7B"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 pt-[20px]">
                    Please scan card!
                  </p>
                )}

                {input.subOption && (
                  <div className="w-full mt-4">
                    <FormSelect
                      name={input.subName}
                      label={input.subLabel}
                      tooltip={input.tooltip}
                      options={input.subOption}
                      placeholder={input.subPlaceholder}
                      value={
                        formDataParent?.[input.subName]
                          ? input.subOption?.find(
                              (option) =>
                                option.value === formDataParent[input.subName]
                            ) || null
                          : input.subOption?.find(
                              (option) =>
                                option.value === formData[input.subName]
                            ) || null
                      }
                      onChange={(e) => {
                        handleChange(e);
                        if (input.onChange) input.onChange(e);
                      }}
                      isLoading={input.isLoading}
                      required={input.subRequired}
                      errors={errors}
                      disabled={input.disabled}
                      autoFocus={input.autofocus}
                      helpContent={input.helpContent}
                      isBlurAfterSelect={true}
                      isClearable={true}
                      noMb={true}
                    />
                  </div>
                )}
              </div>
            )}

            <FormInput
              key={input.name}
              name={input.name}
              type={input.type}
              placeholder={input.placeholder || `Enter ${input.label}`}
              value={
                formDataParent?.[input.name] ||
                formData[input.name] ||
                input.value ||
                ""
              }
              onChange={(e) => {
                const shouldContinue = handleChange(
                  input,
                  e.target.value,
                  e.target.maxLength,
                  e.target.max
                );

                if (shouldContinue && input.onChange) {
                  input.onChange(e);
                }
              }}
              required={input.required}
              disabled={input.disabled}
              maxLength={input.maxLength}
              min={formDataParent?.[input.minValue] || input.minValue}
              max={
                formDataParent?.[input.maxValue] || input.maxValue || input.max
              }
              errors={errors}
              autoFocus={input.autofocus}
              tooltip={input.tooltip}
              helpContent={input.helpContent}
              noMb={true}
            />
          </div>
        );
    }
  };

  const visibleInputs = steps[currentStep].inputs.filter(
    (input) => !input.showWhen || input.showWhen(formData)
  );

  const handleClose = (e) => {
    setPreviews({});
    setFormData({});
    e.preventDefault();
    const modalContainer = e.currentTarget.closest(".animate-overlayShow");
    const modalContent = e.currentTarget.closest(".animate-modalFadeIn");

    modalContainer.classList.add("animate-overlayHide");
    modalContent.classList.add("animate-modalFadeOut");

    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-overlayShow">
      <div className="w-full max-w-3xl mx-4 bg-white rounded-lg shadow-xl animate-modalFadeIn">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {title ? title : mode === "edit" ? "Edit Data" : "Add Data"}
              </h2>

              <button
                className="cursor-pointer w-[30px] h-[30px] rounded-full hover:bg-sky-100 flex items-center justify-center"
                onClick={handleClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1">
              {steps.length > 1 &&
                steps.map((tab, index) => (
                  <div
                    key={index}
                    className={`${currentStep === index ? "block" : "hidden"}`}
                  >
                    <div className="grid grid-cols-1 gap-y-[6px] gap-x-[20px] px-5 rounded-[20px] text-xs mt-[18px]">
                      <div className="border-b border-gray-200 col-span-2 mt-[-15px] mx-[-10px]">
                        <nav
                          className="flex -mb-px space-x-1"
                          aria-label="Tabs"
                        >
                          {steps.map((tabItem, index) => {
                            const IconComponent = tabItem.icon
                              ? lucideIcons[tabItem.icon]
                              : null;

                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (index > currentStep) {
                                    let failedIndex = null;

                                    for (let i = currentStep; i < index; i++) {
                                      const isValid = validateStep(
                                        steps[i].inputs
                                      );
                                      if (!isValid) {
                                        failedIndex = i;
                                        break;
                                      }
                                    }

                                    if (failedIndex === null) {
                                      setCurrentStep(index);
                                    } else {
                                      setCurrentStep(failedIndex);
                                    }
                                  } else {
                                    setCurrentStep(index);
                                  }
                                }}
                                className={`py-3 px-6 font-medium text-sm border-b-2 cursor-pointer flex-1 ${
                                  currentStep === index
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } transition-colors duration-200 focus:outline-none`}
                                aria-current={
                                  currentStep === index ? "page" : undefined
                                }
                              >
                                <div className="flex items-center justify-center">
                                  {IconComponent && (
                                    <IconComponent className="mr-2" size={16} />
                                  )}
                                  {tabItem.title}
                                </div>
                              </button>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === steps.length - 1) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
          >
            <motion.div
              key={currentStep}
              initial={currentStep === 0 ? false : { opacity: 0, x: 20 }}
              animate={currentStep === 0 ? false : { opacity: 1, x: 0 }}
              className={`grid gap-4 ${
                visibleInputs.some(
                  (input) => input.scan == true || input.isSingleCol
                )
                  ? "grid-cols-1"
                  : "grid-cols-2"
              }`}
            >
              {visibleInputs.map((input) => (
                <div key={input.name}>
                  <label className="block mb-1 font-medium text-gray-700 input-text-size">
                    {input.label}
                    {input.required && <span className="text-red-500"> *</span>}
                  </label>
                  {renderInput(input)}
                </div>
              ))}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
              <Button
                onClick={currentStep === 0 ? handleClose : handlePrevious}
                icon={"Undo2"}
                isLoading={isSubmitting}
                variant="outline"
                label={currentStep === 0 ? "Cancel" : "Back"}
              />

              <div className="flex gap-3">
                {currentStep < steps.length - 1 && saveNow && (
                  <Button
                    onClick={handleSubmit}
                    icon="Save"
                    isLoading={isSubmitting}
                    variant="submit"
                    label="Save Now"
                    labelLoading="Saving..."
                  />
                )}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant="submit"
                  icon={
                    currentStep === steps.length - 1 ? "Save" : "ArrowRight"
                  }
                  label={
                    currentStep === steps.length - 1
                      ? "Save"
                      : textNext
                      ? textNext
                      : "Next"
                  }
                  labelLoading={"Loading..."}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
