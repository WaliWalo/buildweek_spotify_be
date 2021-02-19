const { authorize } = require("../controllers/authMiddleware");
const {
  getSongs,
  getAlbum,
  getTrack,
  createPlaylist,
  addSongToPlaylist,
  getPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
} = require("../controllers/songsController");

const routes = (app) => {
  app.route("/songs/query").get(getSongs);
  app.route("/songs/album").get(getAlbum);
  app.route("/songs/track").get(getTrack);
  app
    .route("/songs/playlist")
    .post(authorize, createPlaylist)
    .get(authorize, getPlaylist);
  app
    .route("/songs/playlist/:playlistId")
    .post(addSongToPlaylist)
    .delete(deletePlaylist);
  app
    .route("/songs/playlist/:playlistId/:songId")
    .delete(deleteSongFromPlaylist);
};

module.exports = routes;
