import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArchiveX,
  CircleChevronDown,
  CircleChevronRight,
  FileX,
} from "lucide-react";
import SearchBar from "./SearchBar";
import TableSkeleton from "../skeleton/TableSkeleton";
import ButtonExport from "./ButtonExport";
import { copyToClipboard } from "../../utils/export/copyClipboardHelper";
import { exportToExcel } from "../../utils/export/excelExportHelper";
import { pdfExportHelper } from "../../utils/export/pdfExportHelper";
import { printExportHelper } from "../../utils/export/printExportHelper";
import { motion } from "framer-motion";
import Button from "./Button";

export default function TableTree({
  data = [],
  columns,
  onEdit,
  onDelete,
  onUnreg,
  primaryKeyAccessor = "id",
  onClickRow,
  childrenAccessor = "children",
  expandable = true,
  onButtonVisitorAccess,
  onButtonContractorAccess,
  onButtonSpecialBehavior,
  onButtonCompleteVisitor,
  onButtonPrintQR,
  onButtonDriver,
  onFilter,
  fetchData,
  isChangingPage,
  totalRecords = 0,
  currentPage = 0,
  currentPageSize = 10,
  isLoading,
  showExport,
  fileName = "Export",
  autoExpand = false,
  searchTerm,
  handleSearch,
  showLeftSearch = false,
}) {
  const [pageSize, setPageSize] = useState(currentPageSize);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // State for tracking expanded rows
  const [expandedRows, setExpandedRows] = useState(new Set());
  const searchDebounceTimeout = useRef(null);

  useEffect(() => {
    setPageSize(currentPageSize);
  }, [currentPageSize]);

  // Toggle row expansion
  const toggleRowExpansion = useCallback((rowId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  // Expand all rows
  const expandAll = useCallback(() => {
    const allExpandableIds = new Set();
    const collectExpandableIds = (rows) => {
      rows.forEach((row) => {
        if (row[childrenAccessor] && row[childrenAccessor].length > 0) {
          allExpandableIds.add(row[primaryKeyAccessor]);
          collectExpandableIds(row[childrenAccessor]);
        }
      });
    };
    collectExpandableIds(data);
    setExpandedRows(allExpandableIds);
  }, [data, childrenAccessor, primaryKeyAccessor]);

  // Collapse all rows
  const collapseAll = useCallback(() => {
    setExpandedRows(new Set());
  }, []);

  useEffect(() => {
    if (autoExpand) {
      expandAll();
    }
  }, [autoExpand]);

  // Sorting handler
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  }, []);

  // Process parent data (filter and sort)
  const processedParentData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = [...data];

    // Sorting for parent rows
    if (sortConfig.key && sortConfig.key !== "actions") {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

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
  }, [data, searchTerm, sortConfig]);

  // Flatten tree structure for display - only for paginated parents
  const flattenTreeData = useCallback(
    (treeData, level = 0, parentExpanded = true) => {
      let flattened = [];

      treeData.forEach((item) => {
        if (parentExpanded) {
          flattened.push({
            ...item,
            _level: level,
            _hasChildren: item[childrenAccessor]?.length > 0,
          });
        }

        if (
          item[childrenAccessor] &&
          item[childrenAccessor].length > 0 &&
          expandedRows.has(item[primaryKeyAccessor]) &&
          parentExpanded
        ) {
          flattened = flattened.concat(
            flattenTreeData(item[childrenAccessor], level + 1, true)
          );
        }
      });

      return flattened;
    },
    [expandedRows, childrenAccessor, primaryKeyAccessor]
  );

  const displayData = useMemo(() => {
    return flattenTreeData(processedParentData);
  }, [processedParentData, flattenTreeData]);

  const getPageNumbers = () => {
    const range = [];
    const delta = 2;
    const maxPages = Math.ceil(totalRecords / pageSize);

    if (maxPages <= 7) {
      return Array.from({ length: maxPages }, (_, i) => i);
    }

    range.push(0);

    if (currentPage > delta + 1) {
      range.push("...");
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(maxPages - 2, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage < maxPages - (delta + 2)) {
      range.push("...");
    }

    if (maxPages > 1) {
      range.push(maxPages - 1);
    }

    return range;
  };

  const handlePageSizeChange = useCallback(
    (newSize) => {
      setPageSize(newSize);
      if (fetchData) {
        fetchData(0, newSize, true);
      }
    },
    [fetchData]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setExpandedRows(new Set());
      if (fetchData) {
        fetchData(newPage, pageSize, true);
      }
    },
    [fetchData, pageSize]
  );

  const getCurrentDate = () => {
    return new Date()
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  // Transform data for export functions
  const transformData = (data, mappings = {}) => {
    return data.map((row) => {
      const modifiedRow = { ...row };

      Object.keys(mappings).forEach((key) => {
        if (modifiedRow[key] in mappings[key]) {
          modifiedRow[key] = mappings[key][modifiedRow[key]];
        }
      });

      return modifiedRow;
    });
  };

  const mappings = {
    stats: {
      U: "In Use",
      A: "Active",
      I: "Inactive",
      D: "Damaged",
      M: "Missing",
    },
    type1: {
      V: "Visitor",
      E: "Employee",
      K: "Contractor",
    },
  };

  //? Handle Copy to Clipboard
  const handleCopy = () => {
    const displayedData = transformData(displayData, mappings);

    const headers = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.Header);

    const keys = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.accessor);

    copyToClipboard(displayedData, headers, keys);
  };

  //? Handle Download Excel
  const handleDownloadExcel = () => {
    const displayedData = transformData(displayData, mappings);

    const headers = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.Header);

    const keys = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.accessor);

    const filename = `${fileName}-${getCurrentDate()}`;
    exportToExcel(displayedData, headers, keys, filename);
  };

  //? Handle Download PDF
  const handleDownloadPdf = () => {
    const displayedData = transformData(displayData, mappings);

    const headers = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.Header);

    const keys = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.accessor);

    const filename = `${fileName}-${getCurrentDate()}`;
    pdfExportHelper(headers, keys, displayedData, filename);
  };

  //? Handle Print
  const handlePrint = () => {
    const displayedData = transformData(displayData, mappings);

    const headers = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.Header);

    const keys = columns
      .filter((col) => col.Header !== "#" && col.Header !== "Action")
      .map((col) => col.accessor);

    const filename = `${fileName}-${getCurrentDate()}`;
    printExportHelper(headers, keys, displayedData, filename);
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <div>
          {showExport && (
            <div className="flex space-x-4 bg-white rounded-lg shadow-sp">
              <ButtonExport
                label="Copy"
                onClick={() => {
                  handleCopy();
                }}
              />
              <ButtonExport
                label="Excel"
                onClick={() => {
                  handleDownloadExcel();
                }}
              />
              <ButtonExport
                label="PDF"
                onClick={() => {
                  handleDownloadPdf();
                }}
              />
              <ButtonExport
                label="Print"
                onClick={() => {
                  handlePrint();
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-between w-full space-x-4">
          <div className="flex items-center gap-4">
            {expandable && (
              <div className="flex space-x-2">
                <button
                  onClick={expandAll}
                  className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Collapse All
                </button>
              </div>
            )}

            <span className="text-sm text-gray-600">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value === -1) {
                  fetchData(0, totalRecords, true);
                  setPageSize(totalRecords);
                } else {
                  handlePageSizeChange(value);
                }
              }}
              className="px-2 py-1 text-sm bg-white border rounded"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={totalRecords}>All</option>
            </select>
            <span className="text-sm text-gray-600">Parent Rows</span>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            {onFilter && (
              <Button
                onClick={onFilter}
                variant="doff"
                icon={"Filter"}
                label={"Filter"}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {showLeftSearch && (
              <>
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value === -1) {
                      fetchData(0, totalRecords, true);
                      setPageSize(totalRecords);
                    } else {
                      handlePageSizeChange(value);
                    }
                  }}
                  className="px-2 py-1 text-sm bg-white border rounded"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={totalRecords}>All</option>
                </select>
                <span className="text-sm text-gray-600">Parent Rows</span>
                <SearchBar
                  searchTerm={searchTerm}
                  handleSearch={handleSearch}
                />
              </>
            )}
            {onButtonCompleteVisitor && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonCompleteVisitor}
              >
                Complete Visit
              </div>
            )}
            {onButtonPrintQR && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonPrintQR}
              >
                Print QR Code
              </div>
            )}
            {onButtonDriver && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonDriver}
              >
                Driver In/Out
              </div>
            )}
            {onButtonSpecialBehavior && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonSpecialBehavior}
              >
                Contractor Go Access
              </div>
            )}
            {onButtonContractorAccess && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonContractorAccess}
              >
                Contractor Access
              </div>
            )}
            {onButtonVisitorAccess && (
              <div
                className="rounded-full py-[4px] px-[18px] text-white font-[400] text-[14px] transition-transform duration-300 hover:scale-110 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(248.93deg, #1F36C7 36.09%, #001F82 100%)",
                }}
                onClick={onButtonVisitorAccess}
              >
                Visitor/Driver Access
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[8px] shadow-[0_0_10px_0_#0000001A]">
        <div className="overflow-x-auto ">
          {/* Table */}
          <table className="w-full" style={{ tableLayout: "auto" }}>
            {/* Table Header */}
            <thead className="bg-gray-100 border-b">
              <tr className="bg-gray-100">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    onClick={() =>
                      column.sortable && handleSort(column.accessor)
                    }
                    className={`
                    px-3 py-2 text-left whitespace-nowrap text-xs font-bold text-gray-700 tracking-wider
                    ${
                      column.accessor !== "actions" && column.sortable
                        ? "cursor-pointer hover:bg-gray-200"
                        : ""
                    }
                  `}
                  >
                    {column.Header}
                    {column.accessor !== "actions" && column.sortable && (
                      <span className="inline-flex items-center ml-2">
                        {sortConfig.key === column.accessor &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUp size={12} className="text-gray-700" />
                          ) : (
                            <ArrowDown size={12} className="text-gray-700" />
                          ))}
                      </span>
                    )}
                  </th>
                ))}
                {(onEdit || onDelete || onUnreg) && (
                  <th className="px-3 py-2 text-xs font-bold tracking-wider text-center text-gray-700 uppercase">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-xs bg-white divide-y divide-gray-200">
              {isChangingPage || isLoading ? (
                <TableSkeleton
                  rowsCount={displayData.length > 0 ? displayData.length : 10}
                  columnsLength={columns.length}
                />
              ) : displayData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + (onEdit || onDelete || onUnreg ? 1 : 0)
                    }
                    className="px-3 py-2 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <FileX size={24} className="text-gray-400" />
                      </div>
                      <span className="text-sm">No data available</span>
                    </div>
                  </td>
                </tr>
              ) : (
                displayData.map((row, rowIndex) => {
                  const isParentRow = row._level === 0;
                  const parentRowIndex = isParentRow
                    ? processedParentData.findIndex(
                        (parent) =>
                          parent[primaryKeyAccessor] === row[primaryKeyAccessor]
                      )
                    : null;
                  const displayRowNumber = isParentRow
                    ? currentPage * pageSize + parentRowIndex + 1
                    : null;

                  return (
                    <tr
                      key={row[primaryKeyAccessor] || rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 ${
                        onClickRow ? "cursor-pointer" : ""
                      }`}
                      onClick={onClickRow ? () => onClickRow(row) : undefined}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-3 py-2 text-xs text-gray-600 whitespace-nowrap ${
                            column.Header === "#" ? "w-20" : ""
                          }`}
                          style={{
                            paddingLeft:
                              colIndex === 0
                                ? `${(row._level || 0) * 20 + 12}px`
                                : undefined,
                          }}
                        >
                          <div className="flex items-center">
                            {colIndex === 0 && expandable && (
                              <span className="inline-flex items-center mr-2">
                                {row._hasChildren ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRowExpansion(
                                        row[primaryKeyAccessor]
                                      );
                                    }}
                                    className="p-1 rounded hover:bg-gray-200"
                                  >
                                    {expandedRows.has(
                                      row[primaryKeyAccessor]
                                    ) ? (
                                      <CircleChevronDown
                                        size={14}
                                        color="#171C26"
                                      />
                                    ) : (
                                      <CircleChevronRight
                                        size={14}
                                        color="#171C26"
                                      />
                                    )}
                                  </button>
                                ) : (
                                  <span className="w-6 h-6" />
                                )}
                              </span>
                            )}

                            {column.Header === "#"
                              ? displayRowNumber || ""
                              : column.Cell
                              ? column.Cell({ row: { original: row } })
                              : typeof row[column.accessor] === "string" &&
                                row[column.accessor]?.length > 50
                              ? `${row[column.accessor].slice(0, 50)}...`
                              : row[column.accessor]}
                          </div>
                        </td>
                      ))}

                      {(onEdit || onDelete || onUnreg) && (
                        <td className="w-20 px-3 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            {onUnreg && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUnreg(row[primaryKeyAccessor]);
                                }}
                                className="text-orange-500 hover:text-orange-700"
                              >
                                <ArchiveX size={15} />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(row);
                                }}
                                title="Edit Data"
                                className="text-indigo-500 hover:text-indigo-700"
                              >
                                <Edit size={15} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                title="Delete Data"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(row[primaryKeyAccessor], row);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-600">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, totalRecords)} of{" "}
              {totalRecords} parent records
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
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
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`
                  px-3 py-1 border rounded min-w-[40px]
                  ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }
                `}
                  >
                    {pageNumber + 1}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize) - 1}
              className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
