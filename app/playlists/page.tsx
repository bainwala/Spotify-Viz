"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Playlist } from "@/models/Playlist";

type PlaylistReturnProps = {
  items: [
    {
      description: string;
      name: string;
      id: string;
    }
  ];
};

function PlayList() {
  const searchParams = useSearchParams();
  const [playlists, setPlaylists] = useState<Playlist[]>();

  const getUserPlaylists = async () => {
    const { data } = await axios.get<PlaylistReturnProps>(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: "Bearer " + searchParams.get("token"),
        },
      }
    );
    var tempPlaylistArray = [];
    for (var playlist of data.items) {
      tempPlaylistArray.push({
        description: playlist.description,
        name: playlist.name,
        id: playlist.id,
      });
    }
    setPlaylists([...tempPlaylistArray]);
  };

  useEffect(() => {
    getUserPlaylists();
  }, []);

  return (
    <div className="flex justify-center items-center mt-12 flex-col">
      {playlists?.map((playlist) => (
        <h1>{playlist.name}</h1>
      ))}
    </div>
  );
}

export default PlayList;
