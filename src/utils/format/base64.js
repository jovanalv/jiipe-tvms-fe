const getBase64SizeKB = (base64) => {
  if (!base64) return 0;

  const base64String = base64.split(",")[1] || base64;
  const padding = (base64String.match(/=/g) || []).length;
  const bytes = (base64String.length * 3) / 4 - padding;

  return Number((bytes / 1024).toFixed(2)); // KB (number)
};

export default getBase64SizeKB;