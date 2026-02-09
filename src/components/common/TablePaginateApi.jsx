import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArchiveX,
  FileX,
  QrCode,
  Eye, EyeOff,
  Filter,
  ChevronDown,
  Keyboard,
  Table,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from "lucide-react";
import ActionButtons from "./ActionButtons";
import { exportToExcel } from "../../utils/export/excelExportHelper";
import { copyToClipboard } from "../../utils/export/copyClipboardHelper";
import { pdfExportHelper } from "../../utils/export/pdfExportHelper";
import { printExportHelper } from "../../utils/export/printExportHelper";
import SearchBar from "./SearchBar";
import TableSkeleton from "../skeleton/TableSkeleton";
import Button from "./Button";
import { useHotkeys } from 'react-hotkeys-hook';

const SortableColumnChip = ({ col, toggleColumn }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.accessor });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all select-none
        ${col.visible !== false
          ? "bg-white border-gray-300 text-gray-700 shadow-sm"
          : "bg-gray-50 border-gray-200 text-gray-400 opacity-60"}
      `}
    >
      {/* Area Grip untuk Drag */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded">
        <GripVertical size={14} className="text-gray-400" />
      </div>

      <span className="text-xs font-medium" onClick={() => toggleColumn(col.accessor)}>
        {col.Header}
      </span>

      <div onClick={() => toggleColumn(col.accessor)} className="cursor-pointer hover:bg-gray-100 p-1 rounded">
        {col.visible !== false ? (
          <Eye size={14} className="text-gray-500" />
        ) : (
          <EyeOff size={14} className="text-gray-300" />
        )}
      </div>
    </div>
  );
};

export default function TablePaginateApi({
  data = [],
  dataExcel = [],
  columns,
  onEdit,
  onDelete,
  onUnreg,
  onQR,
  onRefresh,
  onPrint,
  onDetail,
  primaryKeyAccessor = "id",
  isReadonly = false,
  onClickRow,
  fileName = "Export",
  exportHeaders = [],
  exportKeys = [],
  totalRecords = 0,
  currentPage = 0,
  currentPageSize = 10,
  fetchData, // Ini adalah runLoadData dari useFetch
  isChangingPage,
  isLoading,
  isNoExport = false,
  textLeft,
  searchTerm,
  handleSearch,
  maxHeight,
  exportTitle,
  ...props
}) {
  const [pageSize, setPageSize] = useState(currentPageSize);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [columnConfigs, setColumnConfigs] = useState(columns);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setPageSize(currentPageSize);
  }, [currentPageSize]);

  useEffect(() => {
    if (columns && columns.length > 0) {
      setColumnConfigs(columns);
    }
  }, [columns]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsTooltipOpen(false);
        setIsSettingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (accessor) => {
    setColumnConfigs(prev => prev.map(col =>
      col.accessor === accessor ? { ...col, visible: !col.visible } : col
    ));
  };

  // Fungsi Reset (Kembali ke default)
  const handleReset = () => {
    setColumnConfigs(columns); // initialColumns adalah konstanta awal Anda
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnConfigs((items) => {
        const oldIndex = items.findIndex((i) => i.accessor === active.id);
        const newIndex = items.findIndex((i) => i.accessor === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sortedData = useMemo(() => {
    return data;
  }, [data]);

  // -----------------------------------------------------------
  // UPDATE 1: Handle Sort mengirim Object ke useFetch
  // -----------------------------------------------------------
  const handleSort = useCallback((key) => {
    let direction = "asc";

    // Toggle logic
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    // Update UI State
    setSortConfig({ key, direction });

    // Panggil useFetch
    if (fetchData) {
      // param 1: pageIndex (reset ke 0)
      // param 2: pageSize
      // param 3: isPaging (true men-trigger loading paging)
      // param 4: overrideParams (OBJECT berisi filter tambahan)
      fetchData(0, pageSize, true, {
        sort_by: key,
        sort_direction: direction
      });
    }
  }, [sortConfig, fetchData, pageSize]);

  // -----------------------------------------------------------
  // UPDATE 2: Page Size Change tidak perlu kirim sort manual
  // karena useFetch sudah menyimpan state queryParams
  // -----------------------------------------------------------
  const handlePageSizeChange = useCallback(
    (newSize) => {
      setPageSize(newSize);
      if (fetchData) {
        fetchData(0, newSize, true);
      }
    },
    [fetchData]
  );

  // -----------------------------------------------------------
  // UPDATE 3: Page Change juga tidak perlu kirim sort manual
  // -----------------------------------------------------------
  const handlePageChange = useCallback(
    (newPage) => {
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
    // stats: {
    //   U: "In Use",
    //   A: "Active",
    //   I: "Inactive",
    //   D: "Damaged",
    //   M: "Missing",
    // },
    // type1: {
    //   V: "Visitor",
    //   E: "Employee",
    //   K: "Contractor",
    // },
  };

  //? Handle Copy to Clipboard
  const handleCopy = () => {
    const displayedData =
      dataExcel && dataExcel.length > 0
        ? transformData(dataExcel, mappings)
        : transformData(sortedData, mappings);

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

    copyToClipboard(displayedData, headers, keys);
  };

  //? Handle Download Excel
  const handleDownloadExcel = () => {
    const displayedData =
      dataExcel && dataExcel.length > 0
        ? transformData(dataExcel, mappings)
        : transformData(sortedData, mappings);

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

    const filename = `${fileName}-${getCurrentDate()}`;
    exportToExcel(displayedData, headers, keys, filename);
  };

  //? Handle Download PDF
  const handleDownloadPdf = () => {
    const displayedData =
      dataExcel && dataExcel.length > 0
        ? transformData(dataExcel, mappings)
        : transformData(sortedData, mappings);

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

    const filename = `${fileName}-${getCurrentDate()}`;
    pdfExportHelper(headers, keys, displayedData, filename, exportTitle);
  };

  //? Handle Print
  const handlePrint = () => {
    const displayedData =
      dataExcel && dataExcel.length > 0
        ? transformData(dataExcel, mappings)
        : transformData(sortedData, mappings);

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

    const filename = `${fileName}-${getCurrentDate()}`;
    printExportHelper(headers, keys, displayedData, filename);
  };

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

  const ShortcutItem = ({ icon, title, desc, keys }) => (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600 border border-gray-100">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-700">{title}</span>
          <span className="text-[11px] text-gray-500">{desc}</span>
        </div>
      </div>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-1 min-w-[30px] text-center bg-[#4F7DFF] text-white text-[10px] font-bold rounded shadow-sm flex items-center justify-center"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useHotkeys('shift+k', () => setIsSettingOpen(!isSettingOpen))
  useHotkeys('shift+d', handleDownloadExcel)
  useHotkeys('shift+n', props.onAddData)
  useHotkeys('shift+f', props.onFilter)
  useHotkeys('alt+c', focusSearch)
  useHotkeys('alt+n', () => handlePageChange(currentPage + 1))
  useHotkeys('alt+b', () => handlePageChange(currentPage - 1))

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Search and Page Size Controls */}
      <div className="flex flex-col items-start justify-between gap-2 mt-2 mb-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex flex-row items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-2">
          <div className="shadow-[0px_0px_10px_4px_#0000000F] bg-white rounded-[6px]">
            <button onClick={() => setIsTooltipOpen(!isTooltipOpen)} className="flex items-center gap-1.5 px-2.5 py-[10px] rounded-l-[6px] text-xs transition-colors hover:bg-gray-50 bg-white">
              <Keyboard className="w-3 h-3 text-gray-600" />
              <span className="font-medium text-gray-700">
                Shortcut
              </span>
            </button>
            <AnimatePresence>
              {isTooltipOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-8 mt-3 z-50 w-[750px] p-5 bg-white rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.15)] border border-gray-100"
                >
                  {/* Judul */}
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Keyboard Shortcut</h3>

                  {/* Grid Shortcut */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Item Shortcut */}
                    <ShortcutItem
                      icon={<Table className="w-5 h-5" />}
                      title="Pengaturan Tabel"
                      desc="Buka panel pengaturan tabel"
                      keys={["Shift", "K"]}
                    />
                    <ShortcutItem
                      icon={<Download className="w-5 h-5" />}
                      title="Download Data"
                      desc="Unduh data dalam format Excel/CSV"
                      keys={["Shift", "D"]}
                    />
                    <ShortcutItem
                      icon={<Filter className="w-5 h-5" />}
                      title="Filter Data"
                      desc="Buka panel filter data"
                      keys={["Shift", "F"]}
                    />
                    <ShortcutItem
                      icon={<Plus className="w-5 h-5" />}
                      title="Tambah Data"
                      desc="Buka form untuk menambah data baru"
                      keys={["Shift", "N"]}
                    />
                    <ShortcutItem
                      icon={<Search className="w-5 h-5" />}
                      title="Cari Data"
                      desc="Fokus ke kolom pencarian"
                      keys={["Alt", "C"]}
                    />
                    <ShortcutItem
                      icon={<ChevronLeft className="w-5 h-5" />}
                      title="Halaman Sebelumnya"
                      desc="Navigasi ke halaman sebelumnya"
                      keys={["Alt", "B"]}
                    />
                    <ShortcutItem
                      icon={<ChevronRight className="w-5 h-5" />}
                      title="Halaman Selanjutnya"
                      desc="Navigasi ke halaman selanjutnya"
                      keys={["Alt", "N"]}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="shadow-[0px_0px_10px_4px_#0000000F] bg-white rounded-[6px]">
            <button className="flex items-center gap-1.5 px-2.5 py-[10px] rounded-l-[6px] text-xs transition-colors hover:bg-gray-50 bg-white">
              <Table onClick={() => setIsSettingOpen(!isSettingOpen)} className="w-4 h-4 text-gray-600" />
            </button>
            <AnimatePresence>
              {isSettingOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-3 z-[60] w-[650px] p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 text-left">Pengaturan Tabel</h3>
                  <p className="text-sm text-gray-500 mb-4 text-left">Pengaturan Kolom</p>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="flex flex-wrap gap-2 mb-8 p-4 border border-dashed border-gray-200 rounded-lg min-h-[60px] bg-gray-50/50">
                      <SortableContext items={columnConfigs.map(c => c.accessor)} strategy={horizontalListSortingStrategy}>
                        {columnConfigs.map((col) => (
                          <SortableColumnChip key={col.accessor} col={col} toggleColumn={toggleColumn} />
                        ))}
                      </SortableContext>
                    </div>
                  </DndContext>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button onClick={handleReset} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm">Atur Ulang</button>
                    <button className="px-5 py-2 bg-[#1E293B] text-white rounded-lg font-bold text-sm">Simpan</button>
                    <button onClick={() => setIsSettingOpen(false)} className="px-5 py-2 bg-[#4F7DFF] text-white rounded-lg font-bold text-sm shadow-md">Terapkan</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 shadow-[0px_0px_10px_4px_#0000000F] bg-white rounded-[6px]">
            <div className="relative border-r-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-2.5 py-[10px] rounded-l-[6px] text-xs transition-colors hover:bg-gray-50 bg-white"
              >
                <Filter className="w-3 h-3 text-gray-600" />
                <span className="font-medium text-gray-700">
                  {pageSize === totalRecords ? "All" : pageSize}
                </span>

                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 z-10 min-w-full mt-1 text-xs bg-white border border-gray-300 rounded-md shadow-lg top-full">
                  <button
                    onClick={() => {
                      handlePageSizeChange(10);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {10}
                  </button>
                  <button
                    onClick={() => {
                      handlePageSizeChange(50);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {50}
                  </button>
                  <button
                    onClick={() => {
                      handlePageSizeChange(100);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 text-left transition-colors hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                  >
                    {100}
                  </button>
                  <button
                    onClick={() => {
                      handlePageSizeChange(totalRecords);
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
              <SearchBar ref={searchInputRef} searchTerm={searchTerm} handleSearch={handleSearch} />
            </div>
          </div>
        </div>

        <ActionButtons
          {...props}
          {...(!props.disabledDownload && { onDownload: handleDownloadExcel })}
        />
      </div>

      <div className="rounded-[8px] shadow-[0_0_10px_0_#0000001A]">
        {/* Table */}
        <div
          className="
    overflow-x-auto rounded rounded-t-[8px]
    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-500
    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full
  "
          style={{
            maxHeight: maxHeight || undefined,
            overflow: maxHeight ? "auto" : undefined,
          }}
        >
          <table className="w-full" style={{ tableLayout: "auto" }}>
            {/* Table Header */}
            <thead className="bg-gray-100 border-b">
              <tr className="bg-gray-100">
                {columnConfigs.map((column, index) => (
                  column.visible !== false && (
                    <th
                      key={index}
                      onClick={() =>
                        column.sortable && handleSort(column.accessor)
                      }
                      className={`
                          px-[10px] whitespace-nowrap ${column.alignRight ? "text-right" : ""
                        } ${column.alignCenter ? "text-center" : ""
                        } py-[5px] text-left text-xs font-bold text-gray-700 capitalize tracking-wider
                          ${column.accessor !== "actions" && column.sortable
                          ? "cursor-pointer hover:bg-gray-200"
                          : ""
                        }
                    `}
                    >
                      {typeof column.Header === "function"
                        ? column.Header()
                        : column.Header}
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
                  )
                ))}
                {(onEdit ||
                  onDelete ||
                  onUnreg ||
                  onQR ||
                  onRefresh ||
                  onDetail) && (
                    <th className="px-[10px] py-[7px] text-xs font-bold tracking-wider text-center capitalize text-gray-700">

                    </th>
                  )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-xs divide-y divide-gray-200">
              {isChangingPage || isLoading ? (
                <TableSkeleton
                  rowsCount={sortedData.length > 0 ? sortedData.length : 10}
                  columnsLength={columns.length}
                />
              ) : sortedData.length > 0 ? (
                sortedData.map((row, rowIndex) => (
                  <tr
                    key={row[primaryKeyAccessor] || rowIndex}
                    className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 ${onClickRow ? "cursor-pointer" : ""} ${columns.some((col) =>
                        col.isSelected?.({ row: { original: row } }),
                      )
                        ? "!bg-gray-200/60"
                        : ""
                      }`}
                    onClick={onClickRow ? () => onClickRow(row) : undefined}
                  >
                    {columnConfigs.map((column, colIndex) => (
                      column.visible !== false && (
                        <td
                          key={colIndex}
                          className={`whitespace-nowrap px-[10px] py-[2px] text-xs text-gray-600 ${column.alignRight ? "text-right" : ""
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
                          ) : !row[column.accessor] ||
                            row[column.accessor] === "" ? (
                            <span className="italic text-gray-400">
                              ~
                            </span>
                          ) : typeof row[column.accessor] === "string" &&
                            row[column.accessor].length > 50 ? (
                            `${row[column.accessor]}...`
                          ) : (
                            row[column.accessor]
                          )}
                        </td>
                      )
                    ))}

                    {(onEdit ||
                      onDelete ||
                      onUnreg ||
                      onQR ||
                      onRefresh ||
                      onDetail) && (
                        <td className="px-[10px] py-[4px] text-center">
                          <div className="flex justify-center space-x-2">
                            {onRefresh && (
                              <button
                                onClick={() => onRefresh(row)}
                                className="text-green-500 transition-colors hover:text-green-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucideCalendarSyncIcon lucideCalendarSync"
                                >
                                  <path d="M11 10v4h4" />
                                  <path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" />
                                  <path d="M16 2v4" />
                                  <path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" />
                                  <path d="M21 22v-4h-4" />
                                  <path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" />
                                  <path d="M3 10h4" />
                                  <path d="M8 2v4" />
                                </svg>
                              </button>
                            )}
                            {onQR && (
                              <button
                                onClick={() => onQR(row)}
                                className="text-blue-500 transition-colors hover:text-blue-700"
                              >
                                <QrCode size={15} />
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
                              <button
                                title="Delete Data"
                                onClick={() => onDelete(row[primaryKeyAccessor])}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                            {onDetail && (
                              <button
                                title="Detail Data"
                                onClick={() => onDetail(row)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Eye size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-4 text-xs text-center text-gray-500 whitespace-nowrap"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <FileX size={24} className="text-gray-400" />
                      </div>
                      <span className="text-sm">No data available</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-[10px] py-[10px] border-t bg-gray-50 rounded-b-[8px]">
          <div className="flex flex-col gap-[10px]">
            <div className="mt-2 text-xs text-gray-600">
              Menampilkan {sortedData.length > 0 ? currentPage * pageSize + 1 : 0}{" "}
              - {Math.min((currentPage + 1) * pageSize, totalRecords)} data dari{" "}
              {totalRecords} data
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 border rounded disabled:opacity-50 whitespace-nowrap"
            >
              Kembali
            </button>

            <div className="flex space-x-2 overflow-x-auto">
              {getPageNumbers().map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs font-medium border-t border-b border-gray-300"
                  >
                    {pageNum}
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`
                  px-3 py-1 border rounded min-w-[40px]
                  ${currentPage === pageNum
                        ? "bg-[#1F2937] text-white"
                        : "bg-white text-[#1F2937]"
                      }
                `}
                  >
                    {pageNum + 1}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize) - 1}
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