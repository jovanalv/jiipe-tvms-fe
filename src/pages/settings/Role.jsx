import { useState, useEffect, useCallback, useMemo } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import Table from "../../components/common/Table";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createRole,
  getMenus,
  getRoles,
  updateRole,
} from "../../services/settings/setRoleService";
import { useDispatch } from "react-redux";
import { rehydrateMenu } from "../../store/menuSlice/menuSlice";
import { getMenu } from "../../services/sidebar/sidebarService";

export default function SettingRoles() {
  const { name1 } = useBreadcrumb();
  const dispatch = useDispatch();

  // Data state
  const [menus, setMenus] = useState([]);
  const [roles, setRoles] = useState([]);

  // Condition state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
        className: "text-left",
        style: { width: "50px" },
      },
      {
        Header: "Role ID",
        accessor: "roleid",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
      },
      {
        Header: "Menu",
        accessor: "role_menu",
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
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      let result = await getRoles();

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data?.map((role) => ({
          roleid: role.roleid,
          name1: role.name1,
          role_menu: Array.isArray(role.role_menu)
            ? role.role_menu?.map((menu) => menu.menuid).join(", ")
            : role.menuid,
        }));

        setRoles(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(async () => {
    try {
      let result = await getMenus();

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data?.map((menu) => ({
          ...menu,
          menuid: menu.menuid,
          name1: menu.name1,
        }));
        setMenus(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching gates:", error);
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

  useEffect(() => {
    fetchData();
    fetchMenus();
  }, []);

  const inputs = useMemo(() => {
    return [
      {
        name: "roleid",
        label: "Role ID",
        type: "text",
        disabled: !!currentData,
        maxLength: 15,
      },
      { name: "name1", label: "Deskripsi", type: "text", maxLength: 25 },
      {
        name: "role_menu",
        label: "Menu",
        type: "multi-select",
        options: menus?.map((menu) => ({
          value: menu.menuid,
          label: `${menu.group_name} - ${menu.name1}`,
        })),
      },
    ];
  }, [currentData, menus]);

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
      if (!newData.role_menu || newData.role_menu.length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Menu Required",
          text: "At least one menu must be selected.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          roleid: newData.roleid,
          name1: newData.name1,
          role_menu: newData.role_menu.map((menuid) => ({ menuid })),
        };

        if (currentData) {
          await updateRole(currentData.roleid, payload);
        } else {
          await createRole(payload);
        }

        await fetchData();
        await refetchMenu();
        setIsModalOpen(false);
        setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: currentData
            ? "Role updated successfully"
            : "Role added successfully",
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
        data={roles}
        columns={columns}
        onEdit={handleEdit}
        onAddData={handleAddData}
        primaryKeyAccessor="roleid"
        fileName="Export-Settings-Role"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmit}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="M_ROLE/"
        isSubmitting={isSubmitting}
        title={currentData ? `Edit ${name1}` : `Add ${name1}`}
      />
    </main>
  );
}
