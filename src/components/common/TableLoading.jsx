import React from "react";
import Loader from "./Loader";

const TableLoading = ({ loading, columnsLength }) => {
  if (!loading) return null;

  return (
    <tr className="w-full">
      <td colSpan={columnsLength} className="py-10 text-center bg-white/80">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader isMinHeight={false} />
        </div>
      </td>
    </tr>
  );
};

export default TableLoading;
