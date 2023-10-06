const formatToSlug = (str: string): string => {
  return str.replace(/-/g,' ').trim().toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

const formatToName = (str: string): string => {
  return str.toLowerCase().replace(/-/g,' ').replace(/\b\w/g, l => l);
}

export {
  formatToSlug,
  formatToName,
}