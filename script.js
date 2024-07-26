import * as THREE from 'three'

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

// API and DOM 

// Choose coin. Filtered list of coins appears here
const coinList = document.getElementById("coin-list")

// Select Element
const coinFilter = document.getElementById("dropdown-content")

// API call to get coin data
fetch("https://api.coincap.io/v2/assets")
.then(response => {
    if (response.ok) {
        response.json().then(coinData => {
            // console.log(coinData.data)
            displayCoinData(coinData.data)
        })
    } else {
        // maybe get this error to say something more specific to error
        alert("ERROR")
    }
})

// FUNCTIONS

function addCoinsToList(cryptocurrency){
    const coinListItem = document.createElement('li')
    coinListItem.textContent = `${cryptocurrency.symbol}: ${cryptocurrency.name}`
    coinList.appendChild(coinListItem)
}

function displayCoinData (cryptocurrenciesArray){
    cryptocurrenciesArray.forEach((cryptocurrency) => {
        console.log(cryptocurrency)
        addCoinsToList(cryptocurrency)
    })
}