export default function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-gray-200 rounded h-2">
      <div
        className="bg-blue-600 h-2 rounded"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}
