import { useState, useEffect, useCallback, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import TablePaginateApi from "../../components/common/TablePaginateApi";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createRfid,
  getRfids,
  updateRfid,
  deleteRfid
} from "../../services/master/mstRfidService";
import useModalState from "../../hooks/useModalState";
import StatusBadge from "../../components/common/StatusBadge";
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
export default function MasterRfid() {
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
      // {
      //   Header: "Kode RFID",
      //   accessor: "rfid",
      //   sortable: true,
      //   className: "text-left",
      //   style: { width: "150px" },
      //   visible: true,
      // },
      {
        Header: "Nama RFID",
        accessor: "name1",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
        visible: true,
      },
      {
        Header: "Status",
        accessor: "stats",
        sortable: true,
        className: "text-left",
        visible: true,
        Cell: ({ row: { original } }) => <StatusBadge value={original.stats} />,
      },
      {
        Header: "Digunakan Oleh",
        accessor: "useby",
        sortable: true,
        className: "text-left",
        visible: true,
      },
      {
        Header: "Remarks",
        accessor: "remarks",
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
    fetchFn: getRfids,
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
        name: "rfid",
        label: "RFID",
        type: "hidden",
        placeholder: "Scan Kartu Anda...",
        required: currentData?.rfid ? false : true,
        scan: true, // <--- TAMBAHKAN INI (Penanda bahwa ini target scan)
        // 1. Saat edit (currentData ada), disable input karena RFID adalah ID unik
        disabled: !!currentData,
        // 2. Pastikan value terisi secara eksplisit jika auto-binding gagal
        value: currentData?.rfid || "",
      },
      {
        name: "name1",
        label: "No RFID",
        type: "text",
        maxLength: 15,
        placeholder: "Masukkan No RFID",
        required: true,
      },
      {
        name: "stats",
        label: "Status",
        type: "select",
        options: [
          { value: "A", label: "Active" },
          { value: "I", label: "Inactive" },
          { value: "D", label: "Damaged" },
          { value: "M", label: "Missing" },
        ],
        placeholder: "Pilih Status",
        required: true,
      },
      {
        name: "remarks",
        label: "Remarks",
        type: "textarea",
        maxLength: 255,
        placeholder: "Masukkan Remarks",
        // required: true,
      },
    ],
    [currentData]
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
      console.log("Editing data:", dataToEdit);
    },
    [openModal]
  );

  // Handle modal form submission
  const handleModalSubmit = useCallback(
    async (newData) => {
      // 1. Validasi tetap sama
      if (!newData.rfid) { // Shorthand untuk null/empty string check
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Scan RFID terlebih dahulu",
        });
        return;
      }

      try {
        setIsSubmitting(true);

        // 2. Eksekusi API
        if (currentData) {
          await updateRfid(currentData.rfid, newData);
        } else {
          await createRfid(newData);
        }

        // --- PERUBAHAN DI SINI ---

        // 3. Tampilkan Success Swal DULUAN
        // Kita await user menekan tombol "OK" baru kita bersihkan UI
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: currentData
            ? `${name1} berhasil diubah`
            : `${name1} berhasil ditambahkan`,
        });

        // 4. Setelah user klik OK, baru refresh data & tutup modal
        await reload();
        closeModal("isModalOpen");
        setCurrentData(null);

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
    [currentData, reload, name1, closeModal, updateRfid, createRfid] // Pastikan dependency lengkap
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

        await deleteRfid(id);

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
        primaryKeyAccessor="rfid"
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
        endpoint="rfid/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah ${name1}` : `Tambah ${name1}`}

        // LOGIC: Enable scan hanya saat Tambah Data (!currentData)
        enableScan={!currentData}

        // LOGIC: Lebar modal otomatis menyesuaikan
        // Jika mode Scan (Tambah) -> Pakai max-w-4xl (Lebar)
        // Jika mode Edit -> Pakai max-w-2xl (Standard)
        modalWidth={!currentData ? "max-w-xl" : "max-w-xl"}

        onScanCard={() => {
          console.log("Scan area clicked");
        }}
      />
    </main>
  );
}
