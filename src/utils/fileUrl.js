export const buildFileUrl = (path) => {
  if (!path) return "/assets/images/default_teacher.jpg";

  if (path.startsWith("http")) return path;

  return `${process.env.REACT_APP_DEV_API_URL}${path}`;
};
