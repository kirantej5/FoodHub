export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      <button
        onClick={() => onSelect('')}
        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
          selected === ''
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/10'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            selected === cat._id
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-white/10'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
