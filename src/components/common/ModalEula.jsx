import { X } from "lucide-react";

export default function ModalEula({
  isOpen,
  onClose,
  websiteName = "[Nama Website/Perusahaan]",
  companyName = "[Nama Perusahaan/Website]",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-overlayShow">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col animate-modalFadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            End User License Agreement (EULA)
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <h3 className="mb-4 text-xl font-semibold text-center">
              {websiteName}
            </h3>

            <div className="space-y-6 text-sm leading-relaxed">
              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  1. Definisi
                </h4>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    <strong>Pengguna:</strong> Individu yang mengakses dan/atau
                    menggunakan layanan website {websiteName}.
                  </li>
                  <li>
                    <strong>Data Pribadi:</strong> Setiap data tentang individu
                    yang teridentifikasi atau dapat diidentifikasi secara
                    tersendiri atau dikombinasikan dengan informasi lainnya,
                    termasuk tetapi tidak terbatas pada foto KTP.
                  </li>
                  <li>
                    <strong>Penyelenggara Sistem Elektronik (PSE):</strong>{" "}
                    {companyName}, pihak yang mengelola dan mengoperasikan
                    layanan ini.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  2. Persetujuan
                </h4>
                <p>
                  Dengan menggunakan layanan {websiteName}, Pengguna menyatakan
                  telah membaca, memahami, dan menyetujui seluruh ketentuan
                  dalam EULA ini, termasuk pengumpulan, penyimpanan, pemrosesan,
                  dan perlindungan Data Pribadi sesuai dengan UU No. 27 Tahun
                  2022 tentang Perlindungan Data Pribadi ("UU PDP").
                </p>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  3. Pengumpulan dan Penggunaan Data Pribadi
                </h4>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    Website ini dapat mengumpulkan Data Pribadi berupa foto KTP
                    serta data identitas terkait.
                  </li>
                  <li>
                    Data tersebut digunakan hanya untuk tujuan:
                    <ul className="pl-5 mt-2 space-y-1 list-disc">
                      <li>Verifikasi identitas Pengguna;</li>
                      <li>Keperluan autentikasi dan keamanan akun;</li>
                      <li>
                        Pemenuhan kewajiban hukum dan regulasi yang berlaku.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Data Pribadi tidak akan digunakan di luar tujuan tersebut
                    tanpa persetujuan eksplisit dari Pengguna.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  4. Penyimpanan dan Keamanan
                </h4>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    Foto KTP dan Data Pribadi Pengguna disimpan dalam sistem
                    dengan standar keamanan yang sesuai praktik terbaik
                    industri, termasuk enkripsi dan kontrol akses terbatas.
                  </li>
                  <li>
                    {websiteName} berkomitmen untuk mencegah akses tidak sah,
                    pengungkapan, atau pemrosesan Data Pribadi tanpa dasar
                    hukum.
                  </li>
                  <li>
                    Data akan disimpan selama diperlukan untuk tujuan yang telah
                    disebutkan, kecuali diminta untuk dihapus oleh Pengguna
                    sesuai haknya dalam UU PDP.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  5. Hak Pengguna
                </h4>
                <p className="mb-2">
                  Sesuai UU PDP, Pengguna memiliki hak untuk:
                </p>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    Mendapatkan informasi mengenai kejelasan identitas
                    pengendali Data Pribadi dan dasar kepentingannya;
                  </li>
                  <li>Mengakses dan memperoleh salinan Data Pribadi;</li>
                  <li>
                    Melengkapi, memperbarui, dan/atau memperbaiki Data Pribadi;
                  </li>
                  <li>Menghapus Data Pribadi;</li>
                  <li>Menarik persetujuan atas pemrosesan Data Pribadi;</li>
                  <li>Mengajukan keberatan atas tindakan pemrosesan;</li>
                  <li>
                    Mengajukan gugatan apabila terjadi pelanggaran terhadap Data
                    Pribadi.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  6. Kewajiban Pengguna
                </h4>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    Pengguna wajib memberikan data yang benar, akurat, dan sah.
                  </li>
                  <li>
                    Pengguna bertanggung jawab atas kerugian yang timbul akibat
                    kesalahan, ketidaklengkapan, atau pemalsuan data yang
                    diberikan.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  7. Pembagian Data kepada Pihak Ketiga
                </h4>
                <ul className="pl-5 space-y-2 list-disc">
                  <li>
                    {websiteName} tidak akan menjual, menyewakan, atau
                    memperdagangkan Data Pribadi Pengguna.
                  </li>
                  <li>
                    Data Pribadi hanya dapat dibagikan kepada pihak ketiga yang
                    berkepentingan apabila:
                    <ul className="pl-5 mt-2 space-y-1 list-disc">
                      <li>Mendapat persetujuan Pengguna;</li>
                      <li>Diperlukan untuk memenuhi kewajiban hukum;</li>
                      <li>
                        Diperlukan untuk perlindungan terhadap klaim hukum atau
                        penegakan hukum.
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  8. Perubahan EULA
                </h4>
                <p>
                  {companyName} berhak mengubah ketentuan EULA ini
                  sewaktu-waktu. Setiap perubahan akan diberitahukan melalui
                  website atau media komunikasi resmi.
                </p>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  9. Hukum yang Berlaku
                </h4>
                <p>
                  EULA ini diatur dan ditafsirkan berdasarkan hukum Republik
                  Indonesia, termasuk UU Perlindungan Data Pribadi dan peraturan
                  pelaksanaannya.
                </p>
              </section>

              <section>
                <h4 className="mb-3 text-lg font-semibold text-blue-700">
                  10. Kontak
                </h4>
                <p className="mb-2">
                  Untuk pertanyaan, permintaan, atau keluhan terkait Data
                  Pribadi, Pengguna dapat menghubungi:
                </p>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-semibold">Unilever Indonesia</p>
                  <p>
                    <strong>Alamat:</strong> Jl. Jababeka Raya Blok O, Cikarang,
                    Bekasi 17520, Indonesia
                  </p>
                  <p>
                    <strong>Email:</strong> SHE.Indonesia@unilever.com
                  </p>
                  <p>
                    <strong>Telepon:</strong> 0218936277
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
