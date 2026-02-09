import { useState, useEffect, useCallback, useMemo } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ActionButtons from "../../components/common/ActionButtons";
import Modal from "../../components/common/Modal";
import Swal from "sweetalert2";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import {
  createUser,
  getEmployeePIC,
  getRoles,
  getUsers,
  importUser,
  updateUser,
} from "../../services/settings/setUserService";

export default function SettingUsers() {
  const { name1 } = useBreadcrumb();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalExcelOpen, setIsModalExcelOpen] = useState(false);
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
        Header: "User ID",
        accessor: "usrid",
        sortable: true,
        className: "text-left",
        style: { width: "150px" },
      },
      {
        Header: "Username",
        accessor: "name1",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Role",
        accessor: "roleid",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Phone Number",
        accessor: "phone",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
        className: "text-left",
      },
      {
        Header: "Status",
        accessor: "stats",
        sortable: true,
        className: "text-left",
        Cell: ({ row: { original } }) => <StatusBadge value={original.stats} />,
      },
      {
        Header: "Locked",
        accessor: "is_locked",
        sortable: true,
        className: "text-left",
        Cell: ({ row: { original } }) => (
          <StatusBadge
            value={original.is_locked === "Y" ? "Locked" : "Unlocked"}
          />
        ),
      },
    ],
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      let result = await getUsers();

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data?.map((user) => ({
          usrid: user.usrid,
          name1: user.name1,
          roleid: Array.isArray(user.roleid)
            ? user.roleid.join(",")
            : user.roleid,
          stats: user.stats,
          phone: user.phone,
          email: user.email,
          is_locked: user.is_locked,
          pernr: user.pernr,
        }));

        setUsers(formattedData);
        setFilteredUsers(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      let result = await getRoles();

      if (result.success && Array.isArray(result.data)) {
        const formattedData = result.data?.map((gate) => ({
          roleid: gate.roleid,
          name1: gate.name1,
        }));
        setRoles(formattedData);
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }, []);

  // const fetchEmployee = useCallback(async () => {
  //   try {
  //     let result = await getEmployeePIC();

  //     if (result.success && Array.isArray(result.data)) {
  //       const formattedData = result.data?.map((x) => ({
  //         pernr: x.usrid,
  //         name1: x.name1,
  //       }));
  //       setEmployee(formattedData);
  //     } else {
  //       throw new Error("Invalid data format or no data received");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching:", error);
  //   }
  // }, []);

  useEffect(() => {
    fetchData();
    fetchRoles();
    // fetchEmployee();
  }, [fetchData, fetchRoles]);

  const inputs = useMemo(
    () =>
      [
        ...(currentData
          ? [
              {
                name: "stats",
                label: "Status",
                type: "switch",
              },
              {
                name: "is_locked",
                label: "Locked",
                type: "switch",
                defaultTrue: "Y",
                defaultFalse: "N",
                labelTrue: "Locked",
                labelFalse: "Unlocked",
                theme: "red",
              },
            ]
          : []),
        {
          name: "usrid",
          label: "User ID",
          type: "text",
          disabled: !!currentData,
          required: true,
          maxLength: 20,
        },
        {
          name: "name1",
          label: "Username",
          type: "text",
          required: true,
          maxLength: 255,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "text",
          maxLength: 13,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          maxLength: 100,
        },
        {
          name: "roleid",
          label: "Role",
          type: "multi-select",
          options: roles?.map((role) => ({
            value: role.roleid,
            label: role.name1,
          })),
        },
        // {
        //   name: "pernr",
        //   label: "As Employee PIC (if user as Employee PIC)",
        //   type: "select",
        //   options: employee?.map((x) => ({
        //     value: x.pernr,
        //     label: x.name1,
        //   })),
        // },
        {
          name: "usrpw",
          label: "Password",
          type: "password",
          minLength: 8,
          maxLength: 16,
          required: currentData ? false : true,
        },
        {
          name: "conf_usrpw",
          label: "Confirm Password",
          type: "password",
          maxLength: 16,
          required: currentData ? false : true,
          minLength: 8,
        },
      ].filter(Boolean),
    [currentData, roles, employee]
  );

  const inputExcel = useMemo(
    () => [
      {
        name: "excelData",
        label: "Excel",
        type: "file",
        isSingleCol: true,
        accept:
          ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
      },
    ],
    []
  );

  const handleAddData = useCallback(() => {
    setCurrentData(null);
    setIsModalOpen(true);
  }, []);

  const handleImportData = useCallback(() => {
    setCurrentData(null);
    setIsModalExcelOpen(true);
  }, []);

  const handleEdit = useCallback((dataToEdit) => {
    const toEdit = {
      ...dataToEdit,
    };
    setCurrentData(toEdit);
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (newData) => {
      if (!newData.roleid || newData.roleid.length === 0) {
        await Swal.fire({
          icon: "error",
          title: "Role Required",
          text: "At least one role must be selected.",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        if (newData.usrpw !== newData.conf_usrpw) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Passwords do not match.",
          });
          return;
        }

        if (!currentData && (!newData.usrpw || !newData.conf_usrpw)) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Password and Confirm Password must be filled.",
          });
          return;
        }

        if (currentData) {
          await updateUser(currentData.usrid, newData);
        } else {
          await createUser(newData);
        }

        await fetchData();
        setIsModalOpen(false);
        setCurrentData(null);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: currentData
            ? "User successfully updated"
            : "User successfully added",
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
    [currentData, fetchData]
  );

  const handleModalSubmitImport = useCallback(
    async (modalData) => {
      try {
        setIsSubmitting(true);

        if (!modalData.excelData) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please select a file before importing.",
          });
          return;
        }

        const form = new FormData();
        form.append("file", modalData.excelData);

        let result = await importUser(form);

        await fetchData();
        setIsModalExcelOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Excel File Imported",
          html: result.message || "Excel data successfully imported",
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          html: error.message || "Failed to import file",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchData]
  );

  return (
    <main className="min-h-screen px-4 py-2 mx-auto max-w-screen-2xl lg:px-4 bg-gray-50/20">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        {/* <Breadcrumbs /> */}
        <ActionButtons
          // onAddData={handleAddData}
          // onUploadExcel={handleImportData}
          showFilter={false}
        />
      </div>

      <Table
        isLoading={isLoading}
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onAddData={handleAddData}
        onUploadExcel={handleImportData}
        primaryKeyAccessor="usrid"
        fileName="Export-Settings-User"
        exportHeaders={[
          "User ID",
          "Username",
          "Phone Number",
          "Email",
          "Role",
          "Status",
          "Locked",
        ]}
        exportKeys={[
          "usrid",
          "name1",
          "phone",
          "email",
          "roleid",
          "stats",
          "is_locked",
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmit}
        mode={currentData ? "edit" : "add"}
        currentData={currentData}
        inputs={inputs}
        endpoint="areas/"
        isSubmitting={isSubmitting}
        title={currentData ? `Edit ${name1}` : `Add ${name1}`}
      />

      <Modal
        isOpen={isModalExcelOpen}
        onClose={() => setIsModalExcelOpen(false)}
        onSubmitSuccess={handleModalSubmitImport}
        mode={"add"}
        currentData={null}
        inputs={inputExcel}
        endpoint="areas/"
        isSubmitting={isSubmitting}
        title={"Upload Excel"}
        templateFile="/template-excel/t_user.xlsx"
      />
    </main>
  );
}
