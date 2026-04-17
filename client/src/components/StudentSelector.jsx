export default function StudentSelector({ students, onSelect }) {
  return (
    <div className="p-6">
      <h2>Select Student</h2>
      {students.map(s => (
        <button
          key={s._id}
          onClick={() => onSelect(s)}
          className="block border p-3 my-2"
        >
          {s.name} – Class {s.class}
        </button>
      ))}
    </div>
  );
}
