import { useEffect, useState } from "react";
import { Eye, FileText, ImageOff, Trash2, Upload } from "lucide-react";
// import Upload from "../icon/Upload";
import ImageViewer from "../common/ImageViewer";
import getBase64SizeKB from "../../utils/format/base64";
import Swal from "sweetalert2";
import PDFViewer from "../common/PDFViewer";

export default function FormUploadImage2({
  label,
  name,
  accept = "image/*",
  maxSize = 2048, //  2MB
  onChange,
  value,
  required,
  disabled,
  errors = {},
  noMb = false,
  toBase64 = false,
  labelSize = "normal",
  displayNonImage = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isViewerPDFOpen, setIsViewerPDFOpen] = useState(false);

  useEffect(() => {
    if (value && typeof value === "string") {
      setPreview(value);
      const sizeKB = getBase64SizeKB(value);
      setFile({
        name: "",
        size: sizeKB * 1024,
        isExisting: true,
      });
    } else if (!value) {
      setFile(null);
      setPreview(null);
    }
  }, [value]);

  const handleFile = (uploadedFile) => {
    const fileSizeKB = uploadedFile.size / 1024;
    if (fileSizeKB > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: `The file size exceeds the maximum limit of ${(
          maxSize / 1024
        ).toFixed(1)} MB.`,
        confirmButtonColor: "#2D4ED8",
      });
      return;
    }
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const isAccepted = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        return uploadedFile.type.startsWith(type.replace("*", ""));
      }
      return uploadedFile.type === type || uploadedFile.name.endsWith(type);
    });

    if (!isAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File Format",
        text: `Please upload a valid file format (${accept.replace(
          /application\/|image\//g,
          "",
        )}).`,
        confirmButtonColor: "#2D4ED8",
      });
      return;
    }
    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onloadend = () => {
      if (uploadedFile.type.startsWith("image/")) {
        setPreview(reader.result);
      } else {
        setPreview(null);
      }

      if (onChange) {
        onChange({
          target: {
            name,
            value: toBase64 ? reader.result : uploadedFile,
          },
        });
      }
    };

    if (toBase64 || uploadedFile.type.startsWith("image/")) {
      reader.readAsDataURL(uploadedFile);
    } else {
      if (onChange) {
        onChange({ target: { name, value: uploadedFile } });
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (onChange) onChange({ target: { name, value: "" } });
  };

  const labelSizeStyles = {
    normal: "font-medium text-gray-700 input-text-size",
    big: "!font-bold !text-gray-900 !text-xl",
  };

  if (displayNonImage) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
        <div className="flex items-center justify-center w-16 h-16 mb-2 bg-gray-100 rounded-full">
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">No Image Available</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-[5px] w-full ${noMb ? "mb-0" : "mb-4"}`}>
      {label && (
        <label
          htmlFor={name}
          className={
            labelSize === "big" ? labelSizeStyles.big : labelSizeStyles.normal
          }
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg py-6 px-4 text-center transition-colors duration-200 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${errors[name] ? "border-red-500" : ""}`}
          >
            <input
              type="file"
              id={name}
              name={name}
              accept={accept}
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
            {/* UI Content Upload */}
            <label
              htmlFor={name}
              className={`flex flex-col items-center gap-3 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <Upload />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-gray-700">
                  <span className="font-medium text-blue-600">
                    Drag your files
                  </span>{" "}
                  to start uploading
                </p>

                <div className="flex items-center w-full my-1">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-xs font-medium text-gray-500">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById(name).click()}
                  className="px-[6px] py-[4px] my-1 text-xs font-medium text-[#2D4ED8] rounded-[5px] border-[1px] border-[#2D4ED8] hover:bg-blue-100"
                  disabled={disabled}
                >
                  Browse files
                </button>
                <p className="text-xs mt-[5px] font-semibold leading-none text-gray-600">
                  Max size: {(maxSize / 1024).toFixed(0)}MB
                </p>
                <p className="text-xs leading-none text-gray-500">
                  Accepted:{" "}
                  {accept
                    .replace(/application\/|image\//g, "")
                    .replace(/,/g, ", ")}
                </p>
              </div>
            </label>
          </div>
        ) : (
          /* Preview UI */
          <div className="p-4 bg-white border border-gray-300 rounded-lg">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center justify-between w-full">
                {preview && preview?.startsWith("data:image/") ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setIsViewerOpen(true)}
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-contain w-40 h-40 transition-all border-2 border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-gray-300"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center transition-all bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-5">
                      <div className="transition-opacity opacity-0 group-hover:opacity-100">
                        <div className="bg-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">
                            Click to view
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Click Indicator Icon (always visible) */}
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                ) : preview && preview?.startsWith("data:application/pdf") ? (
                  <div className="flex items-center flex-1 gap-4">
                    <div
                      className="relative flex items-center justify-center w-40 h-40 transition-all border-2 border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md hover:border-gray-300 group"
                      onClick={() => setIsViewerPDFOpen(true)}
                    >
                      {/* Icon Container */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText
                          className={`w-20 h-20 transition-transform group-hover:scale-110 ${
                            preview?.startsWith("data:application/pdf")
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center transition-all bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-5">
                        <div className="transition-opacity opacity-0 group-hover:opacity-100">
                          <div className="bg-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">
                              Click to view
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* File Type Badge */}
                      <div
                        className={`absolute bottom-3 px-3 py-1 rounded-md text-xs font-semibold text-white shadow-sm ${
                          preview?.startsWith("data:application/pdf")
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {preview?.startsWith("data:application/pdf")
                          ? "PDF"
                          : file?.name?.split(".").pop()?.toUpperCase() ||
                            "FILE"}
                      </div>

                      {/* Click Indicator Icon (always visible) */}
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center flex-1 gap-4">
                    <div className="relative flex items-center justify-center w-40 h-40 border-2 border-gray-200 rounded-lg shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText
                          className={`w-20 h-20 ${
                            file?.type === "application/pdf"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div
                        className={`absolute bottom-3 px-3 py-1 rounded-md text-xs font-semibold text-white ${
                          file?.type === "application/pdf"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {file?.type === "application/pdf"
                          ? "PDF"
                          : file?.name?.split(".").pop()?.toUpperCase() ||
                            "FILE"}
                      </div>
                    </div>
                  </div>
                )}

                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-[17px] p-1 text-red-500 rounded right-[15px] "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs mt-[-5px] text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}

        {errors[name] && (
          <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
        )}
        <ImageViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          imageSrc={preview}
        />
        <PDFViewer
          isOpen={isViewerPDFOpen}
          onClose={() => setIsViewerPDFOpen(false)}
          pdfSrc={preview}
        />
      </div>
    </div>
  );
}