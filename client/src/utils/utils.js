export const objectEmpty = obj => {
  return obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    obj.constructor === Object;
};

export const validPassword = (value) => {
  const regex = /((?=.*[a-z])(?=.*[0-9])(?=.{6,}))/;
  return value.match(regex)
}
