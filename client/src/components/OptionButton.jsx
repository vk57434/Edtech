import { motion } from "framer-motion";

/**
 * OptionButton Component
 * Renders an individual quiz option with hover/tap animations and status-based styling.
 */
export default function OptionButton({
  text,
  onClick,
  isCorrect,
  isSelected,
  answered,
}) {
  return (
    <motion.div
      whileHover={{ scale: answered ? 1 : 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={
        [
          "group cursor-pointer rounded-2xl overflow-hidden border-4 bg-white/90 shadow-lg transition-all duration-300",
          !answered && "hover:shadow-2xl hover:-translate-y-1",
          answered && isCorrect &&
            "border-green-500 ring-4 ring-green-200 shadow-[0_0_30px_rgba(34,197,94,0.7)]",
          answered && isSelected && !isCorrect &&
            "border-red-500 ring-4 ring-red-200 shadow-[0_0_26px_rgba(248,113,113,0.7)]",
          !answered && "border-transparent",
          answered && !isSelected && !isCorrect && "border-transparent",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <div className="bg-white p-6 text-center text-lg font-bold sm:text-xl">
        {text}
      </div>
    </motion.div>
  );
}
