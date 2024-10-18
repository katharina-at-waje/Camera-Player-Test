import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from 'three'


export default function PlayCenKeyStat() {

    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    const body = useRef()

    useFrame((state, delta) => {

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

        // CAMERA

        const bodyPosition = body.current.translation()
        // console.log(bodyPosition)

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)        

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        // cameraTarget.y += 0.25

        cameraPosition.z += 0
        cameraPosition.y += 3
        cameraPosition.x += 3

        state.camera.position.copy(cameraPosition)
        state.camera.lookAt(cameraTarget)
        
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