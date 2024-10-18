import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Physics, RigidBody } from "@react-three/rapier"

export default function World() {

    const world = useLoader(GLTFLoader, '/models/blocked-world_1.gltf')

    return (
        <>
        {/* <mesh>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}
        {/* <ambientLight /> */}
        <directionalLight position={ [3, 2, 3] } intensity={3} />
        <directionalLight position={ [-3, 2, 3] } intensity={1} />
        <RigidBody type='fixed' colliders={"trimesh"}  restitution={ 0.2 } friction={ 0 }>
            <primitive object={ world.scene } position={ [0, -0.3, 0] } scale={ [0.3, 0.3, 0.3] } rotation={ [0, Math.PI / 2, 0] }></primitive>
        </RigidBody>
        
        </>
    )
}