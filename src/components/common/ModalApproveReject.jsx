import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building,
  MapPin,
  Calendar,
  Info,
  X,
  XCircle,
  Check,
  Search,
  Tag,
} from "lucide-react";
import Button from "./Button";
import ImagePreviewModal from "./ImagePreviewModal";
import Swal from "sweetalert2";
import { useState } from "react";

export default function ModalApproveReject({
  isProcessModalOpen,
  setIsProcessModalOpen,
  processData,
  setProcessData,
  formData,
  handleInputChange,
  processStep,
  setProcessStep,
  selectedAreas,
  setSelectedAreas,
  selectedAccesses,
  setSelectedAccesses,
  handleCheckboxChange,
  areaList,
  fetchArea,
  filteredAccessList,
  isSubmitting,
  handleSubmit,
  setPreviewImage,
  areaSearchTerm,
  setAreaSearchTerm,
  accessSearchTerm,
  setAccessSearchTerm,
}) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  if (!processData) return null;

  return (
    <>
      <AnimatePresence>
        {isProcessModalOpen && processData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl"
            >
              {/* Main Content Area with two columns */}
              <div className="flex flex-col md:flex-row">
                {/* Left Column - Static Information */}
                <div
                  className={`relative flex flex-col items-center justify-start w-full p-8 overflow-hidden text-white md:w-2/5 
                        ${
                          formData.stats === "A"
                            ? "bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-900"
                            : "bg-gradient-to-br from-red-700 via-red-600 to-red-900"
                        }`}
                >
                  {processData.img_person && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url(data:image/jpeg;base64,${processData.img_person})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  )}

                  {/* Visitor Photo */}
                  {processData?.img_person ? (
                    <div
                      className="relative mb-8 transition-transform duration-300 cursor-pointer hover:scale-105 group"
                      onClick={() => {
                        if (processData.img_person) {
                          setPreviewImage(processData.img_person);
                          setIsImagePreviewOpen(true);
                        }
                      }}
                    >
                      <img
                        src={`data:image/jpeg;base64,${processData.img_person}`}
                        alt="Visitor"
                        className="object-cover w-40 h-40 border-4 rounded-full shadow-lg border-white/40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center duration-300 rounded-full opacity-0 bg-indigo-800/20 group-hover:opacity-100">
                        <div className="p-2 rounded-full bg-white/30">
                          <User size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-40 h-40 mb-8 border-4 rounded-full shadow-lg bg-gradient-to-br from-white/20 to-white/5 border-white/30">
                      <User size={64} className="text-white/80" />
                    </div>
                  )}

                  {/* Visitor Information */}
                  <div className="w-full space-y-4">
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold tracking-wide">
                        {processData?.visitorName || "Visitor"}
                      </h2>
                      {/* <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-white/30"></div> */}
                    </div>

                    <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      {/* Company */}
                      {processData?.visitorBukrs && (
                        <div className="flex items-start gap-3 pb-3 mb-3 border-b border-white/10">
                          <Building
                            size={16}
                            className="flex-shrink-0 mt-1 text-white/90"
                          />
                          <div>
                            <span className="block text-xs text-white/60">
                              Company
                            </span>
                            <span className="text-sm text-white">
                              {processData.visitorBukrs}
                            </span>
                          </div>
                        </div>
                      )}

                      {processData?.visitorAddress && (
                        <div className="flex items-start gap-3 pb-3 mb-3 border-b border-white/10">
                          <MapPin
                            size={16}
                            className="flex-shrink-0 mt-1 text-white/90"
                          />
                          <div>
                            <span className="block text-xs text-white/60">
                              Company Address
                            </span>
                            <span className="text-sm text-white">
                              {processData.visitorAddress}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Purpose */}
                      {processData?.purpose && (
                        <div className="flex items-start gap-3 pb-3 mb-3 border-b border-white/10">
                          <Info
                            size={16}
                            className="flex-shrink-0 mt-1 text-white/90"
                          />
                          <div>
                            <span className="block text-xs text-white/60">
                              Purpose
                            </span>
                            <span className="text-sm text-white">
                              {processData.purpose}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Visit Date */}
                      {processData?.dats_start && (
                        <div className="flex items-start gap-3">
                          <Calendar
                            size={16}
                            className="flex-shrink-0 mt-1 text-white/90"
                          />
                          <div>
                            <span className="block text-xs text-white/60">
                              Visit Date
                            </span>
                            <span className="text-sm text-white">
                              {new Date(processData.dats_start).toLocaleString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Step Content */}
                <div className="w-full p-8 bg-white md:w-3/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {formData.stats === "R"
                          ? "Reasons for Rejection"
                          : processStep === 0
                          ? "Visitor Information"
                          : processStep === 1
                          ? "Select Area"
                          : "Select Access Location"}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {formData.stats === "R"
                          ? "Provide a reason for rejecting this visitor"
                          : processStep === 0
                          ? "Review visitor information"
                          : processStep === 1
                          ? "Select areas the visitor can access"
                          : "Select specific access locations"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProcessModalOpen(false);
                        setProcessData(null);
                        setProcessStep(0);
                        setSelectedAreas([]);
                        setSelectedAccesses([]);
                      }}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-full hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Progress Steps - Only show for approval flow */}
                  {formData.stats === "A" && (
                    <div className="mb-6">
                      <div className="flex mb-2">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="flex-1">
                            <div
                              className={`h-2 ${
                                index === processStep
                                  ? "bg-primary"
                                  : index < processStep
                                  ? "bg-primary/30"
                                  : "bg-gray-200"
                              } rounded-full ${index !== 2 ? "mr-2" : ""}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-center text-gray-600">
                        Step {processStep + 1} of 3
                      </div>
                    </div>
                  )}

                  {/* Step Content */}
                  <motion.div
                    key={`${formData.stats}-${processStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
                  >
                    {/* Rejection Flow - Only show rejection remarks */}
                    {formData.stats === "R" ? (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-rose-50 border-rose-100">
                          <div className="flex items-center mb-4">
                            <div className="p-2 mr-3 rounded-full bg-rose-100">
                              <XCircle className="w-6 h-6 text-rose-600" />
                            </div>
                            <h4 className="text-lg font-medium text-rose-800">
                              Reject Visitor Request
                            </h4>
                          </div>

                          <p className="mb-4 text-gray-700">
                            You are about to reject the visitor request for{" "}
                            <span className="font-semibold">
                              {processData?.visitorName || "this visitor"}
                            </span>
                            . Please provide a reason for rejection.
                          </p>

                          <div className="mb-4">
                            <label className="block text-sm mb-1.5 font-medium text-gray-700">
                              Rejection Notes{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="rejectionRemarks"
                              value={formData.rejectionRemarks || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  { name: "rejectionRemarks" },
                                  e.target.value
                                )
                              }
                              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                              rows="4"
                              placeholder="Please provide detailed reason for rejection"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Approval Flow - Step 1: Information Review */}
                        {processStep === 0 && (
                          <div className="space-y-4">
                            <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
                              <h4 className="mb-2 font-medium text-indigo-800">
                                Visitor Details
                              </h4>
                              <div className="space-y-3">
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    Email:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {processData?.visitorEmail || "—"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    Phone:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {processData?.visitorPhone || "—"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    Identity:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {processData?.visitorIdentity || "—"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                              <h4 className="mb-2 font-medium text-blue-800">
                                Visit Information
                              </h4>
                              <div className="space-y-3">
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    Start Date:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {(processData.dats_start &&
                                      new Date(
                                        processData.dats_start
                                      ).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })) ||
                                      "—"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    End Date:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {(processData.dats_end &&
                                      new Date(
                                        processData.dats_end
                                      ).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })) ||
                                      "—"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    PIC:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {processData?.pic || "—"}
                                  </span>
                                </div>
                                <div className="flex">
                                  <span className="w-1/3 text-sm text-gray-500">
                                    Notes:
                                  </span>
                                  <span className="w-2/3 text-sm text-gray-800">
                                    {processData?.remarks || "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {processStep === 1 && (
                          <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <h4 className="mb-3 font-medium text-gray-800">
                                Select Areas
                              </h4>
                              <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Search Area..."
                                  value={areaSearchTerm}
                                  onChange={(e) =>
                                    setAreaSearchTerm(e.target.value)
                                  }
                                  className="w-full py-2 pl-10 pr-4 border border-gray-300 h-[38px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Make sure to fetch areas if they're not loaded yet */}
                              {areaList.length === 0 && (
                                <div className="py-4 text-center">
                                  <button
                                    onClick={fetchArea}
                                    className="px-4 py-2 text-indigo-700 transition-colors bg-indigo-100 rounded-lg hover:bg-indigo-200"
                                  >
                                    Load Areas
                                  </button>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-auto pr-2">
                                {areaList
                                  .filter((area) =>
                                    area.label
                                      .toLowerCase()
                                      .includes(areaSearchTerm.toLowerCase())
                                  )
                                  .map((area) => (
                                    <div
                                      key={area.value}
                                      className={`relative flex items-center p-3 transition-all duration-150 border rounded-md cursor-pointer group hover:border-blue-500 ${
                                        selectedAreas.includes(area.value)
                                          ? "border-blue-500 bg-blue-50"
                                          : "border-gray-200"
                                      }`}
                                      onClick={() =>
                                        handleCheckboxChange(
                                          { name: "areaid" },
                                          area.value,
                                          !selectedAreas.includes(area.value)
                                        )
                                      }
                                    >
                                      <div
                                        className={`flex items-center justify-center w-8 h-8 mr-3 rounded-md ${
                                          selectedAreas.includes(area.value)
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        <Building size={18} />
                                      </div>
                                      <div className="flex-1">
                                        <h3
                                          className={`text-sm font-medium ${
                                            selectedAreas.includes(area.value)
                                              ? "text-primary-foreground"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {area.label}
                                        </h3>
                                      </div>
                                      <div
                                        className={`flex items-center justify-center w-5 h-5 transition-all duration-150 border rounded-full ${
                                          selectedAreas.includes(area.value)
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        <Check
                                          size={12}
                                          className={
                                            selectedAreas.includes(area.value)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {processStep === 2 && (
                          <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <h4 className="mb-3 font-medium text-gray-800">
                                Select Access Locations
                              </h4>
                              <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Search Location..."
                                  value={accessSearchTerm}
                                  onChange={(e) =>
                                    setAccessSearchTerm(e.target.value)
                                  }
                                  className="w-full py-2 pl-10 pr-4 border border-gray-300 h-[38px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>

                              {/* Show message if no areas are selected */}
                              {selectedAreas.length === 0 ? (
                                <div className="py-4 text-center text-gray-500">
                                  Please select at least one area first
                                </div>
                              ) : filteredAccessList.length === 0 ? (
                                <div className="py-4 text-center text-gray-500">
                                  No access locations available for the selected
                                  areas
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-[400px] overflow-auto pr-2">
                                  {filteredAccessList
                                    .filter((access) =>
                                      access.label
                                        .toLowerCase()
                                        .includes(
                                          accessSearchTerm.toLowerCase()
                                        )
                                    )
                                    .map((access) => (
                                      <div
                                        key={access.value}
                                        className={`relative flex items-center px-4 py-3 transition-all duration-200 border rounded-lg cursor-pointer group hover:border-blue-500 ${
                                          selectedAccesses.includes(
                                            access.value
                                          )
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200"
                                        }`}
                                        onClick={() =>
                                          handleCheckboxChange(
                                            { name: "accid" },
                                            access.value,
                                            !selectedAccesses.includes(
                                              access.value
                                            )
                                          )
                                        }
                                      >
                                        <div
                                          className={`flex items-center justify-center w-8 h-8 mr-4 rounded-lg ${
                                            selectedAccesses.includes(
                                              access.value
                                            )
                                              ? "bg-blue-100 text-blue-600"
                                              : "bg-gray-100 text-gray-500"
                                          }`}
                                        >
                                          <MapPin size={16} />
                                        </div>
                                        <div className="flex-1">
                                          <span
                                            className={`font-medium text-sm ${
                                              selectedAccesses.includes(
                                                access.value
                                              )
                                                ? "text-primary-foreground"
                                                : "text-gray-900"
                                            }`}
                                          >
                                            {access.label}
                                          </span>
                                          <p className="text-xs text-gray-500">
                                            {access.areaname}
                                          </p>
                                        </div>
                                        <div
                                          className={`flex items-center justify-center w-5 h-5 transition-all duration-200 border rounded-full ${
                                            selectedAccesses.includes(
                                              access.value
                                            )
                                              ? "bg-blue-100 text-blue-600"
                                              : "bg-gray-100 text-gray-500"
                                          }`}
                                        >
                                          <Check
                                            size={12}
                                            className={
                                              selectedAccesses.includes(
                                                access.value
                                              )
                                                ? "opacity-100"
                                                : "opacity-0"
                                            }
                                          />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  {processData?.vstid && (
                    <div className="flex items-center">
                      <Tag size={14} className="mr-2 text-indigo-600" />
                      ID:{" "}
                      <span className="ml-1 font-mono text-indigo-700">
                        {processData.vstid}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      if (formData.stats === "R" || processStep === 0) {
                        setIsProcessModalOpen(false);
                        setProcessData(null);
                        setProcessStep(0);
                        setSelectedAreas([]);
                        setSelectedAccesses([]);
                      } else {
                        setProcessStep(processStep - 1);
                      }
                    }}
                    icon={"Undo2"}
                    isLoading={isSubmitting}
                    variant="outline"
                    label={
                      formData.stats === "R" || processStep === 0
                        ? "Cancel"
                        : "Back"
                    }
                  />

                  <Button
                    onClick={() => {
                      if (formData.stats === "R") {
                        // For rejection, validate and submit directly
                        if (!formData.rejectionRemarks) {
                          Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Please provide a rejection note.",
                          });
                          return;
                        }

                        // Set the data for submission
                        const submissionData = {
                          ...formData,
                          remarks1: formData.rejectionRemarks,
                          accessid: null,
                          vstid: processData?.vstid, // Ensure vstid is included
                        };
                        delete submissionData.rejectionRemarks;

                        // Update formData before submission
                        handleInputChange(
                          { name: "remarks1" },
                          submissionData.remarks1
                        );
                        handleInputChange({ name: "accessid" }, null);
                        // Submit the data
                        handleSubmit();
                      } else if (processStep === 2) {
                        // For approval, validate and submit on the last step
                        if (selectedAccesses.length === 0) {
                          Swal.fire({
                            icon: "error",
                            title: "Failed",
                            text: "Select at least one Access Level for approval",
                          });
                          return;
                        }

                        // Set the data for submission
                        const submissionData = {
                          ...formData,
                          accessid: selectedAccesses.join(","),
                          vstid: processData?.vstid, // Ensure vstid is included
                        };

                        // Update formData before submission
                        handleInputChange(
                          { name: "accessid" },
                          submissionData.accessid
                        );
                        // Submit the data
                        handleSubmit();
                      } else {
                        // Move to the next step for approval flow
                        setProcessStep(processStep + 1);
                      }
                    }}
                    isLoading={isSubmitting}
                    variant={formData.stats === "R" ? "submitRed" : "submit"}
                    icon={
                      formData.stats === "R" || processStep === 2
                        ? "CheckCheck"
                        : "ArrowRight"
                    }
                    label={
                      formData.stats === "R"
                        ? "Confirm Rejection"
                        : processStep === 2
                        ? "Confirm Approval"
                        : "Next"
                    }
                    labelLoading={"Processing..."}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageSrc={processData.img_person}
      />
    </>
  );
}
