import React, { useEffect, useState } from "react";
import "./App.css";

function VideoComponent({
  inputValue,
  elements,
  onLike,
  onDislike,
  onDelete,
  setOrder,
  sortOrder,
}) {
  return (
    <div>
      <div id="ascendingButton">
        <button
          className={`btn btn-light customBackground1 ${
            sortOrder === "ascending" ? "active" : ""
          }`}
          onClick={() => setOrder("ascending")}
        >
          Ascending
        </button>
        <button
          className={`btn btn-light customBackground1 ${
            sortOrder === "descending" ? "active" : ""
          }`}
          onClick={() => setOrder("descending")}
        >
          Descending
        </button>
      </div>

      <div className="container">
        <div className="videoDisplayContainer">
          <VideoDisplay
            inputValue={inputValue}
            elements={elements}
            onLike={onLike}
            onDislike={onDislike}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
function VideoDisplay({ inputValue, elements, onLike, onDislike, onDelete }) {
  let inputValues = (inputValue.inputValue)
 
  return inputValues === "" ? (
    <div className="videoDisplayContainer">
      {" "}
      {elements.map((element) => (
        <div key={element.id} class="displayGrid">
          <h5>{element.title}</h5>

          <iframe
            width="270"
            height="200"
            title={element.title}
            border="none"
            border-radius="103px"
            frameborder="0"
            allowfullscreen
            align="center"
            src={element.url}
          ></iframe>
          <div className="likedislikeBtn">
            <button
              className="btn btn-light customBackground5"
              onClick={() => onLike(element.id)}
            >
              Like
            </button>
            <span>Votes:&nbsp;{element.rating}</span>

            <button
              className="btn btn-light customBackground5"
              onClick={() => onDislike(element.id)}
            >
              Dislike
            </button>
          </div>
          <button
            className="btn btn-light deleteBtn"
            onClick={() => onDelete(element.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="videoDisplayContainer">
      {elements
        .filter((element) => element.title.includes(inputValues))
        .map((element) => (
          <div key={element.id} className="displayGrid">
            <h5>{element.title}</h5>
            <iframe
              width="330"
              height="200"
              title={element.title}
              allowFullScreen
              src={element.url}
            ></iframe>
            <div className="likedislikeBtn">
              <button
                className="btn btn-light customBackground5"
                onClick={() => onLike(element.id)}
              >
                Like
              </button>
              <span>Votes:&nbsp;{element.rating}</span>
              <button
                className="btn btn-light customBackground5"
                onClick={() => onDislike(element.id)}
              >
                Dislike
              </button>
            </div>
            <button
              className="btn btn-light deleteBtn"
              onClick={() => onDelete(element.id)}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default function AllVideoDisplay(inputValue) {
  const [videoData, setVideoData] = useState([]);
  const [sortOrder, setSortOrder] = useState("descending");

  useEffect(() => {
    fetch("/videos")
      .then((response) => response.json())
      .then((updatedData) => {
        setVideoData(updatedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const sortVideoData = () => {
    const sortedData = [...videoData];

    if (sortOrder === "ascending") {
      sortedData.sort((a, b) => a.rating - b.rating);
    } else {
      sortedData.sort((a, b) => b.rating - a.rating);
    }

    return sortedData;
  };

  const handleLike = (videoId) => {
    const updatedVideos = videoData.map((video) => {
      if (video.id === videoId) {
        return { ...video, rating: video.rating + 1 };
      }
      return video;
    });
    setVideoData(updatedVideos);

    fetch(`/videos/${videoId}/like`, { method: "POST" });
  };

  const handleDislike = (videoId) => {
    const updatedVideos = videoData.map((video) => {
      if (video.id === videoId) {
        return { ...video, rating: Math.max(video.rating - 1, 0) };
      }
      return video;
    });
    setVideoData(updatedVideos);

    fetch(`/videos/${videoId}/dislike`, { method: "POST" });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/videos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setVideoData((videoData) =>
          videoData.filter((element) => element.id !== id)
        );
      } else {
        console.error("Error deleting video:");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <VideoComponent
      inputValue={inputValue}
      elements={sortVideoData()}
      sortOrder={sortOrder}
      setOrder={setSortOrder}
      onLike={handleLike}
      onDislike={handleDislike}
      onDelete={handleDelete}
    />
  );
}
