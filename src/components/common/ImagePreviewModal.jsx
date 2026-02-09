import { X, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ImagePreviewModal({ isOpen, onClose, imageSrc }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-[90vw] max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-[-14px] right-[-14px] p-[6px] text-white transition-colors bg-red-500 rounded-full hover:bg-red-700 z-[99]"
        >
          <X size={16} />
        </button>
        {imageSrc ? (
          <div className="w-[600px] h-[600px] relative rounded-lg overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${imageSrc}`}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-[600px] h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
            <User size={120} className="text-gray-400" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
