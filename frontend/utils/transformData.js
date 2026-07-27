export const transformData = (data) => {
  return data?.pages?.flatMap((page) => page.data) ?? [];
};
