import { useState, useMemo, useCallback } from "react";
import { Trash2, ArrowUp, ArrowDown, ArchiveX, Edit } from "lucide-react";
import SearchBar from "./SearchBar";
import { Plus } from "lucide-react";
import TableSkeleton from "../skeleton/TableSkeleton";

export default function TableInput({
  items,
  columns,
  onEdit,
  onDelete,
  onAdd,
  isReadonly,
  primaryKeyAccessor = "id",
  onUnreg,
  onClickRow,
  limitPage,
  showPaginate = true,
  title,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(limitPage || 25);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [errors, setErrors] = useState({});

  const customStyles = {
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#f0f0f0",
      borderRadius: "5px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#333",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#999",
      ":hover": {
        color: "#ff0000",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "80px",
      overflowY: "auto",
    }),
  };

  // Search handler
  const handleSearch = useCallback((e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(0);
  }, []);

  // Sorting handler
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle direction if same column
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      // New column, start with ascending
      return { key, direction: "ascending" };
    });
  }, []);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Skip sorting for Action column
        if (sortConfig.key === "actions") return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null and undefined values
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Compare values
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === "ascending"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
          ? 1
          : -1;
      });
    }

    return result;
  }, [items, searchTerm, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Page count calculation
  const pageCount = useMemo(
    () => Math.ceil(processedData.length / pageSize),
    [processedData, pageSize]
  );

  const getPageNumbers = () => {
    if (pageCount <= 10) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const range = [];
    const delta = 2;

    range.push(1);

    if (currentPage > delta + 2) {
      range.push("...");
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pageCount - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage < pageCount - (delta + 1)) {
      range.push("...");
    }

    range.push(pageCount);

    return range;
  };

  return (
    <div className="mt-3 mb-8">
      {/* Search and Page Size Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          {showPaginate && (
            <>
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="px-2 py-1 text-sm bg-white border rounded"
              >
                {[25, 50, 100, 200, 300, 400, 500].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">Data</span>
            </>
          )}
          {title && <span className="font-semibold text-md">{title}</span>}
        </div>
        <div className="flex items-center gap-[20px]">
          <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />

          {onAdd && (
            <div className="flex space-x-4 bg-white rounded-lg shadow-sp">
              <div
                className={`flex items-center border ${
                  isReadonly ? "border-gray-400" : "border-primary"
                } ${isReadonly ? "bg-gray-300" : "bg-primary"} hover:${
                  isReadonly ? "bg-gray-300" : "bg-primary/90"
                } text-white px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer`}
                onClick={!isReadonly ? onAdd : null}
                disabled={isReadonly}
              >
                <Plus size={16} className="mr-1.5" />
                Add Data
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-100 border-b">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                  className={`
                    p-3 text-left text-xs font-bold text-primary capitalize tracking-wider
                    ${
                      column.accessor !== "actions" && column.sortable
                        ? "cursor-pointer hover:bg-gray-200"
                        : ""
                    }
                  `}
                  style={{ width: column.width }}
                >
                  {column.Header}
                  {column.accessor !== "actions" && column.sortable && (
                    <span className="inline-flex items-center ml-2">
                      {sortConfig.key === column.accessor &&
                        (sortConfig.direction === "ascending" ? (
                          <ArrowUp size={12} className="text-primary" />
                        ) : (
                          <ArrowDown size={12} className="text-primary" />
                        ))}
                    </span>
                  )}
                </th>
              ))}

              {(onEdit || onDelete) && (
                <th className="p-3 text-xs font-bold tracking-wider text-center capitalize text-primary">
                  Action
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <TableSkeleton
                rowsCount={paginatedData.length > 0 ? paginatedData.length : 4}
                columnsLength={columns.length}
              />
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row[primaryKeyAccessor] || rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 ${onClickRow ? "cursor-pointer" : ""}`}
                  onClick={onClickRow ? () => onClickRow(row) : undefined}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`whitespace-nowrap px-[10px] py-[4px] text-xs text-gray-600 ${
                        column.Header === "#" ? "w-20" : ""
                      }`}
                    >
                      {column.Header === "#"
                        ? rowIndex + 1 + currentPage * pageSize
                        : column.Cell
                        ? column.Cell({ row: { original: row } })
                        : row[column.accessor]}
                    </td>
                  ))}

                  {(onEdit || onDelete || onUnreg) && (
                    <td className="w-20 p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        {onUnreg && (
                          <div
                            onClick={() => onUnreg(row[primaryKeyAccessor])}
                            className="text-orange-500 cursor-pointer hover:text-orange-700"
                          >
                            <ArchiveX size={15} />
                          </div>
                        )}
                        {onEdit && (
                          <div
                            onClick={() => onEdit(row)}
                            title="Edit Data"
                            className="text-indigo-500 cursor-pointer hover:text-indigo-700"
                          >
                            <Edit size={15} />
                          </div>
                        )}
                        {onDelete && (
                          <div
                            title="Delete Data"
                            onClick={() => onDelete(rowIndex, row)}
                            className="text-red-500 cursor-pointer hover:text-red-700"
                          >
                            <Trash2 size={15} />
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <div className="flex flex-col gap-[10px]">
          <div className="mt-2 text-xs text-gray-600">
            Showing {currentPage * pageSize + 1} to{" "}
            {Math.min((currentPage + 1) * pageSize, processedData.length)} of{" "}
            {processedData.length} records
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto text-xs">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
          >
            Back
          </button>

          <div className="flex space-x-2 overflow-x-auto">
            {getPageNumbers().map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span key={`dots-${index}`} className="px-3 py-1">
                  {pageNumber}
                </span>
              ) : (
                <div
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber - 1)}
                  className={`
                  px-3 py-1 border text-center rounded cursor-pointer min-w-[40px]
                  ${
                    currentPage === pageNumber - 1
                      ? "bg-primary text-white"
                      : "bg-white text-primary"
                  }
                `}
                >
                  {pageNumber}
                </div>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
            }
            disabled={currentPage >= pageCount - 1}
            className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
