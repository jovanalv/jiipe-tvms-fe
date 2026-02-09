import { FileText, X } from "lucide-react";
import Button from "./Button";

export default function NotesModal({ isOpen, onClose, notes, visitorName }) {
  if (!isOpen) return null;

  const isBase64Image = (str) => {
    return str.startsWith("data:image/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notes - {visitorName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-96">
          {notes ? (
            isBase64Image(notes) ? (
              <div className="flex justify-center">
                <img
                  src={notes}
                  alt="Notes Image"
                  className="max-w-full rounded-md shadow-sm"
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {notes}
              </p>
            )
          ) : (
            <p className="text-sm italic text-gray-400">No notes available</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            label="Close"
            variant="submit"
            icon="CircleX"
          />
        </div>
      </div>
    </div>
  );
}
