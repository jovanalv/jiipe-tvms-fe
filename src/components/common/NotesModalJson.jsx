import { FileText, X } from "lucide-react";
import Button from "./Button";

export default function NotesModalJson({
  isOpen,
  onClose,
  notes,
  title,
  title2,
}) {
  if (!isOpen) return null;

  const parseNotes = (notesData) => {
    if (!notesData) return null;

    try {
      if (typeof notesData === "object") {
        return notesData;
      }

      return JSON.parse(notesData);
    } catch (error) {
      console.error("Error parsing notes JSON:", error);
      return null;
    }
  };

  const formatJsonString = (data) => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  const renderFieldLabel = (key) => {
    return key.replace(/([A-Z])/g, " $1");
  };

  const parsedNotes = parseNotes(notes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {title} - {title2}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-96">
          {parsedNotes ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                {Object.entries(parsedNotes).map(([key, value]) => {
                  if (key.toLowerCase() === "status") {
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 input-text-size">
                          {renderFieldLabel(key)}:
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full input-text-size font-medium ${
                            value === "success" ||
                            value === "active" ||
                            value === "completed"
                              ? "bg-green-100 text-green-800"
                              : value === "failed" ||
                                value === "error" ||
                                value === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {String(value)}
                        </span>
                      </div>
                    );
                  }

                  // Handle error fields with red text
                  if (key.toLowerCase().includes("error") && value) {
                    return (
                      <div key={key} className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 input-text-size">
                          {renderFieldLabel(key)}:
                        </span>
                        <span className="text-red-600 input-text-size">
                          {String(value)}
                        </span>
                      </div>
                    );
                  }

                  // Handle numeric values (like responseTime, count, etc.)
                  if (typeof value === "number") {
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-gray-600 input-text-size">
                          {renderFieldLabel(key)}:
                        </span>
                        <span className="text-gray-800 input-text-size">
                          {key.toLowerCase().includes("time")
                            ? `${value}ms`
                            : value}
                        </span>
                      </div>
                    );
                  }

                  // Handle objects and arrays (like data, headers, etc.)
                  if (typeof value === "object" && value !== null) {
                    return (
                      <div key={key}>
                        <span className="block mb-1 font-medium text-gray-600 input-text-size">
                          {renderFieldLabel(key)}:
                        </span>
                        <pre className="p-3 overflow-auto text-gray-800 bg-white border rounded input-text-size max-h-40">
                          {formatJsonString(value)}
                        </pre>
                      </div>
                    );
                  }

                  // Handle simple string values
                  return (
                    <div key={key} className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 input-text-size">
                        {renderFieldLabel(key)}:
                      </span>
                      <span className="text-gray-800 input-text-size">
                        {String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm italic text-gray-400">No notes available</p>
          )}
        </div>

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
