import { useState, useEffect, useCallback, useMemo } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import Table from "../../components/common/Table";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createMenu,
  getGroupMenu,
  getMenus,
  updateMenu,
} from "../../services/settings/setMenuService";
import { getMenu } from "../../services/sidebar/sidebarService";
import { useDispatch } from "react-redux";
import { rehydrateMenu } from "../../store/menuSlice/menuSlice";

export default function SettingMenus() {
  const { name1 } = useBreadcrumb();
  const dispatch = useDispatch();

  // Data state
  const [menus, setMenus] = useState([]);
  const [groupMenus, setGroupMenus] = useState([]);
  const [, setFilteredMenus] = useState([]);
  const [currentData, setCurrentData] = useState(null);

  // Condition state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
        className: "text-left",
        style: { width: "50px" },
      },
      {
        Header: "Menu ID",
        accessor: "menuid",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
      },
      {
        Header: "Description",
        accessor: "name1",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Group",
        accessor: "groupid",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Sort",
        accessor: "sort1",
        sortable: true,
        className: "text-left",
      },
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      let result = await getMenus();

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data.map((menu) => ({
          menuid: menu.menuid,
          name1: menu.name1,
          groupid: menu.groupid,
          sort1: menu.sort1,
        }));

        setMenus(formattedData);
        setFilteredMenus(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGroupMenu = useCallback(async () => {
    try {
      setIsLoading(true);

      let result = await getGroupMenu();

      setGroupMenus(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchMenu = useCallback(async () => {
    try {
      let result = await getMenu();

      dispatch(rehydrateMenu(result.data));
    } catch (error) {
      console.error("Error fetching menu data:", error.message);
    }
  }, [dispatch]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchGroupMenu();
  }, []);

  // inputs remain the same as in the previous version
  const inputs = useMemo(
    () => [
      {
        name: "groupid",
        label: "Group",
        type: "select",
        options: groupMenus?.map((group) => ({
          value: group.pval1,
          label: group.pval2,
        })),
        required: true,
      },
      {
        name: "menuid",
        label: "Menu ID",
        type: "text",
        disabled: !!currentData,
        maxLength: 40,
      },
      {
        name: "name1",
        label: "Description",
        type: "text",
        required: true,
        maxLength: 25,
      },
      { name: "sort1", label: "Sort", type: "number", required: true },
    ],
    [currentData, groupMenus]
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleAddData = useCallback(() => {
    setCurrentData(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((dataToEdit) => {
    setCurrentData(dataToEdit);
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (newData) => {
      setIsSubmitting(true);
      try {
        if (!newData.icon1) {
          newData.icon1 = "~";
        }

        if (currentData) {
          await updateMenu(currentData.menuid, newData);
        } else {
          await createMenu(newData);
        }

        await fetchData();
        await refetchMenu();
        setIsModalOpen(false);
        setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: currentData
            ? "Menu updated successfully"
            : "Menu added successfully",
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
    [currentData, fetchData, refetchMenu]
  );

  return (
    <main className="min-h-screen px-4 py-2 mx-auto max-w-screen-2xl lg:px-4 bg-gray-50/20">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        {/* <Breadcrumbs /> */}
        <ActionButtons
          
          showUploadExcel={false}
          showFilter={false}
        />
      </div>

      <Table
        isLoading={isLoading}
        data={menus}
        columns={columns}
        onEdit={handleEdit}
        onAddData={handleAddData}
        primaryKeyAccessor="menuid"
        fileName="Export-Settings-Menu"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmit}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="M_MENU/"
        isSubmitting={isSubmitting}
        title={currentData ? `Edit ${name1}` : `Add ${name1}`}
      />
    </main>
  );
}
