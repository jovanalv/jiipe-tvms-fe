import { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import ActionButtons from "../../components/common/ActionButtons";
import FormInput from "../../components/form/FormInput";
import QRCode from "react-qr-code";
import { Check, Clipboard, Download } from "lucide-react";
import {
  getUploadApp,
  updateApp,
} from "../../services/settings/setUploadAppService";

export default function UploadApp() {
  const [formData, setFormData] = useState({
    apkFile: null,
    versionCode: "",
    versionNumber: "",
  });
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      let result = await getUploadApp();

      if (result.success) {
        setFormData({
          versionCode: result.data.version_code,
          versionNumber: result.data.version_number,
        });
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching departmens:", error);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchData()]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.name.toLowerCase().endsWith(".apk")) {
      setErrors((prev) => ({
        ...prev,
        apkFile: "Please select a valid APK file",
      }));
      return;
    }

    if (file && file.size > 100 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        apkFile: "File size must be less than 100MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      apkFile: file,
    }));

    if (errors.apkFile) {
      setErrors((prev) => ({
        ...prev,
        apkFile: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.versionCode) {
      newErrors.versionCode = "Version code is required";
    }

    if (!formData.versionNumber.trim()) {
      newErrors.versionNumber = "Version number is required";
    } else if (!/^\d+\.\d+(\.\d+)?$/.test(formData.versionNumber.trim())) {
      newErrors.versionNumber =
        "Version number must be in format x.x or x.x.x (e.g., 1.0 or 1.0.0)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", formData.apkFile);
      formDataToSend.append("versionCode", formData.versionCode);
      formDataToSend.append("versionNumber", formData.versionNumber);

      await updateApp(formDataToSend);

      await Swal.fire({
        title: "Success!",
        text: "Application uploaded successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      await fetchData();

      const fileInput = document.getElementById("apkFile");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      await Swal.fire({
        title: "Error!",
        text: error.message || "Failed to upload application",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    const link = `${window.location.origin}/android/app.apk`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const downloadUrl = `${window.location.origin}/android/app.apk`;

      const response = await fetch(downloadUrl, { method: "HEAD" });

      if (!response.ok) {
        throw new Error("APK file not found. Please upload an APK file first.");
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `app_v${formData.versionNumber || "unknown"}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await Swal.fire({
        title: "Download Started!",
        text: "Your APK download has been initiated",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Download error:", error);
      await Swal.fire({
        title: "Download Error!",
        text: error.message || "Failed to download APK file",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="px-4 py-2 mx-auto max-w-screen-2xl lg:px-4">
      {isLoading ? (
        <Loader screen={true} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <Breadcrumbs />
            <ActionButtons
              onSave={handleSubmit}
              showBack={true}
              showAddData={false}
              showFilter={false}
              showUploadExcel={false}
              isLoading={isSubmitting}
            />
          </div>

          <div className="p-6 bg-white  rounded-lg border border-[#D1D1D199]">
            <div className="grid grid-cols-2 gap-4">
              {/* APK File Upload */}
              <div className="">
                <label
                  htmlFor="apkFile"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center gap-2 text-xs">
                    APK File
                  </div>
                </label>
                <div className="relative cursor-pointer">
                  <input
                    type="file"
                    id="apkFile"
                    name="apkFile"
                    accept=".apk"
                    onChange={handleFileChange}
                    className={`block cursor-pointer w-full max-h-[32px] text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:cursor-pointer transition-shadow duration-300 file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md ${
                      errors.apkFile
                        ? "ring-1 ring-red-500"
                        : "hover:ring-0 hover:shadow-[0_0_4px_2px_rgba(30,74,233,0.2)]"
                    }`}
                  />
                  {formData.apkFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {formData.apkFile.name} (
                      {(formData.apkFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>
                {errors.apkFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.apkFile}</p>
                )}
              </div>
              {/* Download App Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? "Downloading..." : "Download App"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Version Code */}
                <div>
                  <FormInput
                    label={"Version Code"}
                    name={"versionCode"}
                    type={"text"}
                    value={formData.versionCode}
                    placeholder="e.g., 1, 2, 3..."
                    onChange={handleInputChange}
                    errors={errors}
                    noMb={true}
                  />
                </div>

                {/* Version Number */}
                <div>
                  <FormInput
                    label={"Version Number"}
                    name={"versionNumber"}
                    type={"text"}
                    value={formData.versionNumber}
                    placeholder="e.g., 1.0.0, 2.1.5"
                    onChange={handleInputChange}
                    errors={errors}
                    noMb={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs text-gray-600">
                Scan QR to download APK
              </p>
              <div className="inline-block p-4 bg-white rounded shadow">
                <QRCode
                  value={`${window.location.origin}/android/app.apk`}
                  size={128}
                />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <p className="text-xs text-gray-500">
                  {`${window.location.origin}/android/app.apk`}
                </p>
                <div
                  onClick={handleCopy}
                  className="flex items-center justify-center p-1 transition-colors duration-200 rounded cursor-pointer hover:bg-gray-100"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clipboard className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
