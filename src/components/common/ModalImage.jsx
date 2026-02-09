import React from "react";
import { X, FileText, Activity, Image as ImageIcon, ArrowLeft } from "lucide-react";

// --- 2. Sub-Component: Image Preview (Kotak Foto) ---
const ImagePreview = ({ label, src }) => (
    <div className="flex flex-col gap-2">
        {/* <span className="text-xs font-medium text-gray-600">{label}</span> */}
        <div className="relative w-full aspect-square bg-white border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center overflow-hidden p-2">
            {src ? (
                <img
                    src={src}
                    alt={label}
                    className="object-contain w-full h-full rounded-md"
                />
            ) : (
                <div className="text-gray-300 flex flex-col items-center">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">No Image</span>
                </div>
            )}
        </div>
    </div>
);

// --- 3. Main Component: Modal Detail ---
export default function ModalImage({ isOpen, onClose, data }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scaleIn">

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Gambar Opsional</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- BODY (Scrollable) --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* SECTION 4: Foto (Opsional) */}
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-3 gap-6 max-w-2xl">
                            {
                                data.map((truck, index) => (
                                    <ImagePreview key={index} label={truck.remarks} src={truck.image1} />
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}