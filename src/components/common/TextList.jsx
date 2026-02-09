export default function TextList({ items = [] }) {
  return (
    <div className="w-full space-y-[2px]">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-shrink-0 text-xs font-bold">{index + 1}.</div>
          <p className="text-xs text-gray-700 flex-1">{item.text}</p>
        </div>
      ))}
    </div>
  );
}