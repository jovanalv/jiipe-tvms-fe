import { X } from "lucide-react";
import TablePaginateApi from "./TablePaginateApi";
import { useEffect } from "react";

export default function ModalTable({
  modalWidth,
  datas,
  columns,
  loading,
  error,
  pageCount,
  totalRecords,
  pageIndex,
  pageSize,
  loadData,
  handleEdit,
  handleDelete,
  isChangingPage,
  name1,
  searchTerm,
  handleSearch,
  isOpen,
  onClose,
  reload,
}) {
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (!loading) {
  //       reload();
  //     }
  //   }, 5000);
  //   return () => clearInterval(intervalId);
  // }, [loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none animate-overlayShow">
      <div
        className={`relative w-full mx-4 animate-modalFadeIn ${
          modalWidth ? modalWidth : "max-w-6xl"
        }`}
      >
        <div className="relative flex flex-col w-auto bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none ">
          <button
            onClick={onClose}
            className="absolute text-gray-500 top-4 right-4 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <div className="px-5 pb-5 text-black pt-14">
            <TablePaginateApi
              data={datas}
              textLeft={"Unaccounted Personnel"}
              columns={columns}
              isLoading={loading}
              error={error}
              pageCount={pageCount}
              totalRecords={totalRecords}
              currentPage={pageIndex}
              currentPageSize={pageSize}
              fetchData={loadData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isChangingPage={isChangingPage}
              primaryKeyAccessor="pernr"
              fileName={`Export-${name1}`}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              isNoExport={true}
              maxHeight={"60vh"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
