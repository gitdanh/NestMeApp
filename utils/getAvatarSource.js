export const getAvatarSource = (uri) => {
  if (uri === "") {
    return require("../assets/default-avatar.jpg");
  }
  return { uri };
};
