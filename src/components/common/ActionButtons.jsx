import Button from "./Button";

export default function ActionButtons({
  onAddData,
  onUploadExcel,
  onDownload,
  onFilter,
  onSave,
  onBack,
  onRefresh,
  onClose,
  isLoading,
  onCtrHourAccess,
  onSave2,
  buttonSize = "medium",
}) {
  return (
    <div className="flex flex-col items-start justify-end space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
      {onBack && (
        <Button
          onClick={onBack}
          variant="outline"
          icon={"Undo2"}
          label={"Kembali"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onCtrHourAccess && (
        <Button
          onClick={onCtrHourAccess}
          variant="approve"
          icon={"UserCheck"}
          label={"Bypass Access Hour"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant="outline"
          icon={"RotateCcw"}
          label={"Refresh"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onDownload && (
        <Button
          onClick={onDownload}
          variant="doff"
          icon={"FileSpreadsheet"}
          label={"Download Data"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onFilter && (
        <Button
          onClick={onFilter}
          variant="doff"
          icon={"Filter"}
          label={"Filter"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onUploadExcel && (
        <Button
          onClick={onUploadExcel}
          variant="upload"
          icon={"Upload"}
          label={"Upload Excel"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onAddData && (
        <Button
          onClick={onAddData}
          variant="submit"
          icon={"Plus"}
          label={"Tambah Data"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onSave && (
        <Button
          type="submit"
          variant="submit"
          icon={"Check"}
          label={"Simpan"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}
      {onSave2 && (
        <Button
          onClick={onSave2}
          variant="submit"
          icon={"Check"}
          label={"Simpan"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}

      {onClose && (
        <Button
          onClick={onClose}
          variant="submit"
          icon={"Check"}
          label={"Close"}
          isLoading={isLoading}
          size={buttonSize}
        />
      )}
    </div>
  );
}
