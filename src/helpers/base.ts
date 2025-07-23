export const getCompatUnit = (unit: string | number) => {
  return unit.toString().includes("%") ? unit : unit + "px";
};
