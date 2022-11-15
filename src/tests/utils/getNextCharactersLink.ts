const url = "https://www.anapioficeandfire.com/api/characters";

export const getNextCharactersLink = (page: number) => {
  const lastPage = 43;
  let currentPage = 1;

  if (page > 0 && Number.isInteger(page)) currentPage = page;

  if (currentPage < lastPage)
    return `<${url}?page=${currentPage + 1}&pageSize=50>; rel="next",`;
  else return `<${url}?page=${currentPage - 1}&pageSize=50>; rel="prev",`;
};
