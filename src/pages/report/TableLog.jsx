import { useState, useCallback, useMemo } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Swal from "sweetalert2";
import Modal from "../../components/common/Modal";
import { useFetch } from "../../hooks/useFetch";
import TablePaginateApi from "../../components/common/TablePaginateApi";
import { useSearchParams } from "react-router-dom";
import { getTableLogs } from "../../services/report/repTableLog";
import NotesModalJson from "../../components/common/NotesModalJson";
import { FileText } from "lucide-react";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";

export default function RepTableLog() {
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const { name1 } = useBreadcrumb();

  const [searchParams] = useSearchParams();
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterData, setFilterData] = useState({
    date_from: searchParams.get("date_from") ?? getTodayDateString(),
    date_to: searchParams.get("date_to") ?? getTodayDateString(),
  });
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    notes: "",
    title: "",
    title2: "",
  });

  const openNotesModal = (notes, title, title2) => {
    setNotesModal({
      isOpen: true,
      notes: notes,
      title: title,
      title2: title2,
    });
  };

  const closeNotesModal = () => {
    setNotesModal({
      isOpen: false,
      notes: "",
      title: "",
      title2: "",
    });
  };

  //? Common Handle Change
  const handleChange = useCallback((name, value) => {
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  //? Common Handle Change End

  const handleFilterData = useCallback(() => {
    setIsModalFilterOpen(true);
  }, []);

  const inputsFilter = useMemo(
    () => [
      {
        name: "date_from",
        label: "Date From",
        type: "date",
        maxValue: "date_to",
        placeholder: "Select start date",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
      {
        name: "date_to",
        label: "Date To",
        type: "date",
        placeholder: "Select end date",
        minValue: "date_from",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
    ],
    [handleChange]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Table Name",
        accessor: "tblnm",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Action",
        accessor: "actnm",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Primary Key",
        accessor: "keyid",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Old Value",
        accessor: "oldvl",
        sortable: true,
        className: "text-left",
        Cell: ({ row }) =>
          row.original.oldvl ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-900 truncate max-w-[100px]">
                {row.original.oldvl.length > 20
                  ? `${row.original.oldvl.substring(0, 20)}...`
                  : row.original.oldvl}
              </span>
              <button
                onClick={() =>
                  openNotesModal(
                    row.original.oldvl,
                    row.original.tblnm,
                    "Old Value"
                  )
                }
                className="flex items-center justify-center p-1 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                title="View full notes"
              >
                <FileText size={12} className="text-blue-600" />
              </button>
            </div>
          ) : (
            <span className="italic text-gray-400">No Old Value available</span>
          ),
      },
      {
        Header: "New Value",
        accessor: "newvl",
        sortable: true,
        className: "text-left",
        Cell: ({ row }) =>
          row.original.newvl ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-900 truncate max-w-[100px]">
                {row.original.newvl.length > 20
                  ? `${row.original.newvl.substring(0, 20)}...`
                  : row.original.newvl}
              </span>
              <button
                onClick={() =>
                  openNotesModal(
                    row.original.newvl,
                    row.original.tblnm,
                    "New Value"
                  )
                }
                className="flex items-center justify-center p-1 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                title="View full notes"
              >
                <FileText size={12} className="text-blue-600" />
              </button>
            </div>
          ) : (
            <span className="italic text-gray-400">No New Value available</span>
          ),
      },
      {
        Header: "Date",
        accessor: "crtdt",
        sortable: true,
        className: "text-left",
      },
    ],
    []
  );

  // Fetch
  const {
    data: datas,
    pageIndex,
    pageSize,
    pageCount,
    totalRecords,
    loading,
    isChangingPage,
    error,
    loadData,
    reload,
  } = useFetch({
    fetchFn: getTableLogs,
    defaultQueryParams: {
      date_from: getTodayDateString(),
      date_to: getTodayDateString(),
    },
    deps: [],
  });

  const handleRefresh = async () => {
    await reload();

    handleModalSubmitFilter(filterData);
  };

  const handleModalSubmitFilter = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const preparedFilters = { ...filterData };

      setFilterData(preparedFilters);

      loadData(0, pageSize, true, preparedFilters);

      setIsModalFilterOpen(false);

      await Swal.fire({
        icon: "success",
        title: "Filters Applied",
        text: "Your filters have been successfully applied.",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An unexpected error has occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [filterData, loadData, pageSize]);

  return (
    <main className="min-h-screen px-4 py-2 mx-auto max-w-screen-2xl lg:px-4 bg-gray-50/20">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Breadcrumbs />
        <ActionButtons
          onFilter={handleFilterData}
          showAddData={false}
          onRefresh={handleRefresh}
          showUploadExcel={false}
        />
      </div>

      <TablePaginateApi
        data={datas}
        columns={columns}
        isLoading={loading}
        error={error}
        pageCount={pageCount}
        totalRecords={totalRecords}
        currentPage={pageIndex}
        currentPageSize={pageSize}
        fetchData={loadData}
        isChangingPage={isChangingPage}
        fileName="Export-Report-In-Out"
      />

      <Modal
        isOpen={isModalFilterOpen}
        onClose={() => setIsModalFilterOpen(false)}
        onSubmitSuccess={handleModalSubmitFilter}
        inputs={inputsFilter}
        endpoint="datas/"
        modalType={"filter"}
        formDataParent={filterData}
        isSubmitting={isSubmitting}
        title={`Filter ${name1}`}
      />

      <NotesModalJson
        isOpen={notesModal.isOpen}
        onClose={closeNotesModal}
        notes={notesModal.notes}
        title={notesModal.title}
        title2={notesModal.title2}
      />
    </main>
  );
}
