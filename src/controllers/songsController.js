const mongoose = require("mongoose");
const PlaylistSchema = require("../models/playlistModel");
const Playlist = mongoose.model("Playlist", PlaylistSchema);
const axios = require("axios");

const getSongs = async (req, res, next) => {
  const { query } = req.query;
  const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`;
  try {
    const response = await axios.get(url, {
      method: "get",
      headers: {
        "x-rapidapi-key": "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
    if (response.statusText === "OK") {
      const data = response.data;
      res.status(201).send(data);
    } else {
      const error = new Error("Something went wrong");
      error.httpStatusCode = 500;
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 404;
    next(error);
  }
};

const getAlbum = async (req, res, next) => {
  const { id } = req.query;
  const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${id}`;
  try {
    const response = await axios.get(url, {
      method: "get",
      headers: {
        "x-rapidapi-key": "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
    if (response.statusText === "OK") {
      const data = response.data;
      res.status(201).send(data);
    } else {
      const error = new Error("Something went wrong");
      error.httpStatusCode = 500;
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 404;
    next(error);
  }
};

const getTrack = async (req, res, next) => {
  const { track } = req.query;
  const url = `https://deezerdevs-deezer.p.rapidapi.com/track/${track}`;
  try {
    const response = await axios.get(url, {
      method: "get",
      headers: {
        "x-rapidapi-key": "a44588e47dmsh9b184d3ebdf2d08p1faa3djsn2e64ecb46487",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    });
    if (response.statusText === "OK") {
      const data = response.data;
      res.status(201).send(data);
    } else {
      const error = new Error("Something went wrong");
      error.httpStatusCode = 500;
      next(error);
    }
  } catch (error) {
    error.httpStatusCode = 404;
    next(error);
  }
};

const createPlaylist = async (req, res, next) => {
  try {
    // console.log(req.params);
    let newPlaylist = {
      userId: mongoose.Types.ObjectId(req.user._id),
      name: req.body.name,
      songs: [],
    };
    let playlist = new Playlist(newPlaylist);
    let addedPlaylist = await playlist.save();
    res.status(201).send({ playlist: addedPlaylist });
  } catch (error) {
    console.log(error);
  }
};

const addSongToPlaylist = async (req, res, next) => {
  try {
    const selectedPlaylist = await Playlist.findById(req.params.playlistId);

    if (selectedPlaylist) {
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.params.playlistId,
        {
          $set: {
            songs: [
              ...selectedPlaylist.songs,
              mongoose.Types.ObjectId(req.body.songId),
            ],
          },
        }
      );
      res.status(201).send(updatedPlaylist);
    } else {
      let error = new Error("User not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const getPlaylist = async (req, res, next) => {
  const playlist = await Playlist.find({ userId: req.user._id });
  if (playlist.length !== 0) {
    res.status(200).send(playlist);
  } else {
    let error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { _id } = await Playlist.findByIdAndDelete(req.params.playlistId);
    res.status(201).send({ msg: `${_id} deleted` });
  } catch (error) {
    next(error);
  }
};

const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const selectedPlaylist = await Playlist.findById(req.params.playlistId);
    const playlistWithoutSelectedSong = selectedPlaylist.songs.filter(
      (song) =>
        mongoose.Types.ObjectId(song) !==
        mongoose.Types.ObjectId(req.params.songId)
    );
    if (selectedPlaylist) {
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.params.playlistId,
        {
          $set: {
            songs: [playlistWithoutSelectedSong],
          },
        }
      );
      res.status(201).send(updatedPlaylist);
    } else {
      let error = new Error("User not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSongs,
  getAlbum,
  getTrack,
  createPlaylist,
  addSongToPlaylist,
  getPlaylist,
  deletePlaylist,
  deleteSongFromPlaylist,
};
