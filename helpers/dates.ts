export const formatFullDateWithTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleString().slice(0, 17);
};

export const formatDateForDateTimeLocalInput = (isoDate: string) => {
  const d = new Date(isoDate);
  const dateString = `${d.getFullYear()}-${d
    .getMonth()
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  const timeString = d.toLocaleTimeString().slice(0, 5);
  const formattedDate = `${dateString}T${timeString}`;

  console.log(formattedDate);
  return formattedDate;
};
