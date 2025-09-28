export const getInitials = (name: string) => {
  if (!name) return;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter((w) => w !== undefined);
  if (!initials[0]) return "";
  if (!initials[1]) return initials[0].toUpperCase();
  return (
    initials[0].toUpperCase() + initials[initials.length - 1].toUpperCase()
  );
};
