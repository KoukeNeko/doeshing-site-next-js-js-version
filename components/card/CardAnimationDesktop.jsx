import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useControls } from "leva";

// 擴展 meshline 幾何與材質，使其可在 JSX 中使用
extend({ MeshLineGeometry, MeshLineMaterial });

// 預先載入模型與貼圖
useGLTF.preload(
  "https://pub-d2c4f3e05c9b425d8db726c2b57fa0e2.r2.dev/untitled.glb"
);
useTexture.preload(
  "https://media.discordapp.net/attachments/1072368013581492304/1348582286378930266/band-SITCON.jpg?ex=67cffca0&is=67ceab20&hm=2189c8bd6b2faf4f9d669fcd59e80cd71c443a36d3bc8f30085eef61c5ffb675&=&format=webp"
);

export default function App() {
  // 利用 leva 控制 debug 模式（可調整物理 debug 視覺化）
  // const { debug } = useControls({ debug: false });
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      {/* 環境光 */}
      <ambientLight intensity={Math.PI} />
      {/* Physics 提供物理模擬環境 */}
      <Physics
        debug={false}
        interpolate
        gravity={[0, -40, 0]}
        timeStep={1 / 60}
      >
        <Band />
      </Physics>
      {/* 獨立的背景環境，不受物理模擬影響 */}
      <Environment background blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  // 取得畫布尺寸，MeshLine 需要解析度資訊
  const { width, height } = useThree((state) => state.size);
  // 建立各物理物件的參考
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  // 建立輔助向量，方便做數學計算
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // 統一設定物理物件的屬性
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  // 載入 glTF 模型與貼圖，這邊的模型用於卡片與其他裝飾
  const { nodes, materials } = useGLTF(
    "https://pub-d2c4f3e05c9b425d8db726c2b57fa0e2.r2.dev/untitled.glb"
  );
  const texture = useTexture(
    "https://media.discordapp.net/attachments/1072368013581492304/1348582286378930266/band-SITCON.jpg?ex=67cffca0&is=67ceab20&hm=2189c8bd6b2faf4f9d669fcd59e80cd71c443a36d3bc8f30085eef61c5ffb675&=&format=webp"
  );

  // 建立一條 Catmull-Rom 曲線，用來根據各物理節點產生平滑曲線（32 個點）
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  // 狀態：拖曳與懸停
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // 建立繩索連接，利用 Rapier 的 useRopeJoint 與 useSphericalJoint
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  // 當滑鼠懸停時改變游標
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    // 若處於拖曳狀態，計算卡片的新位置
    if (dragged) {
      // 將滑鼠指標轉換成世界座標
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      // 喚醒所有物件，防止物理休眠
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      // 設定卡片的下一個位置（扣除拖曳偏移量）
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      // 修正 j1 與 j2 的位移，減少過度拉伸造成的抖動
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      // 更新曲線點，根據各個連接點的位置產生平滑曲線
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      // 更新 MeshLine 幾何的點陣列（32 個插值點）
      band.current.geometry.setPoints(curve.getPoints(32));
      // 調整卡片角速度，使其略微回正（讓卡片保持面向螢幕）
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  // 設定貼圖包覆模式
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  curve.curveType = "chordal";

  return (
    <>
      {/* 包含所有物理節點與卡片的群組，這裡位置 [0,4,0] 為大致的初始位置 */}
      <group position={[-1, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          {/* 卡片的可拖曳區域 */}
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              // 計算拖曳起始偏移量
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
          >
            {/* 卡片模型（從 glTF 載入） */}
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      {/* 利用 MeshLine 顯示繩索 */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
