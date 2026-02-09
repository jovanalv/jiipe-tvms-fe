import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import Button from "./Button";
import ImagePreviewModal from "./ImagePreviewModal";

export default function ModalDetail({
  isOpen,
  onClose,
  selectedVisitor,
  setPreviewImage,
}) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  if (!selectedVisitor) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && selectedVisitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl"
            >
              {/* Main Content Area dengan layout dua kolom */}
              <div className="flex flex-col md:flex-row">
                {/* Kolom Kiri - Foto dan info dasar dengan gradien yang lebih elegan */}
                <div
                  className={`relative flex flex-col items-center justify-center w-full p-8 overflow-hidden text-white md:w-2/5
                    ${
                      selectedVisitor.stats === "Active" ||
                      selectedVisitor.stats === "Aktif"
                        ? "bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-900"
                        : selectedVisitor.stats === "Done" ||
                          selectedVisitor.stats === "Selesai"
                        ? "bg-gradient-to-br from-green-600 via-green-500 to-green-700"
                        : selectedVisitor.stats === "Sign-off"
                        ? "bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700"
                        : "bg-gradient-to-br from-red-700 via-red-600 to-red-900"
                    }`}
                >
                  {selectedVisitor.img_person && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url(data:image/jpeg;base64,${selectedVisitor.img_person})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  )}

                  {/* Foto Pengunjung dengan efek hover */}
                  {selectedVisitor.img_person ? (
                    <div
                      className="relative mb-8 transition-transform duration-300 cursor-pointer hover:scale-105 group"
                      onClick={() => {
                        if (selectedVisitor.img_person) {
                          setPreviewImage(selectedVisitor.img_person);
                          setIsImagePreviewOpen(true);
                        }
                      }}
                    >
                      <img
                        src={`data:image/jpeg;base64,${selectedVisitor.img_person}`}
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

                  <div className="w-full">
                    <div className="text-center p-2">
                      <h2 className="text-2xl font-bold text-white">
                        {selectedVisitor.visitorName || "Visitor"}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan - Informasi detail pengunjung */}
                <div className="w-full p-8 bg-white md:w-3/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center text-xl font-semibold text-gray-800">
                      Additional Information
                    </h3>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-full hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Detail pengunjung dengan layout yang lebih rapi */}
                  <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="space-y-5">
                      <div
                        className={`p-4 border rounded-lg
                          ${
                            selectedVisitor.stats === "Active" ||
                            selectedVisitor.stats === "Aktif"
                              ? "border-indigo-100 bg-indigo-50"
                              : selectedVisitor.stats === "Done" ||
                                selectedVisitor.stats === "Selesai"
                              ? "border-green-100 bg-green-50"
                              : selectedVisitor.stats === "Sign-off"
                              ? "border-gray-100 bg-gray-50"
                              : "border-red-100 bg-red-50"
                          }`}
                      >
                        <h4 className="mb-2 font-medium text-black">
                          Visitor Details
                        </h4>
                        <div className="space-y-3">
                          {[
                            ["visitorName", "Name"],
                            ["visitorEmail", "Email"],
                            ["visitorPhone", "Phone"],
                            ["visitorIdentity", "NIK / Identity"],
                            ["visitorBukrs", "Company"],
                            ["visitorAddress", "Company Address"],
                          ].map(([key, label]) => (
                            <div key={key} className="flex">
                              <span className="w-1/3 text-sm text-gray-500">
                                {label}
                              </span>
                              <span className="w-2/3 text-sm text-gray-800">
                                {selectedVisitor[key] || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg
                        ${
                          selectedVisitor.stats === "Active" ||
                          selectedVisitor.stats === "Aktif"
                            ? "border-indigo-100 bg-indigo-50"
                            : selectedVisitor.stats === "Done" ||
                              selectedVisitor.stats === "Selesai"
                            ? "border-green-100 bg-green-50"
                            : selectedVisitor.stats === "Sign-off"
                            ? "border-gray-100 bg-gray-50"
                            : "border-red-100 bg-red-50"
                        }`}
                      >
                        <h4 className="mb-2 font-medium text-black">
                          Visit Information
                        </h4>
                        <div className="space-y-3">
                          {[
                            ["purpose", "Purpose"],
                            ["remarks", "Notes"],
                            ["dats_start", "Visit Start Date"],
                            ["dats_end", "Visit End Date"],
                            ["accessname", "Access"],
                            ["pic", "PIC"],
                          ].map(([key, label]) => {
                            let value = selectedVisitor[key] || "—";

                            // Format tanggal jika key adalah dats_start atau dats_end
                            if (
                              ["dats_start", "dats_end"].includes(key) &&
                              value !== "—"
                            ) {
                              value = new Date(value).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              });
                            }

                            return (
                              <div key={key} className="flex">
                                <span className="w-1/3 text-sm text-gray-500">
                                  {label}
                                </span>
                                <span className="w-2/3 text-sm text-gray-800">
                                  {value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50">
                {selectedVisitor.vstid && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={14} className="mr-2 text-indigo-600" />
                    Visitor ID:{" "}
                    <span className="ml-1 font-mono text-indigo-700">
                      {selectedVisitor.vstid}
                    </span>
                  </div>
                )}
                <div className="flex space-x-3">
                  <Button onClick={onClose} variant="outline" label="Close" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageSrc={selectedVisitor.img_person}
      />
    </>
  );
}
