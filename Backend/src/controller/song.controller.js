const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3"); //

async function uploadSong(req, res) {
  
  // .read() method -> it is used to extract the details of the song which are under the file
  // ie; read() -> reads th buffer and extract details from it like title, url, posterUrl
  const songBuffer = req.file.buffer;
  const { mood } = req.body;

  const tags = id3.read(songBuffer);
  console.log(tags);

  //   // uploading song file on imageKit
  //   const songFile = await storageService.uploadFile({
  //     buffer: songBuffer,
  //     filename: tags.title + ".mp3",
  //     folder: "/cohort/-2/modify/songs",
  //   });

  //   // uploading poster file on imageKit
  //   const posterFile = await storageService.uploadFile({
  //     buffer: tags.image.imageBuffer,
  //     filename: tags.title + ".jpeg",
  //     folder: "/cohort-2/moodify/posters",
  //   });

  // this code uploads songFile & posterFile simultaneously on imakitKit
  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      filename: tags.title + ".mp3",
      folder: "/cohort/-2/modify/songs",
    }),
    // uploading poster file on imageKit
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      filename: tags.title + ".jpeg",
      folder: "/cohort-2/moodify/posters",
    }),
  ]);

  // creating song
  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "song created successfully!",
    song,
  });
}

async function getSong(req, res) {
  
  // fetching mood from req.query
  const { mood } = req.query;

  // finding song with the mood which is received in req.query
  const song = await songModel.findOne({ mood });

  // sending response after finding song of particular mood
  res.status(200).json({
    message: "song fetched successfully!",
    song,
  });
}

module.exports = {
  uploadSong,
  getSong
};
