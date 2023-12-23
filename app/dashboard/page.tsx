"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

function Dashboard() {
  const [accessToken, setAccessToken] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");

  const handleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_CALLBACK!
    );
    const scopes = encodeURIComponent("user-read-private user-read-email");
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;

    window.location.href = authURL;
  };

  const getMe = async (token: string) => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setName(data.display_name);
    console.log(data);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);
      getMe(accessToken);
    }
  }, []);

  return (
    <div className="flex justify-center items-center mt-12">
      {accessToken === "" ? (
        <Button onClick={handleLogin}>Connect Spotify</Button>
      ) : (
        <div>
          <h1>{"Hi " + name + "!"}</h1>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
