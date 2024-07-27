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
            createCoinData(coinData.data)
            // Display bitcoin as default
            displayCoinData(coinData.data[0])
        })
    } else {
        // maybe get this error to say something more specific to error
        alert("ERROR")
    }
})


// FUNCTIONS

function populateCoinList(cryptocurrency){
    const coinListItem = document.createElement('li')
    coinListItem.textContent = `${cryptocurrency.symbol}: ${cryptocurrency.name}`
    coinList.appendChild(coinListItem)


    // Hover to change color of coinListItem
    coinListItem.addEventListener("mouseover", (e) => {
        coinListItem.id = 'change-color'
    })
    coinListItem.addEventListener("mouseleave", () => {
        coinListItem.id = ""
    })

    // Click to add to MY COINS and DISPLAY COIN DATA
    coinListItem.addEventListener("click", () => {
        // second API call for coin price history
        fetch(`https://api.coincap.io/v2/assets/${cryptocurrency.id}/history?interval=d1`)
        .then(response => response.json())
        .then((coinHistory) => {
            // access last two days of coin history
            // assign array.length to a variable, reference variable instead of calling.length
            const coinHistoryArray = coinHistory.data
            // use pop to do this
            const coinPriceTodayArrayLocation = coinHistoryArray.length -1
            const coinPriceYesterdayArrayLocation = coinHistoryArray.length -2
            // 
            const coinPriceToday = coinHistoryArray[coinPriceTodayArrayLocation].priceUsd;
            const coinPriceYesterday = coinHistoryArray[coinPriceYesterdayArrayLocation].priceUsd;
            const coinChange = coinPriceToday - coinPriceYesterday;
            // console.log("today",coinPriceToday)
            // console.log("yesterday",coinPriceYesterday)
            // console.log("change", coinChange)
            displayCoinTrend(coinChange)
        })

        displayCoinData(cryptocurrency)
    }) 
   
}

function createCoinData (cryptocurrenciesArray){
    cryptocurrenciesArray.forEach((cryptocurrency) => {
        populateCoinList(cryptocurrency)
    })
}

function displayCoinData (cryptocurrency) {
    console.log(cryptocurrency)
    const cryptoName = document.getElementById('name')
    const cryptoSymbol = document.getElementById('symbol')
    const cryptoPrice = document.getElementById('price')
    const crypto24Hr = document.getElementById('24-hour-change')

    const coinPrice = Number(cryptocurrency.priceUsd)
    const coin24Hr = Number(cryptocurrency.changePercent24Hr)

    function roundToTwoDecimalPlace (number) {
        return (Math.round(number * 10 ** 2) / 10 **2);
    }

    cryptoName.textContent = `NAME: ${cryptocurrency.name}`
    cryptoSymbol.textContent = `SYMBOL: ${cryptocurrency.symbol}`
    cryptoPrice.textContent = `PRICE USD: $${roundToTwoDecimalPlace(coinPrice)}`
    crypto24Hr.textContent = `24Hr CHANGE: ${roundToTwoDecimalPlace(coin24Hr)}%`

}

// LEFT OFF HERE ON FRIDAY
function displayCoinTrend (coinChange) {
    console.log(coinChange)
}