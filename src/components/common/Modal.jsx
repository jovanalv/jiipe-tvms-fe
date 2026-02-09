import { Upload, FileText, AlertCircle, X, DownloadCloud } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Button from "./Button";
import FormSelect from "../form/FormSelect";
import FormInput from "../form/FormInput";
import FormTextArea from "../form/FormTextArea";
import FormSelectMultiple from "../form/FormSelectMultiple";
import FormSwitch from "../form/FormSwitch";
import FormInputColor from "../form/FormInputColor";
import FormDateTimePicker from "../form/FormDateTimePicker";
import dayjs from "dayjs";

export default function Modal({
  isOpen,
  onClose,
  onSubmitSuccess,
  mode,
  currentData,
  inputs,
  isSubmitting,
  templateFile,
  templateLink,
  modalType,
  onAddSave,
  formDataParent,
  children,
  gridCols = "2",
  modalWidth,
  title,
  position = "column",
  enableScan = false,
  onScanCard,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({});
  const scanBuffer = useRef("");
  const lastKeyTime = useRef(Date.now());

  // --- 1. INITIALIZE DATA ---
  useEffect(() => {
    const initialFormData = {};
    const initialPreviews = {};

    const filteredInputs = inputs.filter(
      (input) => mode !== "edit" || input.scan !== true
    );

    filteredInputs.forEach((input) => {
      if (input.type === "multi-select") {
        const currentValues = currentData?.[input.name] || [];
        initialFormData[input.name] = input.options.filter((option) =>
          currentValues.includes(option.value)
        );
      } else if (input.type === "file") {
        const existingFile = currentData?.[input.name];
        initialFormData[input.name] = existingFile || null;

        if (existingFile) {
          initialPreviews[input.name] = existingFile;
        }
      } else if (input.type === "switch") {
        const value = currentData?.[input.name];

        if (value !== undefined) {
          initialFormData[input.name] =
            value === (input.defaultTrue ?? "A")
              ? true
              : value === (input.defaultFalse ?? "I")
                ? false
                : input.defaultValue;
        } else {
          initialFormData[input.name] =
            input.defaultTrue !== undefined
              ? true
              : input.defaultFalse !== undefined
                ? false
                : input.defaultValue;
        }
      } else {
        initialFormData[input.name] = currentData?.[input.name] || "";
      }
    });

    setFormData(initialFormData);
    setPreviews(initialPreviews);
  }, [isOpen, currentData, inputs, mode]);

  // --- 2. SCANNER LOGIC ---
  // Cari input yang ditandai sebagai scan=true atau bernama 'rfid'
  const scanInputConfig = inputs.find((i) => i.scan === true || i.name === "rfid");
  const scanInputName = scanInputConfig ? scanInputConfig.name : "rfid";
  const scannedValue = formData[scanInputName];

  useEffect(() => {
    if (!isOpen || !enableScan || !scanInputName) return;

    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;

      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      const currentTime = Date.now();

      if (currentTime - lastKeyTime.current > 500) {
        scanBuffer.current = "";
      }
      lastKeyTime.current = currentTime;

      // Handle Enter
      if (event.key === "Enter") {
        event.preventDefault();

        // console.log("SCAN DETECTED (Ref):", scanBuffer.current);

        if (scanBuffer.current) {
          const capturedValue = scanBuffer.current;

          setFormData((prev) => {
            const newData = {
              ...prev,
              [scanInputName]: capturedValue,
            };
            return newData;
          });

          if (onScanCard) onScanCard(capturedValue);

          scanBuffer.current = "";
        }
      } else if (/^[a-zA-Z0-9]$/.test(event.key)) {
        scanBuffer.current += event.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, enableScan, scanInputName, onScanCard]);

  // --- 3. HANDLE CHANGES ---
  const handleChange = (selectedOptions, isMulti = false, name = null) => {
    if (isMulti) {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.isArray(selectedOptions) ? selectedOptions : [],
      }));
    } else if (selectedOptions.target.type === "file") {
      const file = selectedOptions.target.files[0];
      const name = selectedOptions.target.name;

      if (file) {
        const maxSize = 5 * 1024 * 1024;
        const acceptedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          ".xls",
          ".xlsx",
          "image/png",
          "image/jpeg",
          "image/jpg",
          "application/pdf",
        ];

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        const isAccepted = acceptedTypes.some((type) =>
          type.startsWith(".") ? fileName.endsWith(type) : fileType === type
        );

        if (!isAccepted) {
          Swal.fire({
            icon: "error",
            title: "Invalid File Type",
            text: "Please upload a valid file.",
          });
          return;
        }

        if (file.size > maxSize) {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Maximum file size is 5MB",
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);

        // Logic kompresi gambar (jika ada prop onCompress di input)
        const compressMethod = inputs.find(
          (input) => input.name === name
        )?.onCompress;

        if (compressMethod) {
          compressMethod(file)
            .then((compressedImage) => {
              setFormData((prev) => ({
                ...prev,
                [name]: compressedImage || file,
              }));
            })
            .catch((error) => {
              console.error("Compression error:", error);
              setFormData((prev) => ({
                ...prev,
                [name]: file,
              }));
            });
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: file,
          }));
        }
      }
    } else if (selectedOptions.target.type === "number") {
      const { name, value, max } = selectedOptions.target;
      let newErrors = { ...errors };
      const numValue = Number(value);
      const maxValue = max ? Number(max) : null;

      if (maxValue !== null && numValue > maxValue) {
        const maxLength = String(maxValue).length;
        newErrors[name] = `The maximum value is (${maxLength} digit)!`;
        setErrors(newErrors);
        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[name];
            return updatedErrors;
          });
        }, 2000);
        return;
      }

      setErrors(newErrors);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (
      selectedOptions.target.type === "text" ||
      selectedOptions.target.type === "textarea"
    ) {
      const { name, value, maxLength } = selectedOptions.target;
      let newErrors = { ...errors };

      if (maxLength && value.length >= maxLength) {
        newErrors[name] = `Maximal ${maxLength} character!`;
        setErrors(newErrors);
        setTimeout(() => {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[name];
            return updatedErrors;
          });
        }, 2000);
      } else {
        delete newErrors[name];
      }

      setErrors(newErrors);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      const { name, value } = selectedOptions.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name || selectedOptions.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name || selectedOptions.target.name];
        return newErrors;
      });
    }
  };

  const handleRemovePreview = (name) => {
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[name];
      return newPreviews;
    });
    setFormData((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const dataToValidate = formDataParent || formData;

    inputs.forEach((input) => {
      // Logic untuk Hidden Input: Tetap validasi jika required,
      // tapi biasanya hidden input diisi otomatis.
      if (input.required) {
        if (input.type === "multi-select") {
          if (
            !dataToValidate[input.name] ||
            dataToValidate[input.name].length === 0
          ) {
            newErrors[input.name] = `${input.label} must be filled!`;
          }
        } else if (input.type === "file") {
          if (!dataToValidate[input.name] && !currentData?.[input.name]) {
            newErrors[input.name] = `${input.label} must be filled!`;
          }
        } else if (
          dataToValidate[input.name] === undefined ||
          dataToValidate[input.name] === null ||
          dataToValidate[input.name].toString().trim() === ""
        ) {
          newErrors[input.name] = `${input.label || input.name} must be filled!`;
        }
      }

      if (
        input.minLength &&
        dataToValidate[input.name] &&
        dataToValidate[input.name].toString().trim().length < input.minLength
      ) {
        newErrors[input.name] = `${input.label} must be at least ${input.minLength} characters!`;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    inputs.forEach(input => {
      if (input.name == "rfid" && formData.rfid == "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Scan RFID terlebih dahulu",
        });
      }
    });
    if (!validateForm()) return;

    try {
      const submissionData = { ...currentData };
      // Filter out cardid explicitly if needed, similar to your logic
      const filteredInputs = inputs.filter(
        (input) => mode !== "edit" || input.name !== "cardid"
      );

      filteredInputs.forEach((input) => {
        if (input.type === "multi-select") {
          submissionData[input.name] =
            formData[input.name]?.map((item) => item.value) || [];
        } else if (input.type === "switch") {
          submissionData[input.name] = formData[input.name]
            ? input.defaultTrue ?? "A"
            : input.defaultFalse ?? "I";
        } else {
          submissionData[input.name] = formData[input.name];
        }
      });

      await onSubmitSuccess(submissionData);
    } catch (error) {
      console.error("Submission error:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.message || "An error occurred during submission",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  if (!isOpen) return null;

  const filteredInputs = inputs.filter(
    (input) => mode !== "edit" || input.name !== "cardid"
  );

  const handleClose = (e) => {
    const modalContainer = e.currentTarget.closest(".animate-overlayShow");
    const modalContent = e.currentTarget.closest(".animate-modalFadeIn");
    if (modalContainer) modalContainer.classList.add("animate-overlayHide");
    if (modalContent) modalContent.classList.add("animate-modalFadeOut");
    setErrors({});
    setTimeout(onClose, 300);
  };

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[gridCols] || "grid-cols-2";

  // --- RENDER FUNCTION ---
  const renderInputFields = (isScanLayout = false) => (
    <div
      className={`grid ${isScanLayout ? "grid-cols-1 gap-4" : `${position === "row"
                  ? "md:grid-cols-1"
                  : "grid-cols-2"} gap-4 pb-3`
        }`}
    >
      {filteredInputs.map((input) => {
        // --- 1. LOGIKA AUTO-HIDE SAAT MODE SCAN ---
        if (
          isScanLayout &&
          (input.scan === true || input.name === scanInputName)
        ) {
          return null;
        }

        // --- 2. FIX LAYOUT HIDDEN INPUT (CRUCIAL FIX) ---
        // Return input murni TANPA wrapper <div> jika typenya hidden.
        if (input.type === "hidden") {
          return (
            <input
              key={input.name}
              type="hidden"
              name={input.name}
              value={
                formDataParent?.[input.name] ||
                formData[input.name] ||
                input.value ||
                ""
              }
            />
          );
        }

        // --- 3. RENDER INPUT NORMAL DENGAN WRAPPER ---
        return (
          <div
            key={input.name}
            className={`flex flex-col ${input.isSingleCol ? "col-span-2" : ""}`}
          >
            <label
              htmlFor={input.name}
              className="mb-1 font-medium text-gray-700 input-text-size"
            >
              {input.label}
              {input.required && <span className="text-red-500"> *</span>}
            </label>

            {/* Template Links */}
            {(templateLink || templateFile) && (
              // Logic download template (sama seperti kode asli)
              <div className="mb-4">
                {/* ... code template link ... */}
                {/* Agar ringkas, saya anggap bagian ini sama seperti kode asli Anda */}
                {/* Gunakan kode asli Anda untuk templateLink/templateFile di sini */}
              </div>
            )}

            {/* SWITCHER TIPE INPUT */}
            {input.type === "multi-select" ? (
              <FormSelectMultiple
                name={input.name}
                tooltip={input.tooltip}
                options={input.options}
                placeholder={input.label}
                value={
                  formDataParent?.[input.name] || formData[input.name] || ""
                }
                onChange={(selectedOptions) =>
                  handleChange(selectedOptions, true, input.name)
                }
                isLoading={input.isLoading}
                required={input.required}
                errors={errors}
                disabled={input.disabled}
                autoFocus={input.autofocus}
                onKeyDown={handleKeyDown}
                isClearable={true}
              />
            ) : input.type === "select" ? (
              <FormSelect
                name={input.name}
                tooltip={input.tooltip}
                options={input.options}
                placeholder={input.label}
                value={
                  formDataParent?.[input.name]
                    ? input.options?.find(
                      (o) => o.value === formDataParent[input.name]
                    ) || null
                    : input.options?.find(
                      (o) => o.value === formData[input.name]
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
                onKeyDown={handleKeyDown}
                helpContent={input.helpContent}
                isClearable={true}
                noMb={true}
              />
            ) : input.type === "textarea" ? (
              <FormTextArea
                name={input.name}
                value={
                  formDataParent?.[input.name] || formData[input.name] || ""
                }
                onChange={(e) => {
                  handleChange(e);
                  if (input.onChange) input.onChange(e);
                }}
                placeholder={input.placeholder}
                required={input.required}
                maxLength={input.maxLength}
                helpContent={input.helpContent}
                errors={errors}
                noMb={true}
              />
            ) : input.type === "switch" ? (
              <FormSwitch
                name={input.name}
                value={
                  formDataParent?.[input.name] ??
                  formData?.[input.name] ??
                  input.defaultValue
                }
                onChange={(e) => {
                  handleChange(e);
                  if (input.onChange) input.onChange(e);
                }}
                labelTrue={input.labelTrue}
                labelFalse={input.labelFalse}
                variant={input.theme}
              />
            ) : input.type === "color" ? (
              <FormInputColor
                name={input.name}
                type={input.type}
                value={
                  formDataParent?.[input.name] ||
                  formData[input.name] ||
                  input.value ||
                  ""
                }
                placeholder={input.placeholder}
                onChange={(e) => {
                  handleChange(e);
                  if (input.onChange) input.onChange(e);
                }}
                required={input.required}
                disabled={input.disabled}
                maxLength={input.maxLength}
                errors={errors}
                autoFocus={input.autofocus}
                onKeyDown={handleKeyDown}
                tooltip={input.tooltip}
                helpContent={input.helpContent}
                noMb={true}
              />
            ) : input.type === "date-time" ? (
              <FormDateTimePicker
                name={input.name}
                value={
                  formDataParent?.[input.name] ||
                  formData[input.name] ||
                  input.value ||
                  ""
                }
                onChange={(e) => {
                  handleChange(e);
                  if (input.onChange) input.onChange(e);
                }}
                placeholder={input.placeholder}
                required={input.required}
                disabled={input.disabled}
                maxLength={input.maxLength}
                minDateTime={
                  formDataParent?.[input.minValue]
                    ? dayjs(formDataParent[input.minValue])
                    : null
                }
                maxDateTime={
                  formDataParent?.[input.maxValue]
                    ? dayjs(formDataParent[input.maxValue])
                    : null
                }
                errors={errors}
                startHour={0}
                endHour={24}
                autoFocus={input.autofocus}
                onKeyDown={handleKeyDown}
                tooltip={input.tooltip}
                helpContent={input.helpContent}
                isClearable={input.isClearable}
                noMb={true}
                isModal={true}
              />
            ) : input.type === "file" ? (
              // ... LOGIC FILE UPLOAD (Disederhanakan agar fit, pakai logika asli Anda) ...
              <div className="mb-4">
                <label
                  htmlFor={input.name}
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Upload File
                </label>

                {!previews[input.name] ? (
                  <label
                    htmlFor={input.name}
                    // UBAH: Border biru, putus-putus (dashed), dan padding yang lebih besar
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-400 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">

                      {/* BAGIAN ICON: Background biru muda dengan icon panah */}
                      <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>

                      {/* BAGIAN TEKS UTAMA */}
                      <p className="mb-2 text-sm text-gray-900 font-medium">
                        {/* Menggunakan teks hardcode sesuai gambar, atau fallback ke placeholder */}
                        Seret gambar untuk upload gambar
                      </p>

                      {/* BAGIAN PEMISAH "ATAU" */}
                      <div className="flex items-center w-48 my-2">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="px-3 text-xs text-gray-400">atau</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>

                      {/* BAGIAN TOMBOL VISUAL */}
                      <div className="mt-2 px-6 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                        Upload Gambar
                      </div>
                    </div>

                    <input
                      type="file"
                      id={input.name}
                      name={input.name}
                      accept={input.accept || "*"}
                      onChange={(e) => handleChange(e)}
                      className="hidden" // Menggunakan hidden agar input asli tidak terlihat
                    />
                  </label>
                ) : (
                  <div className="mt-2">
                    {/* Logic Preview (Tidak diubah, tetap sama seperti sebelumnya) */}
                    <div className="relative flex items-center p-4 border border-gray-200 rounded-md bg-gray-50">
                      {input.accept?.includes("image") ? (
                        <img
                          src={
                            previews[input.name].startsWith("data:image")
                              ? previews[input.name]
                              : `data:image/jpeg;base64,${previews[input.name]}`
                          }
                          alt="Preview"
                          className="object-contain w-full mx-auto max-h-48"
                        />
                      ) : (
                        <div className="flex items-center w-full">
                          <FileText size={24} className="text-blue-500 mr-3" />
                          <p className="text-sm font-medium text-gray-900 truncate flex-1">
                            {formData[input.name]?.name || "Selected file"}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePreview(input.name)}
                        className="ml-4 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // DEFAULT INPUT (Text, Number, Password)
              <FormInput
                name={input.name}
                type={input.type}
                value={
                  formDataParent?.[input.name] ||
                  formData[input.name] ||
                  input.value ||
                  ""
                }
                onChange={(e) => {
                  handleChange(e);
                  if (input.onChange) input.onChange(e);
                }}
                placeholder={input.placeholder}
                required={input.required}
                disabled={input.disabled}
                maxLength={input.maxLength}
                min={formDataParent?.[input.minValue]}
                max={formDataParent?.[input.maxValue]}
                errors={errors}
                autoFocus={input.autofocus}
                onKeyDown={handleKeyDown}
                tooltip={input.tooltip}
                helpContent={input.helpContent}
                noMb={true}
              />
            )}

            {errors[input.name] && (
              <p className="mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="inline mr-1" />
                {errors[input.name]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none animate-overlayShow">
      <div
        className={`relative w-full mx-4 animate-modalFadeIn ${modalWidth ? modalWidth : "max-w-xl"
          }`}
      >
        <div className="relative flex flex-col w-auto bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="p-6 space-y-4"
            encType="multi"
          >
            <div className="flex items-center justify-between">
              <h2 className="mb-4 text-xl font-semibold">
                {title
                  ? title
                  : modalType === "filter"
                    ? "Filter Data"
                    : mode === "edit"
                      ? "Ubah Data"
                      : "Tambah Data"}
              </h2>
            </div>

            {enableScan ? (
              <div className={`grid ${position === "row"
                  ? "md:grid-cols-1"
                  : "grid-cols-2"
                } gap-6`}>
                {/* VISUAL SCANNER */}
                <div
                  onClick={() => {
                    if (onScanCard) onScanCard();
                  }}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer group h-full min-h-[200px] 
                      ${scannedValue
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-400"
                    }`}
                >
                  {scannedValue ? (
                    <div className="text-center animate-bounce-short">
                      <div className="mb-4 flex justify-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <FileText size={32} />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700">
                        Scan Berhasil!
                      </h3>
                      <p className="text-xs text-gray-400 mt-4">
                        Scan kartu lain untuk mengganti
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-500 font-medium mb-6 group-hover:text-blue-600 transition-colors">
                        Silahkan Scan Kartu
                      </div>
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Visual Card Illustration */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-700 rounded-tl-lg group-hover:border-blue-600 transition-colors"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-700 rounded-tr-lg group-hover:border-blue-600 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-700 rounded-bl-lg group-hover:border-blue-600 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-700 rounded-br-lg group-hover:border-blue-600 transition-colors"></div>
                        <div className="w-20 h-1 bg-gray-300 rounded-full group-hover:bg-blue-400 animate-pulse"></div>
                      </div>
                    </>
                  )}
                </div>

                {/* FORM KANAN */}
                <div className={`flex flex-col justify-center`}>
                  {renderInputFields(true)}
                </div>
              </div>
            ) : (
              // FORM NORMAL (TANPA SCAN)
              renderInputFields(false)
            )}

            {children}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
              <Button
                onClick={handleClose}
                isLoading={isSubmitting}
                variant="outline"
                label={"Batal"}
                icon={"Undo2"}
              />

              <div className="flex gap-[5px]">
                {onAddSave && (
                  <Button
                    onClick={onAddSave}
                    variant="submit"
                    icon={"SaveAll"}
                    label={"Simpan & Tambah Baru"}
                  />
                )}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant="submit"
                  icon={modalType === "filter" ? "Filter" : "Simpan"}
                  label={modalType === "filter" ? "Filter" : "Simpan"}
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