export const getGroupCoverUrl = (cover) => {
  if (cover === "" || cover === "/static-resources/default-cover.jpg") {
    return require("../assets/default-cover.jpg");
  }
  return { cover };
};
