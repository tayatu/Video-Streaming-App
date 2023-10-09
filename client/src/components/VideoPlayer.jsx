
// import React, { useState } from 'react';

// const VideoPlayer = () => {

//   return (
//     <div>
//       <div>
//         <label htmlFor="byteRange">Byte Range:</label>
        
//       </div>
//       <video id="videoPlayer" width="650" controls muted="muted">
//         <source src={`/videos/mongo-video`} type="video/mp4" />
//       </video>
      
//     </div>
//   );
// }

// export default VideoPlayer;
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';



function VideoPlayer() {
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { currentVideo } = useSelector((state) => state.video);

  console.log(currentVideo);


  const videoQualities = [
    { label: 'Low Quality', url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=360p` },
    { label: 'Medium Quality', url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=480p` },
    { label: 'High Quality', url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=720p` },
  ];
  
  const handleQualityChange = (index) => {
    setSelectedQuality(index);
    // Pause the video when changing quality (you can adjust this behavior as needed)
    setPlaying(false);
  };

  return (
    <div>
      <ReactPlayer
        url={videoQualities[selectedQuality].url}
        playing={playing}
        volume={1} // Adjust the volume as needed
        controls={true}
        width="100%"
        height="100%"
        onError={(error) => console.error('Video error:', error)}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
      <div>
        <p>Select video quality:</p>
        <ul>
          {videoQualities.map((quality, index) => (
            <li key={index}>
              <button onClick={() => handleQualityChange(index)}>{quality.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VideoPlayer;
