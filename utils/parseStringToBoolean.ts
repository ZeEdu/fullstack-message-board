const parseStringToBoolean = (v: string) => {
  const z = v.toLowerCase();
  let r = false;
  if (z === "true") r = true;
  else if (z === "false") r = false;
  else throw new Error("Not a valid string");
  return r;
};

export default parseStringToBoolean;
