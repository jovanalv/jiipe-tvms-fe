import { AlertTriangle } from "lucide-react";

export default function AlertBox({ message, onClose, subject }) {
  return (
    <div className="p-4 mb-4 border border-yellow-200 rounded-md bg-yellow-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex flex-col">
          <div className="ml-3">
            <p className="font-bold text-gray-900 text-md">{subject}</p>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{message}</p>
          </div>
        </div>

        <div className="pl-3 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex p-1.5 text-yellow-500 hover:bg-yellow-100 rounded-md focus:outline-none"
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
