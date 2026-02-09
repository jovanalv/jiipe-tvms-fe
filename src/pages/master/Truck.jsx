import { useState, useEffect, useCallback, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import TablePaginateApi from "../../components/common/TablePaginateApi";
import Table from "../../components/common/Table";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import SectionModal from "../../components/common/SectionModal";
import useFormModal from "../../hooks/useFormModal";
import {
  createTruck,
  getTruck,
  updateTruck,
  deleteTruck
} from "../../services/master/mstTruckService";
import useModalState from "../../hooks/useModalState";
import { getApiBaseUrl } from "../../utils/config";
import { Edit, Image, LinkIcon, Plus, Trash2 } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge";
import ImageViewer from "../../components/common/ImageViewer";
import ModalImage from "../../components/common/ModalImage";
import { base64ToFile } from "../../utils/base64tofile";
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
export default function MasterTruck() {
  const token = localStorage.getItem("token");
  const { name1 } = useBreadcrumb();
  const { modals, openModal, closeModal, openModal2, closeModal2, openModal3, closeModal3 } = useModalState({
    isModalOpen: false,
    isModalOpen2: false,
    isModalOpen3: false,
  });
  const [areas, setAreas] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [vend, setVend] = useState([]);
  const [truckVend, setTruckVend] = useState([]);
  const [truckImage, setTruckImage] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imgOps, setImgOps] = useState(null);
  const [isModalOpenImg, setIsModalOpenImg] = useState(false);

  // Define Table Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
        className: "text-left",
        style: { width: "50px" },
      },
      {
        Header: "Nopol",
        accessor: "nopol",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
      },
      {
        Header: "No. Rangka",
        accessor: "rangka_no",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "No. Mesin",
        accessor: "mesin_no",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Panjang Bak (m)",
        accessor: "long_bak",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Lebar Bak (m)",
        accessor: "width_bak",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Tinggi Bak (m)",
        accessor: "height_bak",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Volume Bak (m³)",
        accessor: "volume_bak",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Lidar (Volume kosong)",
        accessor: "volume_lidar",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Gambar Depan",
        accessor: "img_depan",
        sortable: true,
        className: "text-center",
        Cell: ({ row: { original } }) =>
          <div className="w-full flex justify-center items-center">
            {original.img_depan > 0 ? (
              <button
                onClick={() => fetchDataImage(original.rangka_no, "DEPAN")}
                title="Lihat Gambar Depan"
                // Hapus text-center dari button, tidak diperlukan lagi
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                <Image size={17} />
              </button>
            ) : (
              <button
                title="Tidak ada gambar"
                className="text-gray-300 cursor-not-allowed" // Ubah warna agar terlihat disabled
                disabled
              >
                <Image size={17} />
              </button>
            )}
          </div>
      },
      {
        Header: "Gambar Atas",
        accessor: "img_atas",
        sortable: true,
        className: "text-center",
        Cell: ({ row: { original } }) =>
          <div className="w-full flex justify-center items-center">
            {original.img_atas > 0 ? (
              <button
                onClick={() => fetchDataImage(original.rangka_no, "ATAS")}
                title="Lihat Gambar Atas"
                // Hapus text-center dari button, tidak diperlukan lagi
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                <Image size={17} />
              </button>
            ) : (
              <button
                title="Tidak ada gambar"
                className="text-gray-300 cursor-not-allowed" // Ubah warna agar terlihat disabled
                disabled
              >
                <Image size={17} />
              </button>
            )}
          </div>
      },
      {
        Header: "Gambar Samping",
        accessor: "img_samping",
        sortable: true,
        className: "text-center",
        Cell: ({ row: { original } }) =>
          <div className="w-full flex justify-center items-center">
            {original.img_samping > 0 ? (
              <button
                onClick={() => fetchDataImage(original.rangka_no, "SAMPING")}
                title="Lihat Gambar Samping"
                // Hapus text-center dari button, tidak diperlukan lagi
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                <Image size={17} />
              </button>
            ) : (
              <button
                title="Tidak ada gambar"
                className="text-gray-300 cursor-not-allowed" // Ubah warna agar terlihat disabled
                disabled
              >
                <Image size={17} />
              </button>
            )}
          </div>
      },
      {
        Header: "Gambar Opsional",
        accessor: "img_opsional",
        sortable: true,
        className: "text-center",
        Cell: ({ row: { original } }) =>
          <div className="w-full flex justify-center items-center">
            {original.img_opsional > 0 ? (
              <button
                onClick={() => fetchDataImage(original.rangka_no, "OPSIONAL")}
                title="Lihat Gambar Opsional"
                // Hapus text-center dari button, tidak diperlukan lagi
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                <Image size={17} />
              </button>
            ) : (
              <button
                title="Tidak ada gambar"
                className="text-gray-300 cursor-not-allowed" // Ubah warna agar terlihat disabled
                disabled
              >
                <Image size={17} />
              </button>
            )}
          </div>
      },
      {
        Header: "Status",
        accessor: "stats",
        sortable: true,
        className: "text-left",
        Cell: ({ row: { original } }) => <StatusBadge value={original.stats} />,
      },
    ],
    []
  );

  const API_BASE_URL_VEND = useMemo(
    () => getApiBaseUrl() + "vendor/",
    []
  );
  const API_BASE_URL_CARD = useMemo(
    () => getApiBaseUrl() + "rfid/",
    []
  );
  const API_BASE_URL_TRUCK = useMemo(
    () => getApiBaseUrl() + "truck/",
    []
  );

  const fetchDataVend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL_VEND, {
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
          value: loc.vendor_id + "|" + loc.name1,
          label: loc.name1,
        }));

        setVend(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL_VEND, token]);
  const fetchDataImage = useCallback(async (rangka, type) => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL_TRUCK + rangka + "/" + type, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (type == "OPSIONAL") {
        console.log("opsional " + result.data);
        setImgOps(result.data)
        setIsModalOpenImg(true)
      } else {
        console.log("bukan opsional " + result.data);
        setPreview(result.data[0].image1);
        setIsViewerOpen(true);
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL_TRUCK, token, isModalOpenImg]);

  useEffect(() => {
    const loadAllData = async () => {
      // setIsLoading(true);
      try {
        await Promise.all([fetchDataVend()]);
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
    fetchFn: getTruck,
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

  const { formData, handleChange, resetForm, setFormData } = useFormModal(
    {},
  );

  const onAddVendor = useCallback(() => {
    // setCurrentData(null);
    openModal2("isModalOpen2");
  }, [openModal2]);
  const onAddImage = useCallback(() => {
    // setCurrentData(null);
    openModal3("isModalOpen3");
  }, [openModal3]);

  const VendorTableSection = ({ formData, onAddVendor }) => {

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            List Vendor
          </h3>
          <button
            type="button"
            onClick={onAddVendor}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LinkIcon size={16} />
            Hubungkan Vendor
          </button>
        </div>

        <Table
          columns={[
            {
              Header: "RFID",
              accessor: "rfid_name",
              className: "text-left",
            },
            {
              Header: "Nama Vendor",
              accessor: "vendor_name",
              className: "text-left",
            },
          ]}
          data={formData}
          onDelete={handleDeleteVendor}
          primaryKeyAccessor="rfid"
        />
      </div>
    );
  };
  const ImageTableSection = ({ formData, onAddImage }) => {

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            List Gambar
          </h3>
          <button
            type="button"
            onClick={onAddImage}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Tambah Gambar
          </button>
        </div>

        <Table
          columns={[
            {
              Header: "Gambar",
              accessor: "img1",
              className: "text-left",
              Cell: ({ row }) =>
                <img
                  src={
                    `data:image/jpeg;${row.original.img1}`
                  }
                  alt="Preview"
                  className="object-contain w-full mx-auto max-h-12"
                />
            },
            {
              Header: "Keterangan",
              accessor: "remarks",
              className: "text-left",
            },
          ]}
          data={formData}
          onDelete={handleDeleteImage}
          primaryKeyAccessor="img1"
        />
      </div>
    );
  };

  const steps = useMemo(
    () => [
      {
        title: "Informasi Truk",
        icon: "Info",
        sections: [
          {
            title: "Informasi Truk",
            icon: "Newspaper",
            colSpan: 2,
            gridCols: 3,
            inputs: [
              {
                name: "nopol",
                label: "Nopol",
                type: "text",
                required: true,
                placeholder: "Masukkan Nopol",
                maxLength: 15,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "rangka_no",
                label: "No. Rangka",
                type: "text",
                required: true,
                placeholder: "Masukkan No. Rangka",
                maxLength: 25,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "mesin_no",
                label: "No. Mesin",
                type: "text",
                // required: true,
                placeholder: "Masukkan No. Mesin",
                maxLength: 25,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
            ],
          },
          {
            title: "Ukuran & Volume",
            icon: "Ruler",
            colSpan: 2,
            inputs: [
              {
                name: "long_bak",
                label: "Panjang Bak (m)",
                type: "number",
                placeholder: "Masukkan Panjang Bak",
                maxLength: 10,
                required: true,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "width_bak",
                label: "Lebar Bak (m)",
                type: "number",
                placeholder: "Masukkan Lebar Bak",
                maxLength: 10,
                required: true,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "height_bak",
                label: "Tinggi Bak (m)",
                type: "number",
                placeholder: "Masukkan Tinggi Bak",
                maxLength: 10,
                required: true,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "volume_bak",
                label: "Volume Bak (m³)",
                type: "number",
                placeholder: "Masukkan Volume Bak",
                maxLength: 10,
                required: true,
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              // {
              //   name: "volume_lidar",
              //   label: "Lidar (Volume kosong)",
              //   type: "number",
              //   placeholder: "Masukkan Volume Lidar",
              //   maxLength: 10,
              //   // required: true,
              //   onChange: (e) => handleChange(e.target.name, e.target.value),
              // },
            ],
          },
        ],
      },
      {
        title: "Vendor",
        icon: "User",
        gridCols: 1, // Full width untuk tabel
        sections: [
          {
            // title: "Data Vendor",
            // icon: "Contact", // Icon dihilangkan agar lebih mirip gambar (opsional)
            colSpan: 1,
            gridCols: 1,
            inputs: [
              {
                name: "vendor_list_display",
                type: "custom", // Menggunakan tipe custom
                render: () => (
                  <VendorTableSection
                    formData={truckVend}
                    onAddVendor={() => onAddVendor()}
                  />
                ),
              },
            ],
          },
        ],
      },
      {
        title: "Foto (Wajib)",
        icon: "Filetext",
        sections: [
          {
            title: "Upload Gambar Truk",
            icon: "FileText",
            colSpan: 2,
            gridCols: 3,
            inputs: [
              {
                name: "image_depan",
                label: "Depan",
                type: "upload-image",
                maxLength: 255,
                toBase64: true,
                labelSize: "big",
                required: true,
                accept:
                  "image/png,image/jpeg,image/jpg",
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "image_samping",
                label: "Samping",
                type: "upload-image",
                maxLength: 255,
                toBase64: true,
                labelSize: "big",
                required: true,
                accept:
                  "image/png,image/jpeg,image/jpg",
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
              {
                name: "image_atas",
                label: "Atas",
                type: "upload-image",
                maxLength: 255,
                toBase64: true,
                labelSize: "big",
                required: true,
                accept:
                  "image/png,image/jpeg,image/jpg",
                onChange: (e) => handleChange(e.target.name, e.target.value),
              },
            ],
          },
        ],
      },
      {
        title: "Foto (Opsional)",
        icon: "User",
        gridCols: 1, // Full width untuk tabel
        sections: [
          {
            // title: "Upload Gambar Truk",
            // icon: "FileText",
            colSpan: 1,
            gridCols: 1,
            inputs: [
              {
                name: "image_list_display",
                type: "custom", // Menggunakan tipe custom
                render: () => (
                  <ImageTableSection
                    formData={truckImage}
                    onAddImage={() => onAddImage()}
                  />
                ),
              },
            ],
          },
        ],
      },
    ],
    [handleChange, truckVend, truckImage],
  );

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
        name: "vendor_id",
        label: "Vendor",
        type: "select",
        options: vend,
        placeholder: "Pilih Vendor",
        required: true,
      },
    ],
    [currentData, vend]
  );
  const input2 = useMemo(
    () => [
      {
        name: "img1",
        // label: "Gambar",
        type: "file",
        // placeholder: "Pilih Vendor",
        // required: true,
      },
      {
        name: "remarks",
        label: "Keterangan",
        type: "textarea",
        placeholder: "Masukkan Keterangan",
        // required: true,
      },
    ],
    [currentData, vend]
  );

  // Trigger Add Modal
  const handleAddData = useCallback(() => {
    setCurrentData(null);
    openModal("isModalOpen");
  }, [openModal]);

  // Trigger Edit Modal
  const handleEdit = useCallback(
    async (dataToEdit) => {
      let result2;
      let hasil;
      try {
        const response = await fetch(API_BASE_URL_TRUCK + "vend/" + dataToEdit.rangka_no, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response2 = await fetch(API_BASE_URL_TRUCK + "img/" + dataToEdit.rangka_no, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        result2 = await response2.json();
        setTruckVend(result.data || [])
        hasil = result2.data.filter(item =>
          item.type1.includes('OPSIONAL')
        );
        setTruckImage(hasil.map(item => ({
          "img1": item.image1,
          "remarks": item.remarks,
        })))

      } catch (error) {
        console.error("Error fetching warehouse:", error);
      }
      console.log(hasil)
      // await fetchDataImage(dataToEdit.rangka_no, "OPSIONAL")
      dataToEdit.image_depan = result2.data.filter(item =>
        item.type1.includes("DEPAN")
      )[0].image1
      dataToEdit.image_atas = result2.data.filter(item =>
        item.type1.includes("ATAS")
      )[0].image1
      dataToEdit.image_samping = result2.data.filter(item =>
        item.type1.includes("SAMPING")
      )[0].image1
      dataToEdit.images = hasil.map(item => ({
        "img1": item.image1,
        "remarks": item.remarks,
      }))
      setCurrentData(dataToEdit);
      setFormData(dataToEdit);
      console.log(dataToEdit);
      openModal("isModalOpen");
    },
    [API_BASE_URL_TRUCK, openModal, setFormData]
  );

  // Handle modal form submission
  const handleModalSubmit = useCallback(
    async (newData) => {
      try {
        setIsSubmitting(true);
        if (!truckVend || truckVend.length === 0) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Vendor harus diisi!"
          });
          return;
        }
        const finalPayload = {
          ...newData,             // Data inputan form (Nopol, Rangka, dll)
          vendors: truckVend,     // Array Vendor dari state
          images: truckImage,     // Array Image dari state
        };
        console.log(finalPayload)

        if (currentData) {
          await updateTruck(currentData.rangka_no, finalPayload);
        } else {
          await createTruck(finalPayload);
        }

        await reload();
        closeModal("isModalOpen");
        setCurrentData(null);
        // formData(null);
        setTruckImage([]);
        setTruckVend([]);

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
    [currentData, reload, name1, closeModal, setTruckImage, setTruckVend]
  );
  const handleModalVendor = useCallback(
    async (newData) => {
      try {
        setIsLoading(true);
        const response = await fetch(API_BASE_URL_CARD + newData.rfid, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        console.log(result);

        if (result.success && result.data) {
          const response2 = await fetch(API_BASE_URL_TRUCK + "check-card/" + newData.rfid, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const result2 = await response2.json();
          console.log(result2);
          if (result2.success && result2.data) {
            await Swal.fire({
              icon: "error",
              title: "Error",
              text: "RFID sudah digunakan truk lain.",
            });
          } else {
            const isDuplicate = truckVend?.some((item) => item.rfid === newData.rfid);
            const isDuplicate2 = truckVend?.some((item) => item.vendor_id === newData.vendor_id.split("|")[0]);

            if (isDuplicate) {
              await Swal.fire({
                icon: "warning",
                title: "Duplikasi Terdeteksi",
                text: "RFID ini sudah ada di dalam daftar!",
              });
              return; // Hentikan proses, jangan simpan/tutup modal
            }
            if (isDuplicate2) {
              await Swal.fire({
                icon: "warning",
                title: "Duplikasi Terdeteksi",
                text: "Vendor ini sudah ada di dalam daftar!",
              });
              return; // Hentikan proses, jangan simpan/tutup modal
            }

            setTruckVend((prev) => [...prev, {
              rfid: newData.rfid,
              rfid_name: result.data.name1,
              vendor_id: newData.vendor_id.split("|")[0],
              vendor_name: newData.vendor_id.split("|")[1],
            }]);
          }
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "RFID tidak terdaftar dalam sistem.",
          });
        }


        closeModal2("isModalOpen2");
      } catch (error) {
        console.error("Error fetching warehouse:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL_CARD, API_BASE_URL_TRUCK, token, closeModal2]
  );
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleModalImage = useCallback(
    async (newData) => {
      try {
        setIsLoading(true);
        console.log("Data Awal:", newData);

        let base64String = "";

        // Cek apakah newData.img1 ada dan tipe datanya benar (File)
        if (newData?.img1 && newData.img1 instanceof File) {
          // Tunggu proses konversi selesai
          base64String = await fileToBase64(newData.img1);
          const isDuplicate = truckImage.some((item) => item.img1 === base64String);

          if (isDuplicate) {
            await Swal.fire({
              icon: "warning",
              title: "Duplikasi Terdeteksi",
              text: "Gambar ini sudah ada di dalam daftar!",
            });
            return; // Hentikan proses, jangan simpan/tutup modal
          }

          setTruckImage((prev) => [...prev, {
            img1: base64String,
            remarks: newData.remarks,
          }]);
        }

        // Opsional: Update object newData dengan hasil base64
        // const payload = { ...newData, img1: base64String };
        // await saveToApi(payload);

        closeModal3("isModalOpen3");
        // setCurrentData(null);

      } catch (error) {
        console.error("Error converting/fetching:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [closeModal3]
  );

  const handleDeleteData = useCallback(
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
        console.log(id)
        await deleteTruck(id);

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
  const handleDeleteVendor = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `Vendor akan dihapus secara permanen!`,
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
        console.log("Deleting vendor with RFID:", id);

        // await deleteTruck(id);
        await setTruckVend((prev) => prev.filter((item) => item.rfid !== id));

        // await reload();
        // closeModal2("isModalOpen2");
        // setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: `Vendor berhasil dihapus!`,
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
    [],
  );
  const handleDeleteImage = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: `Gambar akan dihapus secara permanen!`,
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
        console.log("Deleting Image:", id);

        // await deleteTruck(id);
        await setTruckImage((prev) => prev.filter((item) => item.img1 !== id));

        // await reload();
        // closeModal2("isModalOpen2");
        // setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: `Gambar berhasil dihapus!`,
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
    [],
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
        primaryKeyAccessor="rangka_no"
        fileName={`Export ${name1}`}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        // onDownload={true}
        onFilter={handleFilterData}
        onAddData={handleAddData}
        onEdit={handleEdit}
        onDelete={handleDeleteData}
      />

      {/* <Modal
        isOpen={modals.isModalOpen}
        onClose={() => closeModal("isModalOpen")}
        onSubmitSuccess={handleModalSubmit}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="areas/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah ${name1}` : `Tambah ${name1}`}
      /> */}
      <SectionModal
        isOpen={modals.isModalOpen}
        onClose={() => {
          closeModal("isModalOpen");
          setCurrentData(null);
          resetForm();
        }}
        mode={currentData ? "edit" : "add"}
        title={currentData ? `Ubah ${name1}` : `Tambah ${name1}`}
        onSubmitSuccess={handleModalSubmit}
        steps={steps}
        initialData={currentData}
        isSubmitting={isSubmitting}
        formDataParent={formData}
        saveNow={false}
      />
      <Modal
        isOpen={modals.isModalOpen2}
        onClose={() => closeModal2("isModalOpen2")}
        onSubmitSuccess={handleModalVendor}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="rfid/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah Vendor ${name1}` : `Tambah Vendor ${name1}`}
        position="row"
        // LOGIC: Enable scan hanya saat Tambah Data (!currentData)
        enableScan={true}

        // LOGIC: Lebar modal otomatis menyesuaikan
        // Jika mode Scan (Tambah) -> Pakai max-w-4xl (Lebar)
        // Jika mode Edit -> Pakai max-w-2xl (Standard)
        modalWidth={!currentData ? "max-w-xl" : "max-w-xl"}

        onScanCard={() => {
          console.log("Scan area clicked");
        }}
      />
      <Modal
        isOpen={modals.isModalOpen3}
        onClose={() => closeModal3("isModalOpen3")}
        onSubmitSuccess={handleModalImage}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={input2}
        endpoint="img1/"
        isSubmitting={isSubmitting}
        title={currentData ? `Ubah Gambar ${name1}` : `Tambah Gambar ${name1}`}
        position="row"
      />
      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageSrc={preview}
      />
      <ModalImage
        isOpen={isModalOpenImg}
        onClose={() => setIsModalOpenImg(false)}
        data={imgOps}
      />
    </main>
  );
}
