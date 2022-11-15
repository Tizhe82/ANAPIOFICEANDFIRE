export const parseHeaders = (res: Response) => {
  return res.headers
    .get("link")
    ?.split(",")
    .reduce((acc: any, link) => {
      const resReg = /^\<(.+)\>; rel="(.+)"$/.exec(link.trim());

      if (!resReg) return acc;

      acc[resReg[2]] = resReg[1];
      return acc;
    }, {});
};
