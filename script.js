import * as THREE from 'three'

// SCENE
const scene = new THREE.Scene()

// CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: '#ff0000'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// SIZES
const sizes = {
    width: 800,
    height: 600
}

// CAMERA

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// CANVAS
const canvas = document.querySelector("canvas.webgl")

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)

