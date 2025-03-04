import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Planet = ({ size, speed, distance, color }) => {
  const mesh = useRef();
  const [angle, setAngle] = useState(0);

  useFrame((_, delta) => {
    setAngle((prev) => prev + speed * delta);
    mesh.current.position.x = distance * Math.cos(angle);
    mesh.current.position.z = distance * Math.sin(angle);
  });

  return (
    <group>
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const SolarSystem = () => {
  const [planets, setPlanets] = useState([
    { size: 0.38, speed: 0.4, distance: 2, color: "gray" }, // Mercury
    { size: 0.95, speed: 0.3, distance: 3, color: "orange" }, // Venus
    { size: 1, speed: 0.25, distance: 4, color: "blue" }, // Earth
    { size: 0.53, speed: 0.2, distance: 5, color: "red" }, // Mars
    { size: 2, speed: 0.15, distance: 7, color: "orange" }, // Jupiter
    { size: 1.6, speed: 0.1, distance: 9, color: "yellow" }, // Saturn
    { size: 1.4, speed: 0.07, distance: 11, color: "lightblue" }, // Uranus
    { size: 1.3, speed: 0.05, distance: 13, color: "blue" }, // Neptune
  ]);

  const handleUpdate = (index, property, value) => {
    setPlanets((prev) => {
      const newPlanets = [...prev];
      newPlanets[index] = { ...newPlanets[index], [property]: value };
      return newPlanets;
    });
  };

  const saveConfig = async () => {
    await addDoc(collection(db, "solarConfigs"), { planets });
  };

  const loadConfig = async () => {
    const querySnapshot = await getDocs(collection(db, "solarConfigs"));
    if (!querySnapshot.empty) {
      setPlanets(querySnapshot.docs[0].data().planets);
    }
  };

  return (
    <div className="container">
      <Canvas className="canvas" camera={{ position: [0, 10, 20] }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
        {planets.map((p, index) => (
          <Planet key={index} {...p} />
        ))}
        <OrbitControls />
      </Canvas>
      <div className="settings">
        {planets.map((p, index) => (
          <div key={index} className="planet-controls">
            <h3>Planet {index + 1}</h3>
            <label>Size: </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={p.size}
              onChange={(e) => handleUpdate(index, "size", parseFloat(e.target.value))}
            />
            <label>Speed: </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={p.speed}
              onChange={(e) => handleUpdate(index, "speed", parseFloat(e.target.value))}
            />
            <label>Distance: </label>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={p.distance}
              onChange={(e) => handleUpdate(index, "distance", parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={saveConfig}>Save Configuration</button>
        <button onClick={loadConfig}>Load Configuration</button>
      </div>
    </div>
  );
};

export default SolarSystem;
