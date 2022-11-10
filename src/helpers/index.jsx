

export const minutesAgo = (x) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

