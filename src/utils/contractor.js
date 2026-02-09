export function getDefaultExpDateContractor(expDayParam, expMonthInterval) {
  const today = new Date();

  const baseDate = new Date(today);
  baseDate.setMonth(baseDate.getMonth() + expMonthInterval);

  let expdt = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    expDayParam,
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
    today.getMilliseconds()
  );

  if (expdt.getMonth() !== baseDate.getMonth()) {
    expdt = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  }

  const year = expdt.getFullYear();
  const month = String(expdt.getMonth() + 1).padStart(2, "0");
  const day = String(expdt.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isExpiringWithinDays(expDate, dayLeft) {
  if (!expDate) return false;

  const today = new Date();
  const expirationDate = new Date(expDate);
  const diffInTime = expirationDate.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

  return diffInDays <= dayLeft && diffInDays >= 0;
}

export function mustContractorReset(formData, currentData, fieldLabels = {}) {
  if (!currentData) return [];

  const changedFields = [];

  Object.keys(fieldLabels).forEach((field) => {
    if (formData[field] !== currentData[field]) {
      changedFields.push(fieldLabels[field]);
    }
  });

  return changedFields;
}
