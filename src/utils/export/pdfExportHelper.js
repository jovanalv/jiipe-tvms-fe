import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

export const pdfExportHelper = (headers, keys, data, filename, title) => {
  if (data.length === 0) {
    toast.error("No data to export!", {
      position: "top-right",
    });
    return;
  }

  const doc = new jsPDF();

  let topMargin = 10;

  if (title) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    topMargin = 22;
  }

  const tableHeaders = headers;
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
    margin: { top: topMargin },
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

  doc.save(`${filename}.pdf`);
};
