import { useState, useCallback } from "react";

export function useMultiSelect(datas, { getId, filterAllowed }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => !prev);
    setSelectedItems([]);
  }, []);

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    let allowedItems = datas;
    if (filterAllowed) {
      allowedItems = datas.filter(filterAllowed);
    }

    const allowedIds = allowedItems.map(getId);

    const allSelected = allowedIds.every((id) => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !allowedIds.includes(id)));
    } else {
      setSelectedItems((prev) => {
        const newSelected = new Set(prev);
        allowedIds.forEach((id) => newSelected.add(id));
        return Array.from(newSelected);
      });
    }
  }, [datas, selectedItems, getId, filterAllowed]);

  return {
    selectedItems,
    isSelectMode,
    toggleSelectMode,
    handleSelectItem,
    handleSelectAll,
    setSelectedItems,
  };
}
