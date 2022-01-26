const getDateFilename = (): string => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};

export {
  getDateFilename,
};
