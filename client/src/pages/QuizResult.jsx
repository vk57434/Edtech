import { motion } from "framer-motion";

const MOTION_USED = motion;

export default function QuizResult({ score, total }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-center p-6"
    >
      <h1 className="text-3xl font-bold">🎉 Quiz Completed</h1>
      <p className="text-xl mt-3">
        Score: {score} / {total}
      </p>
    </motion.div>
  );
}
