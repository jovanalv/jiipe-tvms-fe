import { useState, useMemo, useCallback } from "react";
import {
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArchiveX,
  FileX,
  SquareArrowUpRight,
  ScanQrCode,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import { exportToExcel } from "../../utils/export/excelExportHelper";
import { copyToClipboard } from "../../utils/export/copyClipboardHelper";
import { pdfExportHelper } from "../../utils/export/pdfExportHelper";
import { printExportHelper } from "../../utils/export/printExportHelper";
import ActionButtons from "./ActionButtons";
import TableSkeleton from "../skeleton/TableSkeleton";

export default function Table({
  data = [],
  dataExcel = [],
  columns,
  onEdit,
  onDelete,
  onUnreg,
  onShare,
  onQR,
  primaryKeyAccessor = "id",
  onClickRow,
  fileName = "Export",
  isLoading,
  exportHeaders = [],
  exportKeys = [],
  ...props
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSearch = useCallback((e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(0);
  }, []);

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

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = [...data];

    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm),
        ),
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "actions") return 0;

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

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Page count calculation
  const pageCount = useMemo(
    () => Math.ceil(processedData.length / pageSize),
    [processedData, pageSize],
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

  //? Handle Copy to Clipboard
  const handleCopy = () => {
    const headers =
      exportHeaders.length > 0
        ? exportHeaders
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.Header);

    const keys =
      exportKeys.length > 0
        ? exportKeys
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.accessor);

    const displayedData = dataExcel && dataExcel.length > 0 ? dataExcel : data;
    copyToClipboard(displayedData, headers, keys);
  };

  //? Handle Download Excel
  const handleDownloadExcel = () => {
    const headers =
      exportHeaders.length > 0
        ? exportHeaders
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.Header);

    const keys =
      exportKeys.length > 0
        ? exportKeys
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.accessor);

    const displayedData = dataExcel && dataExcel.length > 0 ? dataExcel : data;
    const file = `${fileName}-${getCurrentDate()}`;
    exportToExcel(displayedData, headers, keys, file);
  };

  //? Handle Download PDF
  const handleDownloadPdf = () => {
    const headers =
      exportHeaders.length > 0
        ? exportHeaders
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.Header);

    const keys =
      exportKeys.length > 0
        ? exportKeys
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.accessor);

    const displayedData = dataExcel && dataExcel.length > 0 ? dataExcel : data;
    const file = `${fileName}-${getCurrentDate()}`;
    pdfExportHelper(headers, keys, displayedData, file);
  };

  //? Handle Print
  const handlePrint = () => {
    const headers =
      exportHeaders.length > 0
        ? exportHeaders
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.Header);

    const keys =
      exportKeys.length > 0
        ? exportKeys
        : columns
            .filter((col) => col.Header !== "#" && col.Header !== "Action")
            .map((col) => col.accessor);

    const displayedData = dataExcel && dataExcel.length > 0 ? dataExcel : data;
    const file = `${fileName}-${getCurrentDate()}`;
    printExportHelper(headers, keys, displayedData, file);
  };

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
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Search and Page Size Controls */}
      <div className="flex flex-col items-start justify-between gap-2 mt-2 mb-4 sm:flex-row sm:items-center sm:gap-0">
        {!props.disabledSearch && (
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 shadow-[0px_0px_10px_4px_#0000000F] bg-white rounded-[6px]">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-2.5 py-[10px] rounded-l-[6px] text-xs transition-colors hover:bg-gray-50 bg-white"
              >
                <Filter className="w-3 h-3 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {pageSize === processedData.length ? "All" : pageSize}
                </span>

                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 z-10 min-w-full mt-1 text-xs bg-white border border-gray-300 rounded-md shadow-lg top-full">
                  <button
                    onClick={() => {
                      setPageSize(10);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {10}
                  </button>
                  <button
                    onClick={() => {
                      setPageSize(50);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {50}
                  </button>
                  <button
                    onClick={() => {
                      setPageSize(100);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {100}
                  </button>
                  <button
                    onClick={() => {
                      setPageSize(processedData.length);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {"All"}
                  </button>
                </div>
              )}
            </div>

            <div>
              <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            </div>
          </div>
        )}

        <ActionButtons
          {...props}
          {...(!props.disabledDownload)}
        />
      </div>

      <div className="rounded-[8px] shadow-[0_0_10px_0_#0000001A]">
        {/* Table */}
        <div
          className="overflow-x-auto rounded-t-[8px] [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar]:h-2        
        [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-500
                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
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
                    px-[10px] whitespace-nowrap py-[7px] text-left text-xs font-bold text-gray-700 capitalize tracking-wider
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
                            <ArrowUp size={12} className="text-primary" />
                          ) : (
                            <ArrowDown size={12} className="text-primary" />
                          ))}
                      </span>
                    )}
                  </th>
                ))}
                {(onEdit || onDelete || onUnreg || onShare || onQR) && (
                  <th className="px-[10px] py-[7px] text-xs font-bold tracking-wider text-center capitalize text-gray-700">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-xs divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton
                  rowsCount={
                    paginatedData.length > 0 ? paginatedData.length : 10
                  }
                  columnsLength={columns.length}
                />
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (onEdit || onDelete || onUnreg || onShare || onQR ? 1 : 0)
                    }
                    className="px-3 py-2 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <FileX size={24} className="text-gray-400" />
                      </div>
                      <span className="text-xs">No data available</span>
                    </div>
                  </td>
                </tr>
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
                        className={`whitespace-nowrap px-[10px] py-[2px] text-xs text-gray-600 ${
                          column.Header === "#" ? "w-20" : ""
                        } ${column.onEdit ? "cursor-pointer underline" : ""}`}
                        onClick={() => {
                          if (column.onEdit) {
                            column.onEdit(row);
                          }
                        }}
                      >
                        {column.Header === "#" ? (
                          rowIndex + 1 + currentPage * pageSize
                        ) : column.Cell ? (
                          column.Cell({ row: { original: row } })
                        ) : !row[column.accessor] ? (
                          <span className="italic text-gray-400">
                            No {column?.Header} assigned
                          </span>
                        ) : typeof row[column.accessor] === "string" &&
                          row[column.accessor].length > 50 ? (
                          `${row[column.accessor].slice(0, 50)}...`
                        ) : (
                          row[column.accessor]
                        )}
                      </td>
                    ))}

                    {(onEdit || onDelete || onUnreg || onShare || onQR) && (
                      <td className="w-20 p-2 text-center">
                        <div className="flex justify-center space-x-2">
                          {onQR && (
                            <button
                              onClick={() => onQR(row)}
                              className="text-green-500 hover:text-green-700"
                              title="QR Code Check-In Manual"
                            >
                              <ScanQrCode size={15} />
                            </button>
                          )}
                          {onShare && (
                            <button
                              onClick={() => onShare(row)}
                              className="text-green-500 hover:text-green-700"
                              title="QR Code Check-In Manual"
                            >
                              <SquareArrowUpRight size={15} />
                            </button>
                          )}
                          {onUnreg && (
                            <button
                              onClick={() => onUnreg(row[primaryKeyAccessor])}
                              className="text-orange-500 hover:text-orange-700"
                            >
                              <ArchiveX size={15} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              title="Edit Data"
                              className="text-[#F59E0B] hover:text-yellow-700"
                            >
                              <Edit size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <div
                              title="Delete Data"
                              onClick={() =>
                                onDelete(row[primaryKeyAccessor], row)
                              }
                              className="text-red-500 hover:text-red-700"
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
        <div className="flex items-center justify-between px-[10px] py-[10px] border-t bg-gray-50 rounded-b-[8px]">
          <div className="flex flex-col gap-[10px]">
            <div className="mt-2 text-xs text-gray-600">
              Menampilkan {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, processedData.length)} data dari{" "}
              {processedData.length} data
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
            >
              Kembali
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
                    onClick={() => setCurrentPage(pageNumber - 1)}
                    className={`
                  px-3 py-1 border rounded min-w-[40px]
                  ${
                    currentPage === pageNumber - 1
                      ? "bg-[#1F2937] text-white"
                      : "bg-white text-[#1F2937]"
                  }
                `}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))
              }
              disabled={currentPage >= pageCount - 1}
              className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}