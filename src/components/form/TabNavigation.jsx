export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
