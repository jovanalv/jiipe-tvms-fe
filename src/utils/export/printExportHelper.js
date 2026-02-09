import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

export const printExportHelper = (headers, keys, data) => {
  if (data.length === 0) {
    toast.error("No data to print!", {
      position: "top-right",
    });
    return;
  }

  const doc = new jsPDF();

  const tableHeaders = headers.map((header) => ({
    title: header,
    dataKey: header,
  }));

  const tableData = data.map((row) => {
    const rowData = {};
    keys.forEach((key, index) => {
      rowData[headers[index]] = row[key] || "";
    });
    rowData.__color = row.react_export_color || null;

    return rowData;
  });

  doc.autoTable({
    head: [tableHeaders],
    body: tableData.map((row) => headers.map((header) => row[header])),
    theme: "grid",
    styles: { fontSize: 10 },
    margin: { top: 10 },
    headStyles: {
      fillColor: [49, 57, 87],
      textColor: [255, 255, 255],
    },
    didParseCell: (dataCell) => {
      if (dataCell.section === "body") {
        const rowIndex = dataCell.row.index;
        const colorHex = tableData[rowIndex].__color;

        if (colorHex) {
          const r = parseInt(colorHex.slice(1, 3), 16);
          const g = parseInt(colorHex.slice(3, 5), 16);
          const b = parseInt(colorHex.slice(5, 7), 16);

          dataCell.cell.styles.textColor = [r, g, b];
          dataCell.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};
