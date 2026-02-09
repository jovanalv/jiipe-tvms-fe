import { X, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ImageViewer({ isOpen, onClose, imageSrc }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[-14px] right-[-14px] p-[6px] text-white transition-colors bg-red-500 rounded-full hover:bg-red-700 z-[99]"
        >
          <X size={16} />
        </button>
        {imageSrc ? (
          <div className="relative w-[60vw] h-[80vh] overflow-hidden rounded-lg bg-gray-900">
            <img
              src={imageSrc}
              alt="Preview"
              className="object-contain w-full h-full drop-shadow-xl"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
            <User size={120} className="text-gray-400" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
