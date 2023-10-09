import http  from 'http';
import HLS  from 'hls-server';
import mongoose  from 'mongoose';
import Grid   from 'gridfs-stream';
import dotenv from "dotenv";
import fs from "fs";



await mongoose.connect("mongodb+srv://sarthakpaliwal7:GagJuQbzUyubXgdJ@cluster0.7p0rg2j.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to the database");

const db = mongoose.connection;
Grid.mongo = mongoose.mongo;
const gfs = Grid(db.db);

const server = http.createServer((req, res) => {
  if (req.url.endsWith('.m3u8')) {
    const readStream = gfs.createReadStream({ filename: req.url });

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

    // Pipe the read stream to the response
    readStream.pipe(res);
  }
});

const hls = new HLS(server, {
  path: '/hls', // URL path for HLS streams
});

const port = 8080;
server.listen(port, () => {
  console.log(`HLS server is running on http://localhost:${port}`);
});