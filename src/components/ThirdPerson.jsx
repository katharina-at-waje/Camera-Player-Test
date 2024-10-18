import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import { MathUtils, Vector3 } from "three"
import { degToRad } from "three/src/math/MathUtils.js"

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const ThirdPerson = () => {

  const WALK_SPEED = 0.8
  const RUN_SPEED = 0.8
  const ROTATION_SPEED = degToRad(3)
  const CAMERA_POSITION_Y = 3
  const CAMERA_POSITION_Z = 2

  const rb = useRef();
  const container = useRef();
  const character = useRef();

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true;
    };
    const onMouseUp = (e) => {
      isClicking.current = false;
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    // touch
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if (rb.current) {
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        console.log("clicking", mouse.x, mouse.y);
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().leftward) {
        movement.x = 1;
      }
      if (get().rightward) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
      } 
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      rb.current.setLinvel(vel, true);
    }

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody lockRotations ref={rb} canSleep={ false } colliders="ball" restitution={ 0.2 } friction={ 1 } linearDamping={ 3 } angularDamping={ 3 }>
      <group ref={container}>
        <group ref={cameraTarget} position-z={0.5} />
        <group ref={cameraPosition} position-y={CAMERA_POSITION_Y} position-z={- CAMERA_POSITION_Z} />
        <group ref={character}>
            <mesh position={ [0, 1, 0] }>
                <icosahedronGeometry args={ [0.15, 1] } />
                <meshStandardMaterial color='white' />
            </mesh>
        </group>
      </group>
      {/* <CapsuleCollider args={[0.08, 0.15]} /> */}
    </RigidBody>
  );
};
