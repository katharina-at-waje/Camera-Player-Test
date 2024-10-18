import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from 'three'


export default function PlayerAlt() {

    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    const body = useRef()

    useFrame((state, delta) => {

        // Reset the camera position and orientation when Player is active
        state.camera.position.set(4, 4, 4) // Replace with your default camera position
        state.camera.lookAt(new THREE.Vector3(0, 0, 0)) // Replace with your default camera target

        // CONTROLS

        const { forward, backward, leftward, rightward } = getKeys()

        const movementSpeed = 2 * delta

        const position = body.current.translation()

        if (forward) {
            position.x -= movementSpeed
        }
    
        if (rightward) {
            position.z -= movementSpeed
        }
    
        if (backward) {
            position.x += movementSpeed
        }
        
        if (leftward) {
            position.z += movementSpeed
        }

        body.current.setTranslation(position, true)  // Update position directly
        
    })


    return (
        <RigidBody ref={ body } canSleep={ false } colliders="ball" position={ [0, 1, 0] } restitution={ 0.2 } friction={ 1 } linearDamping={ 3 } angularDamping={ 3 }>
            <mesh>
                <icosahedronGeometry args={ [0.15, 1] } />
                <meshStandardMaterial color='white' />
            </mesh>
        </RigidBody>
    )
}