const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/Resume' : '';

export const getAssetPath = (path) => {
  // Remove leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}/${cleanPath}`;
};
