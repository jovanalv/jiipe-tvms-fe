import { AlertTriangle, ArrowLeft, ChevronRight, Flame, X } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function ModalEmergency({ isOpen, onClose, emgData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-overlayShow">
      <div className="relative bg-white rounded-lg max-w-xl w-full max-h-[90vh] flex flex-col animate-modalFadeIn">
        {/* Tombol Close (X) */}
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition top-5 right-5 hover:text-red-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Emergency Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-bold text-center text-red-700">
            Emergency Mode Active
          </h2>
          <p className="mb-8 text-xl text-center text-gray-600">
            {emgData?.description}
          </p>

          {/* Action Buttons */}
          <div className="flex w-full gap-4">
            <div className="flex-[1]">
              <Button
                label="View Dashboard"
                icon="ChevronRight"
                variant="reject"
                style={"w-full flex justify-center"}
                onClick={() => {
                  const area = emgData?.pval3?.toLowerCase();
                  const url =
                    area === "hcl" || area === "nsd"
                      ? `/dashboard-emergency-mobile?area=${area}`
                      : `/dashboard-emergency-mobile`;
                  window.open(url, "_blank");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
