export const fetchBooks = async (url: string) => {
  try {
    return await fetch(url);
  } catch (error) {
    throw error;
  }
};
