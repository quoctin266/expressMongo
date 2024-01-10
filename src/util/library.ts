export const parseBoolean = (value: any) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};
