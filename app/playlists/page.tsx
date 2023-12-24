"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Playlist } from "@/models/Playlist";
import { useRouter } from "next/navigation";

type PlaylistsReturnProps = {
  items: [Playlist];
};

function PlayLists() {
  const searchParams = useSearchParams();
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const router = useRouter();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  const getUserPlaylists = async () => {
    const { data } = await axios.get<PlaylistsReturnProps>(
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
    <div className="flex justify-center items-center mt-12 flex-col space-y-4">
      {playlists?.map((playlist) => (
        <Button
          key={playlist.id}
          onClick={() =>
            router.push(
              "/playlists/" +
                playlist.id +
                "?" +
                createQueryString("token", searchParams.get("token")!)
            )
          }
        >
          {playlist.name}
        </Button>
      ))}
    </div>
  );
}

export default PlayLists;
