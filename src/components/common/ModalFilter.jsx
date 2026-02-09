import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import FormSelect from "../form/FormSelect";

// 1. DEFINISI OPERATOR CONSTANTS
const DEFAULT_OPERATORS = [
  { value: "include", label: "Include" },
  { value: "exclude", label: "Exclude" },
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "starts_with", label: "Starts With" },
];

const NUMBER_OPERATORS = [
  { value: "=", label: "=" },
  { value: "<", label: "<" },
  { value: ">", label: ">" },
  { value: "<=", label: "<=" },
  { value: ">=", label: ">=" },
];

export default function FilterModal({ isOpen, onClose, onApply, onSave, fieldOptions = [] }) {
  
  // Helper: Cek apakah field ini tipe number
  const isNumberField = (fieldValue) => {
    const field = fieldOptions.find((f) => f.value === fieldValue);
    return field?.type === "number";
  };

  // Helper: Ambil operator yang cocok (Text vs Number)
  const getOperators = (fieldValue) => {
    return isNumberField(fieldValue) ? NUMBER_OPERATORS : DEFAULT_OPERATORS;
  };

  // Helper: Ambil default operator saat ganti field
  const getDefaultOperator = (fieldValue) => {
    return isNumberField(fieldValue) ? "=" : "include";
  };

  const [conditions, setConditions] = useState([
    { field: fieldOptions[0]?.value || "", operator: "include", value: "" },
  ]);

  useEffect(() => {
    if (isOpen && conditions.length === 0 && fieldOptions.length > 0) {
       const firstField = fieldOptions[0].value;
       setConditions([{ 
         field: firstField, 
         operator: getDefaultOperator(firstField), 
         value: "" 
       }]);
    }
  }, [isOpen, fieldOptions]);

  const addCondition = () => {
    const defaultField = fieldOptions[0]?.value || "";
    setConditions([
      ...conditions,
      { 
        field: defaultField, 
        operator: getDefaultOperator(defaultField), 
        value: "" 
      },
    ]);
  };

  const removeCondition = (index) => {
    if (conditions.length === 1) return;
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const handleChange = (index, key, e) => {
    const val = e?.target ? e.target.value : e;
    const newConditions = [...conditions];

    // LOGIC KHUSUS SAAT GANTI FIELD
    if (key === "field") {
        newConditions[index].field = val;
        
        // Reset operator & value agar sesuai dengan tipe field baru
        // Misal: Dari String (Contains) -> Number (=)
        newConditions[index].operator = getDefaultOperator(val);
        newConditions[index].value = ""; // Reset value biar aman
    } else {
        newConditions[index][key] = val;
    }

    setConditions(newConditions);
  };

  const handleReset = () => {
    const firstField = fieldOptions[0]?.value || "";
    setConditions([{ 
        field: firstField, 
        operator: getDefaultOperator(firstField), 
        value: "" 
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] backdrop-blur-sm transition-opacity overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-xl transform transition-all my-8">
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 rounded-t-xl">
            <h3 className="text-lg font-bold text-gray-800">Filter Data</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6"> 
            <div className="space-y-3">
              {conditions.map((condition, index) => {
                // Tentukan operator list untuk baris ini
                const currentOperators = getOperators(condition.field);
                const isNum = isNumberField(condition.field);

                return (
                  <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-end z-10 relative">
                    
                    {/* Field Select */}
                    <div className="w-full md:flex-1 min-w-[150px]" style={{ zIndex: 50 - index }}> 
                       <FormSelect
                            name={`field-${index}`}
                            placeholder="Pilih Kolom"
                            options={fieldOptions}
                            value={fieldOptions.find((o) => o.value === condition.field) || null}
                            onChange={(e) => handleChange(index, "field", e)}
                            isClearable={false}
                            noMb={true} 
                       />
                    </div>

                    {/* Operator Select (DINAMIS) */}
                    <div className="w-full md:w-[150px]" style={{ zIndex: 50 - index }}>
                       <FormSelect
                            name={`operator-${index}`}
                            placeholder="Operator"
                            // Gunakan list operator yang sudah difilter
                            options={currentOperators}
                            value={currentOperators.find((o) => o.value === condition.operator) || null}
                            onChange={(e) => handleChange(index, "operator", e)}
                            isClearable={false}
                            noMb={true}
                       />
                    </div>

                    {/* Value Input */}
                    <div className="flex w-full md:flex-1 gap-2 items-center">
                      <input
                        // Ubah tipe input jadi number jika fieldnya number
                        type={isNum ? "number" : "text"}
                        placeholder={isNum ? "0" : "Nilai..."}
                        className="w-full h-[30px] px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        style={{ borderColor: "rgba(156, 163, 175, 0.6)" }} 
                        value={condition.value}
                        onChange={(e) => handleChange(index, "value", e)}
                      />
                      
                      {conditions.length > 1 && (
                        <button 
                            onClick={() => removeCondition(index)} 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors h-[38px] flex items-center justify-center"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <button onClick={addCondition} className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 px-1 py-1 rounded bg-blue-50/50 hover:bg-blue-50 w-fit transition-colors">
                <div className="bg-blue-100 p-1 rounded-full"><Plus size={14} /></div>
                Tambah Kondisi
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 rounded-b-xl">
            <button onClick={handleReset} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-100">
              Atur Ulang
            </button>
            <button onClick={() => { if (onApply) onApply(conditions); onClose(); }} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
              Terapkan Filter
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}