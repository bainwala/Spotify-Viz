"use client";

import React, { useRef, useEffect } from "react";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import * as THREE from "three";
import browood_font from "../assets/Browood_Regular.json";

const ThreeScene: React.FC = () => {
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
    document.body.appendChild(renderer.domElement);

    const font = new FontLoader().parse(browood_font);
    const textGeometry = new TextGeometry("It Works", {
      font: font,
      size: 0.1,
      height: 0.005,
    });

    const material = new THREE.MeshBasicMaterial({ color: "red" });
    const textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);
    camera.position.z = 1;
    renderer.render(scene, camera);

    function animate() {
      requestAnimationFrame(animate);

      textMesh.rotation.x += 0.01;
      textMesh.rotation.y += 0.01;
      textMesh.rotation.z += 0.01;

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

  return <div ref={containerRef}></div>;
};

export default ThreeScene;
