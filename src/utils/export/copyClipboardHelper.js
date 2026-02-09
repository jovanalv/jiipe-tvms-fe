import { toast } from "react-toastify";

export const copyToClipboard = (data, headers, keys) => {
  if (data.length === 0) {
    toast.error("No data to copy!", {
      position: "top-right",
    });
    return;
  }

  const rowArray = data.map((item) =>
    keys.map((key) => item[key] || "").join("\t")
  );

  const fullText = [headers.join("\t"), ...rowArray].join("\n");

  navigator.clipboard
    .writeText(fullText)
    .then(() => {
      toast.success("Successfully copied text to clipboard", {
        position: "top-right",
      });
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
};
