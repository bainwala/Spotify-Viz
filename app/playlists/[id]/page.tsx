"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Track } from "@/models/Track";
import axios from "axios";
import ThreeScene from "@/components/ThreeScene";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [position, setPosition] = useState<string>("Artists");

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
        artists: track.track.artists,
      });
    }
    setTracks([...tempTrackArray]);
  };

  useEffect(() => {
    getTracks();

    return () => {
      const canvas = document.querySelector(".THREE-Canvas");
      canvas?.remove();
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{position}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="Artists">
              Artists
            </DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioItem value="Tracks">Tracks</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex justify-center items-center mt-12 flex-col space-y-4">
        {tracks?.length ? (
          <ThreeScene tracks={tracks} dataType={position} />
        ) : null}
      </div>
    </div>
  );
}

export default page;
