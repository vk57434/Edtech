// import { motion, AnimatePresence } from "framer-motion";
// import OptionButton from "./OptionButton";

// /**
//  * QuizCard Component
//  * Handles the display of a single question, its progress, timer, and options.
//  */
// export default function QuizCard({
//   question,
//   index,
//   total,
//   timeLeft,
//   onSelect,
//   answered,
//   selected,
// }) {
//   if (!question) return null;

//   return (
//     <div className="w-full">
//       {/* Progress Bar */}
//       <div className="w-full bg-gray-200 rounded h-3 mb-6 overflow-hidden shadow-inner">
//         <motion.div
//           className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded"
//           initial={{ width: 0 }}
//           animate={{
//             width: `${((index + 1) / total) * 100}%`,
//           }}
//           transition={{ duration: 0.5 }}
//         />
//       </div>

//       {/* Timer Display */}
//       <div className="flex justify-between items-center mb-6">
//         <span className="text-sm font-semibold text-slate-500">
//           Question {index + 1} of {total}
//         </span>
//         <motion.div
//           className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold shadow-sm ${timeLeft <= 5 ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"
//             }`}
//           animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
//           transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
//         >
//           <span>⏱</span>
//           <span>{timeLeft}s</span>
//         </motion.div>
//       </div>

//       {/* Question with Animation */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="w-full"
//           style={{ transform: "none" }}
//         >
//           <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-8 leading-tight">
//             {question.text}
//           </h2>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
//             {question.options?.map((opt, i) => (
//               <OptionButton
//                 key={i}
//                 text={opt.text}
//                 onClick={() => onSelect(i)}
//                 isCorrect={i === question.correctIndex}
//                 isSelected={selected === i}
//                 answered={answered}
//               />
//             ))}
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }
