import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton({ columnsLength = 5, rowsCount = 5 }) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${
            rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
          } animate-fade-in`}
        >
          {Array.from({ length: columnsLength }).map((_, colIndex) => (
            <td
              key={colIndex}
              className="whitespace-nowrap px-[10px] py-[4.3px]"
            >
              <Skeleton height={15} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
