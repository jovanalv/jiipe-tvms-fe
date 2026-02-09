import { useState, useEffect, useCallback, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import TablePaginateApi from "../../components/common/TablePaginateApi";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createVendor,
  getVendor,
  updateVendor,
  deleteVendor
} from "../../services/master/mstVendorService";
import useModalState from "../../hooks/useModalState";
import { getApiBaseUrl } from "../../utils/config";
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
export default function MasterVendor() {
  const token = localStorage.getItem("token");
  const { name1 } = useBreadcrumb();
  const { modals, openModal, closeModal } = useModalState({
    isModalOpen: false,
  });
  const [areas, setAreas] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [loc, setLoc] = useState([]);

  // Define Table Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
        className: "text-left",
        // style: { width: "50px" },
      },
      {
        Header: "ID Vendor",
        accessor: "vendor_id",
        sortable: true,
        className: "text-left",
        // style: { width: "150px" },
      },
      {
        Header: "Nama Vendor",
        accessor: "name1",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Alamat",
        accessor: "address",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Lokasi Bongkar",
        accessor: "bongkar_loc",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "PIC",
        accessor: "pic",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Email PIC",
        accessor: "email",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Telp. PIC",
        accessor: "phone",
        sortable: true,
        className: "text-left",
      },
    ],
    []
  );

  const API_BASE_URL_LOC = useMemo(
    () => getApiBaseUrl() + "area/",
    []
  );

  const fetchDataLoc = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL_LOC, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data.map((loc) => ({
          value: loc.loc_id,
          label: loc.name1,
        }));

        setLoc(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL_LOC, token]);

  useEffect(() => {
    const loadAllData = async () => {
      // setIsLoading(true);
      try {
        await Promise.all([fetchDataLoc()]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

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
    fetchFn: getVendor,
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
        name: "vendor_id",
        label: "ID Vendor",
        type: "text",
        disabled: !!currentData,
        autofocus: true,
        maxLength: 15,
        placeholder: "Masukkan ID Vendor",
        required: true,
      },
      {
        name: "name1",
        label: "Nama Vendor",
        type: "text",
        maxLength: 25,
        placeholder: "Masukkan Nama Vendor",
        required: true,
      },
      {
        name: "address",
        label: "Alamat",
        type: "text",
        maxLength: 255,
        placeholder: "Masukkan Alamat",
        // required: true,
      },
      {
        name: "loc_id",
        label: "Lokasi Bongkar",
        type: "select",
        options: loc,
        placeholder: "Pilih Lokasi Bongkar",
        required: true,
      },
      {
        name: "pic",
        label: "PIC",
        type: "text",
        maxLength: 25,
        placeholder: "Masukkan PIC",
        required: true,
      },

      {
        name: "email",
        label: "Email PIC",
        type: "email",
        maxLength: 25,
        placeholder: "Masukkan Email PIC",
        // required: true,
      },
      {
        name: "phone",
        label: "Telp. PIC",
        type: "number",
        maxLength: 15,
        placeholder: "Masukkan Telp. PIC",
        // required: true,
      },
    ],
    [currentData, loc]
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
      try {
        setIsSubmitting(true);
        console.log("new data " + newData)
        if (currentData) {
          await updateVendor(currentData.vendor_id, newData);
        } else {
          await createVendor(newData);
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

        await deleteVendor(id);

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
        primaryKeyAccessor="vendor_id"
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
        endpoint="vendor/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah ${name1}` : `Tambah ${name1}`}
      />
    </main>
  );
}
