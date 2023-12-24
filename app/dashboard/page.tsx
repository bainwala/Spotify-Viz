"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/models/User";
import axios from "axios";
import { useRouter } from "next/navigation";

function Dashboard() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  const getMe = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    console.log(data);
    setUser({ ...data });
  };

  const handleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_CALLBACK!
    );
    const scopes = encodeURIComponent("user-read-private user-read-email");
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;

    window.location.href = authURL;
  };

  useEffect(() => {
    if (accessToken != "") getMe();
  }, [accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");

    if (accessToken && accessToken != "") {
      setAccessToken(accessToken);
    }
  }, []);

  const GoToSpotify = () => {
    const popup = window.open(user?.external_urls.spotify);
  };

  return (
    <div className="flex justify-center items-center mt-12">
      {accessToken === "" ? (
        <Button onClick={handleLogin}>Connect Spotify</Button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h1>{"Hi " + user?.display_name + "!"}</h1>
          <div className="flex flex-row space-x-4 items-center">
            <h1>Followers: {user?.followers.total}</h1>
            <Button onClick={() => GoToSpotify()}>Go To Spotify</Button>
          </div>
          <Button
            onClick={() =>
              router.push(
                "/playlists" + "?" + createQueryString("token", accessToken)
              )
            }
          >
            Playlists
          </Button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
