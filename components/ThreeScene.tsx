"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import browood_font from "../assets/Browood_Regular.json";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font, FontLoader } from "three/addons/loaders/FontLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Track } from "@/models/Track";

type ThreeSceneProps = {
  tracks: Track[];
  dataType: string;
};

const addConnections = (
  scene: THREE.Scene,
  dataHashMap: Map<string, THREE.Vector3>,
  dataNetwork: Set<string>
) => {
  dataNetwork.forEach((connection) => {
    const [artist1, artist2] = connection
      .split("-")
      .map((el) => dataHashMap.get(el));

    if (artist1 != undefined && artist2 != undefined) {
      var tG = new THREE.BufferGeometry().setFromPoints([artist1, artist2]);
      var tM = new THREE.LineBasicMaterial({ color: "yellow" });
      var tracker = new THREE.Line(tG, tM);
      scene.add(tracker);
    }
  });
};

const addTracksToScene = (
  tracks: Track[],
  font: Font,
  scene: THREE.Scene,
  z: number
) => {
  var songIndex = 0;
  var tracksSet = new Set<string>();
  for (var track of tracks) {
    if (tracksSet.has(track.name)) continue;
    else tracksSet.add(track.name);

    const textGeometry = new TextGeometry(track.name, {
      font: font,
      size: 0.05,
      height: 0.005,
    });

    const material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    const row = Math.floor(Math.sqrt(5));
    const x = (songIndex % row) * 3 - (row - 1);
    z = Math.floor(songIndex / row) * 3 - (row - 1);

    const text = new THREE.Mesh(textGeometry, material);
    text.position.set(x * 0.5, 0, z);
    scene.add(text);
    songIndex = songIndex + 1;
  }
  return z;
};

const addArtistsToScene = (
  tracks: Track[],
  font: Font,
  scene: THREE.Scene,
  z: number
) => {
  var songIndex = 0;
  var artistsSet = new Set<string>();
  var artistsHashMap = new Map<string, THREE.Vector3>();
  var artistsNetwork = new Set<string>();

  for (var track of tracks) {
    for (var artist of track.artists) {
      if (artistsSet.has(artist.name)) continue;
      else artistsSet.add(artist.name);

      const textGeometry = new TextGeometry(artist.name, {
        font: font,
        size: 0.05,
        height: 0.005,
      });

      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      const row = Math.floor(Math.sqrt(5));
      const x = (songIndex % row) * 3 - (row - 1);
      z = Math.floor(songIndex / row) * 3 - (row - 1);

      const text = new THREE.Mesh(textGeometry, material);
      text.position.set(x * 0.5, 0, z);
      scene.add(text);
      artistsHashMap.set(artist.name, new THREE.Vector3(x * 0.5, 0, z));
      songIndex = songIndex + 1;

      for (var artist2 of track.artists) {
        if (artist.name === artist2.name) continue;
        if (
          !artistsNetwork.has(artist.name + "-" + artist2.name) &&
          !artistsNetwork.has(artist2.name + "-" + artist.name)
        ) {
          artistsNetwork.add(artist.name + "-" + artist2.name);
        }
      }
    }
  }
  addConnections(scene, artistsHashMap, artistsNetwork);
  return z;
};

const ThreeScene: React.FC<ThreeSceneProps> = ({
  tracks,
  dataType,
}: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  var camera: THREE.PerspectiveCamera;
  var renderer: THREE.WebGLRenderer;

  const createScene = () => {
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color("hsl(222.2, 84%, 4.9%)");
    scene.background = bgColor;
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    const moveSpeed = 0.5;

    const font = new FontLoader().parse(browood_font);
    var z = 0;

    z =
      dataType == "Tracks"
        ? addTracksToScene(tracks, font, scene, z)
        : addArtistsToScene(tracks, font, scene, z);

    const targetPosition = new THREE.Vector3(0.45, 2, z);
    renderer.render(scene, camera);

    function onKeyDown(event: KeyboardEvent) {
      switch (event.code) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          event.preventDefault();
          break;
        default:
          break;
      }

      switch (event.code) {
        case "ArrowUp":
          targetPosition.z -= moveSpeed;
          break;
        case "ArrowDown":
          targetPosition.z += moveSpeed;
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      camera.position.lerp(targetPosition, 0.1);
      renderer.render(scene, camera);
    }

    animate();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      createScene();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <div className="THREE-Canvas" ref={containerRef}></div>;
};

export default ThreeScene;
