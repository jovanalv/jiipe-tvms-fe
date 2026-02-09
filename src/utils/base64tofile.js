export function base64ToFile(dataurl, filename) {
  // 1. Memisahkan header (data:image/jpeg;base64) dari datanya
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1]; // Ambil tipe mime (misal image/png)
  const bstr = atob(arr[1]); // Decode base64 string
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  // 2. Ubah string menjadi byte array
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // 3. Bungkus menjadi File Object
  return new File([u8arr], filename, { type: mime });
};