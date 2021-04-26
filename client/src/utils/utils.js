export const objectEmpty = obj => {
  return obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    obj.constructor === Object;
};
