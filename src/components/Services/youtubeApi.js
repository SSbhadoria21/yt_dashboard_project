// src/services/youtubeApi.js
import axios from "axios";

const API_KEY = "AIzaSyCO1udCCxDUqSzzLAIRHHvC837Z4zy0GQY";

export const fetchPlaylistVideos = async (playlistId) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlistItems`,
    {
      params: {
        part: "snippet",
        maxResults: 50,
        playlistId,
        key: "AIzaSyCO1udCCxDUqSzzLAIRHHvC837Z4zy0GQY",
      },
    }
  );

  const videos = response.data.items.map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.high?.url,
    watched: false,
  }));

  return videos;
};
