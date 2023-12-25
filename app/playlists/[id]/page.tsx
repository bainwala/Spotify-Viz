"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Track } from "@/models/Track";
import axios from "axios";
import ThreeScene from "@/components/ThreeScene";

type Props = {
  params: {
    id: string;
  };
};

type TracksReturnProps = {
  items: [
    {
      track: Track;
    }
  ];
};

function page({ params: { id } }: Props) {
  const searchParams = useSearchParams();
  const [tracks, setTracks] = useState<Track[]>();

  const getTracks = async () => {
    const { data } = await axios.get<TracksReturnProps>(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        headers: {
          Authorization: "Bearer " + searchParams.get("token"),
        },
      }
    );
    var tempTrackArray = [];
    for (var track of data.items) {
      tempTrackArray.push({
        name: track.track.name,
      });
    }
    setTracks([...tempTrackArray]);
  };

  useEffect(() => {
    getTracks();
  }, []);

  return (
    <div className="flex justify-center items-center mt-12 flex-col space-y-4">
      {/* {tracks?.map((track) => (
        <h1>{track.name}</h1>
      ))} */}
      <ThreeScene />
    </div>
  );
}

export default page;
