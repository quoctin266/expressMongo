export const parseBoolean = (value: any) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

export const hasSameElements = (array1: string[], array2: string[]) => {
  if (array1.length === array2.length) {
    return array1.every((element) => {
      if (array2.includes(element)) {
        return true;
      }

      return false;
    });
  }

  return false;
};
