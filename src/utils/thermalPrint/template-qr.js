import Printer, { JustifyModes, PrinterModes } from "esc-pos-printer";
import QRCode from "qrcode";

class Item {
  constructor(name = "", value = "", dollarSign = false) {
    this.name = name;
    this.value = value;
    this.dollarSign = dollarSign;
  }

  get itemName() {
    return this.name;
  }

  getFormattedParts() {
    const rightCols = 30;
    let leftCols = 12;
    if (this.dollarSign) {
      leftCols = leftCols / 2 - rightCols / 2;
    }

    const left = this.padString(this.name, leftCols);
    const sign = this.dollarSign ? "$ " : "";
    const right = this.padString(sign + this.value, rightCols, " ");

    return { left, right };
  }

  toString() {
    const parts = this.getFormattedParts();
    return `${parts.left}${parts.right}\n`;
  }

  padString(str, width, padChar = " ") {
    if (str.length >= width) {
      return str;
    }
    const padding = padChar.repeat(width - str.length);
    return str + padding;
  }
}

const truncateString = (str, maxLength) => {
  if (!str) return "";
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

const FIXED_HEIGHT_MM = 80;
const LINE_HEIGHT_MM = 4;
const MAX_LINES = Math.floor(FIXED_HEIGHT_MM / LINE_HEIGHT_MM);

const HEADER_LINES = 2;
const QR_CODE_LINES = 8;
const QR_SPACING_LINES = 2;
const FOOTER_LINES = 4;

const printVisitorWithFixedHeight = async (
  printer,
  header,
  items,
  qrCodeValue
) => {
  let usedLines = 0;
  printer.selectPrintMode();

  // Header
  printer.justify(JustifyModes.justifyCenter);
  printer.selectPrintMode(PrinterModes.MODE_DOUBLE_WIDTH);
  printer.setEmphasis(true);
  printer.text(header);
  printer.selectPrintMode();
  printer.setEmphasis(false);
  printer.feed(1);
  // usedLines += HEADER_LINES;

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(qrCodeValue, {
    margin: 1,
    width: 180,
  });
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  await printer.printBase64Image(base64Data);

  printer.feed(1);
  usedLines += QR_CODE_LINES + QR_SPACING_LINES;

  // Items
  printer.justify(JustifyModes.justifyLeft);
  let itemLines = 0;
  items.forEach((item) => {
    if (item.itemName) {
      const parts = item.getFormattedParts();
      printer.setEmphasis(true);
      printer.text(parts.left);
      printer.setEmphasis(false);
      printer.text(parts.right + "\n");
      itemLines++;
    }
  });
  usedLines += itemLines;

  // Footer
  printer.feed(1);
  printer.justify(JustifyModes.justifyCenter);
  printer.selectPrintMode(PrinterModes.MODE_FONT_B);
  printer.setEmphasis(false);
  printer.text("PT UNILEVER INDONESIA HOMECARE FACTORY\n");
  // printer.text("HOMECARE FACTORY\n");

  usedLines += FOOTER_LINES;

  const remainingLines = MAX_LINES - usedLines;
  if (remainingLines > 0) {
    printer.feed(remainingLines);
  }

  printer.cut();
};

const printContractorWithFixedHeight = async (
  printer,
  header,
  items,
  qrCodeValue
) => {
  let usedLines = 0;
  printer.selectPrintMode();

  // Header
  printer.justify(JustifyModes.justifyCenter);
  printer.selectPrintMode(PrinterModes.MODE_DOUBLE_WIDTH);
  printer.setEmphasis(true);
  printer.text(header);
  printer.selectPrintMode();
  printer.setEmphasis(false);
  printer.feed(1);
  // usedLines += HEADER_LINES;

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(qrCodeValue, {
    margin: 1,
    width: 180,
  });
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  await printer.printBase64Image(base64Data);

  printer.feed(1);
  usedLines += QR_CODE_LINES + QR_SPACING_LINES;

  // Items
  printer.justify(JustifyModes.justifyLeft);
  let itemLines = 0;
  items.forEach((item) => {
    if (item.itemName) {
      const parts = item.getFormattedParts();
      printer.setEmphasis(true);
      printer.text(parts.left);
      printer.setEmphasis(false);
      printer.text(parts.right + "\n");
      itemLines++;
    }
  });
  usedLines += itemLines;

  // Footer
  printer.feed(1);
  printer.justify(JustifyModes.justifyCenter);
  printer.selectPrintMode(PrinterModes.MODE_FONT_B);
  printer.setEmphasis(false);
  printer.feed(4);
  printer.text("PT UNILEVER INDONESIA HOMECARE FACTORY\n");
  // printer.text("HOMECARE FACTORY\n");

  usedLines += FOOTER_LINES;

  const remainingLines = MAX_LINES - usedLines;
  if (remainingLines > 0) {
    printer.feed(remainingLines);
  }

  printer.cut();
};

const ContractorPrint = async (dataArray, printerName) => {
  try {
    const printer = new Printer(printerName ?? "comerciandoPrinter");

    for (const data of dataArray) {
      const items = [
        new Item("ID", data.nik),
        new Item("Name", truncateString(data.name1, 33)),
        new Item("Vendor", truncateString(data.vendorname, 33)),
        new Item("Area", data.area),
        new Item("PIC", truncateString(data.pic, 33)),
        new Item("Exp. Date", data.expdt),
      ];

      await printContractorWithFixedHeight(
        printer,
        "CONTRACTOR ACCESS",
        items,
        data.guid
      );
    }

    printer.close();
    await printer.print();
  } catch (err) {
    throw new Error(`Contractor print failed: ${err.message}`);
  }
};

const VisitorPrint = async (dataArray, printerName) => {
  try {
    const printer = new Printer(printerName ?? "comerciandoPrinter");

    for (const data of dataArray) {
      const items = [
        new Item("ID", data.nik),
        new Item("Name", truncateString(data.name1, 33)),
        new Item("Vendor", truncateString(data.vendorname, 33)),
        new Item("Area", data.area),
        new Item("PIC", truncateString(data.pic, 33)),
        new Item("Start", data.datetime),
        new Item("End", data.expdt),
      ];

      await printVisitorWithFixedHeight(
        printer,
        "VISITOR ACCESS",
        items,
        data.guid
      );
    }

    printer.close();
    await printer.print();
  } catch (err) {
    throw new Error(`Visitor print failed: ${err.message}`);
  }
};

export { ContractorPrint, VisitorPrint };
