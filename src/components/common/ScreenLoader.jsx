import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function ScreenLoader({ isVisible, theme = "black" }) {
  if (!isVisible) return null;

  const bgClass =
    theme === "white" ? "bg-white bg-opacity-90" : "bg-black bg-opacity-90";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${bgClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
          >
            <Loader />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
