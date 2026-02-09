import { ContractorPrint, VisitorPrint } from "./template-qr";
import Printer from "esc-pos-printer";

const getPrintersList = async () => {
  const printer = new Printer();
  return await printer.getPrinters();
};

const printQRThermal = async (personnelType, data) => {
  const printerList = await getPrintersList();

  let selectedPrinter = localStorage.getItem("printerThermal");

  if (!selectedPrinter && printerList.length > 0) {
    selectedPrinter = printerList[0];
    localStorage.setItem("printerThermal", selectedPrinter);
  }

  if (personnelType === "visitor") {
    await VisitorPrint(data, selectedPrinter);
  } else {
    await ContractorPrint(data, selectedPrinter);
  }
};

export default printQRThermal;
