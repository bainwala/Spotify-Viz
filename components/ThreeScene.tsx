"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import browood_font from "../assets/Browood_Regular.json";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Track } from "@/models/Track";
import { GUI } from "dat.gui";

type ThreeSceneProps = {
  tracks: Track[];
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ tracks }: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  var camera: THREE.PerspectiveCamera;
  var renderer: THREE.WebGLRenderer;

  const createScene = () => {
    console.log("Creating Scene...");
    console.log(isLoading);
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

    const stats = new Stats();
    containerRef.current?.appendChild(stats.dom);
    const gui = new GUI();
    const FeatureFolder = gui.addFolder("Feature");
    FeatureFolder.add({ switch: false }, "switch").name("light switch");
    gui.open();

    const font = new FontLoader().parse(browood_font);
    const material = new THREE.MeshBasicMaterial({ color: "green" });
    var songIndex = 0;
    var z = 0;

    for (var track of tracks) {
      const textGeometry = new TextGeometry(track.name, {
        font: font,
        size: 0.05,
        height: 0.005,
      });

      const row = Math.floor(Math.sqrt(5));
      const x = (songIndex % row) * 3 - (row - 1);
      z = Math.floor(songIndex / row) * 3 - (row - 1);

      const text = new THREE.Mesh(textGeometry, material);
      text.position.set(x * 0.5, 0, z);
      scene.add(text);
      songIndex = songIndex + 1;
    }
    console.log("Tracks Added...");
    const targetPosition = new THREE.Vector3(0, 0, z);
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
    setIsLoading(false);
    console.log("Finished!");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
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

  return <div className="w-1/2 h-1/2 THREE-Canvas" ref={containerRef}></div>;
};

export default ThreeScene;
