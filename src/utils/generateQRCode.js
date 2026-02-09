import QRCodeGenerator from "qrcode";

const generateQRImage = async (data) => {
  try {
    const qrCodeDataURL = await QRCodeGenerator.toDataURL(data, {
      width: 80,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

export default generateQRImage;
