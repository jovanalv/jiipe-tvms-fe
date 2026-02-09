import { useState, useEffect, useCallback, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import TablePaginateApi from "../../components/common/TablePaginateApi";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createArea,
  getAreas,
  updateArea,
  deleteArea
} from "../../services/master/mstAreaService";
import useModalState from "../../hooks/useModalState";
import FilterModal from "../../components/common/ModalFilter";

/**
 * MasterData Component
 *
 * General component for managing master data.
 * Provides CRUD (Create, Read, Update) functionality for various master data entities
 * with a user-friendly interface using table and modal components.
 *
 * Key Features:
 * - Display master data in table format
 * - Add new records through modal
 * - Edit existing records
 * - Export data to supported formats
 * - Includes loading states and error handling
 *
 * @returns {JSX.Element} React component for Master Data management page
 */
export default function MasterArea() {
  const { name1 } = useBreadcrumb();
  const { modals, openModal, closeModal } = useModalState({
    isModalOpen: false,
  });
  const [areas, setAreas] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // Define Table Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
        className: "text-left",
        style: { width: "50px" },
        visible: true,
      },
      {
        Header: "ID Lokasi",
        accessor: "loc_id",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
        visible: true,
      },
      {
        Header: "Nama Lokasi",
        accessor: "name1",
        sortable: true,
        className: "text-left",
        visible: true,
      },
      {
        Header: "GPS Latitude",
        accessor: "latitude",
        sortable: true,
        className: "text-left",
        visible: true,
      },
      {
        Header: "GPS Longitude",
        accessor: "longitude",
        sortable: true,
        className: "text-left",
        visible: true,
      },
      {
        Header: "Radius Geofencing (m)",
        accessor: "radius",
        sortable: true,
        className: "text-left",
        visible: true,
      },
    ],
    []
  );

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
    searchTerm,
    handleSearch,
    filterData,
    setFilterData,
  } = useFetch({
    fetchFn: getAreas,
    deps: [],
  });

  // Initial Fetch Data
  // const fetchData = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const [areasData] = await Promise.all([getAreas()]);
  //     setAreas(areasData.data);
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // Define Input Field for Modal
  const inputs = useMemo(
    () => [
      {
        name: "loc_id",
        label: "ID Lokasi",
        type: "text",
        disabled: !!currentData,
        autofocus: true,
        maxLength: 15,
        placeholder: "Masukkan ID Lokasi",
        required: true,
      },
      {
        name: "name1",
        label: "Nama Lokasi",
        type: "text",
        maxLength: 50,
        placeholder: "Masukkan Nama Lokasi",
        required: true,
      },
      {
        name: "latitude",
        label: "GPS Latitude",
        type: "number",
        maxLength: 15,
        placeholder: "Masukkan Latitude",
        required: true,
      },
      {
        name: "longitude",
        label: "GPS Longitude",
        type: "number",
        maxLength: 15,
        placeholder: "Masukkan Longitude",
        required: true,
      },
      {
        name: "radius",
        label: "Radius Geofencing (meter)",
        type: "number",
        maxLength: 5,
        placeholder: "Masukkan Radius",
        required: true,
      },
    ],
    [currentData]
  );

  const handleChange = useCallback((name, value) => {
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const inputsFilter = useMemo(
    () => [
      {
        name: "loc_id",
        label: "ID Lokasi",
        type: "text",
        maxLength: 15,
        placeholder: "Masukkan ID Lokasi",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
      {
        name: "name1",
        label: "Nama Lokasi",
        type: "text",
        maxLength: 50,
        placeholder: "Masukkan Nama Lokasi",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
      {
        name: "latitude",
        label: "GPS Latitude",
        type: "number",
        maxLength: 15,
        placeholder: "Masukkan Latitude",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
      {
        name: "longitude",
        label: "GPS Longitude",
        type: "number",
        maxLength: 15,
        placeholder: "Masukkan Longitude",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
      {
        name: "radius",
        label: "Radius Geofencing (meter)",
        type: "number",
        maxLength: 5,
        placeholder: "Masukkan Radius",
        onChange: (e) => handleChange(e.target.name, e.target.value),
      },
    ],
    [handleChange]
  );

  // Trigger Add Modal
  const handleAddData = useCallback(() => {
    setCurrentData(null);
    openModal("isModalOpen");
  }, [openModal]);

  // Trigger Edit Modal
  const handleEdit = useCallback(
    (dataToEdit) => {
      setCurrentData(dataToEdit);
      openModal("isModalOpen");
    },
    [openModal]
  );

  // Handle modal form submission
  const handleModalSubmit = useCallback(
    async (newData) => {
      try {
        setIsSubmitting(true);

        if (currentData) {
          await updateArea(currentData.loc_id, newData);
        } else {
          await createArea(newData);
        }

        await reload();
        closeModal("isModalOpen");
        setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: currentData
            ? `${name1} berhasil diubah`
            : `${name1} berhasil ditambahkan`,
        });
      } catch (error) {
        console.error("Error submitting data:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to save data",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentData, reload, name1, closeModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `${name1} akan dihapus secara permanen!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;
      try {
        setIsSubmitting(true);

        await deleteArea(id);

        await reload();
        closeModal("isModalOpen");
        setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: `${name1} berhasil dihapus!`,
        });
      } catch (error) {
        console.error("Error submitting data:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Gagal menghapus data",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [reload, name1, closeModal],
  );

  const handleModalSubmitFilter = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const preparedFilters = { ...filterData };

      setFilterData(preparedFilters);

      loadData(0, pageSize, true, preparedFilters);

      setIsModalFilterOpen(false);

      await Swal.fire({
        icon: "success",
        // title: "Filters Applied",
        text: "Filter berhasil diterapkan.",
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

  const handleFilterData = useCallback(() => {
    setIsModalFilterOpen(true);
  }, []);

  return (
    <main className="min-h-screen px-4 py-2 mx-auto max-w-screen-2xl lg:px-4 bg-gray-50/20">
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
        primaryKeyAccessor="loc_id"
        fileName={`Export ${name1}`}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        // onDownload={true}
        onFilter={handleFilterData}
        onAddData={handleAddData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modals.isModalOpen}
        onClose={() => closeModal("isModalOpen")}
        onSubmitSuccess={handleModalSubmit}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="areas/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah ${name1}` : `Tambah ${name1}`}
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
    </main>
  );
}
