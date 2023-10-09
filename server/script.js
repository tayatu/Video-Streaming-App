import { exec } from 'child_process';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import fs from "fs";
import mongodb from "mongodb";


await mongoose.connect("mongodb+srv://sarthakpaliwal7:GagJuQbzUyubXgdJ@cluster0.7p0rg2j.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to the database");

const db = mongoose.connection;
Grid.mongo = mongoose.mongo;
const gfs = Grid(db.db);

const inputVideoPath = 'server/videos/video.mp4'; // Replace with your input video file path
const resolutions = [
  { name: '720p', width: 1280, height: 720 },
  { name: '480p', width: 854, height: 480 },
  { name: '360p', width: 640, height: 360 },
];

// Create HLS playlists for each resolution and save to MongoDB GridFS
resolutions.forEach((resolution) => {
  const { name, width, height } = resolution;
  const outputHLSPath = `server/videos/${name}/index.m3u8`;

  const command = `ffmpeg -i ${inputVideoPath} -vf "scale=${width}:${height}" -c:v h264 -c:a aac -f hls -hls_time 4 -hls_list_size 0 ${outputHLSPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error transcoding to ${name}: ${error.message}`);
      return;
    }

    
    const client = mongoose.connection.getClient();
    const db = client.db("videos");
    const bucket = new mongodb.GridFSBucket(db);

    const videoUploadStream = bucket.openUploadStream(`${name}index.m3u8`);

    const videoReadStream = fs.createReadStream(outputHLSPath);
    videoReadStream.pipe(videoUploadStream);

    console.log(`Transcoding to ${name} completed and saved to MongoDB GridFS.`);
    videoUploadStream.on("finish", () => {
        console.log("Video upload completed.");
      });
  });
});
