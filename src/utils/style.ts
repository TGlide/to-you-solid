// function that joins classNames together
export const classes = (...classNames: string[]) => {
  return classNames.filter(Boolean).join(" ");
};
