const formatToSlug = (str: string): string => {
  return str.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

export {
  formatToSlug,
}