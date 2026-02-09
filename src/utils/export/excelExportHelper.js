import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

export const exportToExcel = async (data, headers, keys, filename) => {
  if (data.length === 0) {
    toast.error("Tidak ada data yang diexport!", { position: "top-right" });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "000000" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8db4e2" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  data.forEach((item) => {
    const rowData = keys.map((key) => item[key] ?? "");
    const row = worksheet.addRow(rowData);

    if (item.react_export_color) {
      const color = item.react_export_color.replace("#", "");
      row.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: color } };
      });
    }

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  const currentDate = new Date()
    .toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  const fullFilename = `${filename}-${currentDate}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fullFilename);

  toast.success("File Excel berhasil didownload!", {
    position: "top-right",
  });
};
