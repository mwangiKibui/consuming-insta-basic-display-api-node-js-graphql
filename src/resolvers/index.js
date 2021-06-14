const {
  getShortLivedAccessToken,
  getLongLivedAccessToken,
  getProfileData,
  getUserMediaData,
  getSingleMediaData,
  getAlbumData,
} = require("./instagram");

const Query = {
  Query: {
    getShortLivedAccessToken: () => getShortLivedAccessToken(),
    getLongLivedAccessToken: () => getLongLivedAccessToken(),
    getProfileData: () => getProfileData(),
    getUserMediaData: () => getUserMediaData(),
    getSingleMediaData: (_, { media_id }) => getSingleMediaData(media_id),
    getAlbumData: (_, { album_id }) => getAlbumData(album_id),
  },
};

module.exports = Query;
