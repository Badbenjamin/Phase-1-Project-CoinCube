import * as THREE from 'three'
import { Wireframe } from 'three/examples/jsm/Addons.js';

// SCENE
const scene = new THREE.Scene()

// CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: '#ff0000'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// TRANSFORMS
// mesh.rotation.x = Math.PI * 0.25
// mesh.rotation.y = Math.PI * 0.25


// SIZES
const sizes = {
    width: 600,
    height: 400
}

// CAMERA

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)
camera.lookAt(mesh.position)

// CANVAS
const canvas = document.querySelector("canvas.webgl")

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// CLOCK
const clock = new THREE.Clock()

// ANIMATOR FUNCTION

const animate = () => {
    // Elapsed Time
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    mesh.rotation.y = elapsedTime 
    
    // Render
    renderer.render(scene, camera)
    
    // Call animate on next frame
    window.requestAnimationFrame(animate)
}
animate()