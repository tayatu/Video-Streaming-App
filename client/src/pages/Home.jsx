import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import "./Home.css";

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(5);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        `/videos/${type}?page=${currentPage}&limit=${videosPerPage}`
      );
      setVideos(res.data.videos);
      setTotalPages(res.data.totalPages);
    };
    fetchVideos();
  }, [type, currentPage, videosPerPage]);

  const handlePageChange = (newPage) => {
    console.log(newPage);

    console.log(totalPages);

    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="Container">
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Home;
