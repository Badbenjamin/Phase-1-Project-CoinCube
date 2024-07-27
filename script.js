import * as THREE from 'three'

// GLOBAL ANIMATION VARIABLES
let cubeColor = { color: '' };
let cubeSpin = 1;

// SCENE
const scene = new THREE.Scene()

// CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "white" })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
console.log("first color", material.color)

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

function populateCoinList(cryptocurrency) {
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
        // second API call for coin price history, NEEDS WORK
        // Maybe get price from 24hrs ago by hour?
        // fetch(`https://api.coincap.io/v2/assets/${cryptocurrency.id}/history?interval=d1`)
        //     .then(response => response.json())
        //     .then((coinHistory) => {
        //         displayCoinTrend(coinHistory)
        //     })

        displayCoinData(cryptocurrency)
    })

}

function roundToTwoDecimalPlace(number) {
    return (Math.round(number * 10 ** 2) / 10 ** 2);
}

function createCoinData(cryptocurrenciesArray) {
    cryptocurrenciesArray.forEach((cryptocurrency) => {
        populateCoinList(cryptocurrency)
    })
}

function displayCoinData(cryptocurrency) {
    console.log(cryptocurrency)
    const cryptoName = document.getElementById('name')
    const cryptoSymbol = document.getElementById('symbol')
    const cryptoPrice = document.getElementById('price')
    const crypto24Hr = document.getElementById('24-hour-change')

    const coinPrice = Number(cryptocurrency.priceUsd)
    const coin24Hr = Number(cryptocurrency.changePercent24Hr)

    cryptoName.textContent = `NAME: ${cryptocurrency.name}`
    cryptoSymbol.textContent = `SYMBOL: ${cryptocurrency.symbol}`
    cryptoPrice.textContent = `PRICE USD: $${roundToTwoDecimalPlace(coinPrice)}`
    crypto24Hr.textContent = `24Hr CHANGE: ${roundToTwoDecimalPlace(coin24Hr)}%`

    // CHANGE CUBE COLOR AND ROTATION

    if (coin24Hr > 0) {
        material.color.setColorName("green")
    } else {
        material.color.setColorName("red")
    }
    console.log("final color", material.color)

}

// DISPLAY PRICE HISTORY, NEEDS WORK
// function displayCoinTrend(coinHistory) {
//     // access last two days of coin history
//     // assign array.length to a variable, reference variable instead of calling.length
//     const coinHistoryArray = coinHistory.data
//     // use pop to do this
//     const coinPriceTodayArrayLocation = coinHistoryArray.length - 1
//     const coinPriceYesterdayArrayLocation = coinHistoryArray.length - 2
//     // 
//     const coinPriceToday = coinHistoryArray[coinPriceTodayArrayLocation].priceUsd;
//     const coinPriceYesterday = coinHistoryArray[coinPriceYesterdayArrayLocation].priceUsd;
//     const coinChange = coinPriceYesterday - coinPriceToday;
//     console.log("yesterday", coinPriceYesterday)
//     console.log("today", coinPriceToday)

//     console.log("change", coinChange)

//     const priceYesterday = document.getElementById('price yesterday')
//     priceYesterday.textContent = `PRICE YESTERDAY: $${roundToTwoDecimalPlace(coinPriceYesterday)}`
//     console.log(priceYesterday)
// }