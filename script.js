import * as THREE from 'three'

import { FontLoader } from 'three/examples/jsm/Addons.js';

import { TextGeometry } from 'three/examples/jsm/Addons.js';

// GLOBAL ANIMATION VARIABLES
let cubeSpinMultiplier = 1;

// SCENE
const scene = new THREE.Scene()

// FONT LOADER
let threeDTextContent = ""
let text;

function loadText() {

    const fontLoader = new FontLoader()

    fontLoader.load(
        `static/fonts/helvetiker_regular.typeface.json`,
        (font) => {
            const textGeometry = new TextGeometry(
                `${threeDTextContent}`,
                {
                    font: font,
                    size: 0.3,
                    depth: 0.01,
                    curveSegments: 1,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 1
                }
            )

            const textMaterial = new THREE.MeshPhongMaterial({ color: 'grey' })
            text = new THREE.Mesh(textGeometry, textMaterial)
            textGeometry.computeBoundingBox()

            // TEXT POSITION
            textGeometry.center()
            text.position.x = -1.4
            text.position.y = -1
            scene.add(text)

            function animateText() {
                const elapsedTime = clock.getElapsedTime();
                text.rotation.y = elapsedTime
                renderer.render(scene, camera)

                window.requestAnimationFrame(animateText)
            }
            animateText()
        }
    )
}


// CUBE
const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const material = new THREE.MeshPhongMaterial({ color: "red", shininess: 10 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// PLANE
const plane = new THREE.PlaneGeometry(20, 20)
const planeMat = new THREE.MeshPhongMaterial({ color: "black", shininess: 10 })
const planeMesh = new THREE.Mesh(plane, planeMat)
scene.add(planeMesh)

// TRANSFORMS
mesh.position.y = 0.2;
planeMesh.position.z = -3

// LIGHTS
const directionalLight1 = new THREE.DirectionalLight('seashell', 20)
directionalLight1.position.set(5, 2, 6)
directionalLight1.target.position.set(0, 0, 0)
scene.add(directionalLight1)
scene.add(directionalLight1.target)

const directionalLight2 = new THREE.DirectionalLight('skyblue', 15)
directionalLight2.position.set(-5, -2, 5)
scene.add(directionalLight2)

// 3D canvas aspect ratio
const sizes = {
    
    width: window.innerWidth * .6,
    height: window.innerHeight * .4,
}

// CAMERA
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height)
camera.position.z = 8
scene.add(camera)

// CANVAS
const canvas = document.querySelector("canvas.webgl")

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)

// CLOCK
const clock = new THREE.Clock()

// ANIMATOR FUNCTION
const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    mesh.rotation.y = elapsedTime * cubeSpinMultiplier;
    mesh.rotation.x = (Math.sin)(elapsedTime) / 5;

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}
animate()

// GLOBAL VARIABLES FOR WEBSITE
const coinList = document.getElementById("coin-list")
const coinDropdown = document.getElementById("dropdown-content")
const trackCoinButton = document.getElementById('track-coin-button')
const myCoinCardList = document.getElementById("cards-go-here")
let currentlyDisplayedCrypto;
let coinDataArray = [];
let totalMarketCap;

// API call to get coin data
fetch("https://api.coincap.io/v2/assets")
    .then(response => {
        if (response.ok) {
            response.json().then(coinData => {
                coinDataArray = [...coinData.data]
                createCoinList(coinDataArray)
                displayCoinData(coinDataArray[0])
                buildMyCoinsList()
                calculateMarketCap(coinDataArray)
            })
        } else {
            alert(`ERROR:${response.status}`)
        }
    })

// FILTER EVENT LISTENER
coinDropdown.addEventListener("change", () => {
    createCoinList(coinDataArray)
})

// FUNCTIONS
function createCoinListItem(cryptocurrency) {
    const coinListItem = document.createElement('li')
    coinListItem.textContent = `${cryptocurrency.symbol}: ${cryptocurrency.name}`
    coinList.appendChild(coinListItem)

    coinListItem.addEventListener("mouseover", () => {
        coinListItem.id = 'change-color'
    })
    coinListItem.addEventListener("mouseleave", () => {
        coinListItem.id = ""
    })

    coinListItem.addEventListener("click", () => {
        displayCoinData(cryptocurrency)
    })

}

function roundAndFormatNumber(number) {
    return new Intl.NumberFormat().format(Math.round(number * 10 ** 2) / 10 ** 2);
}

function createCoinList(cryptocurrenciesArray) {

    coinList.innerHTML = ""

    if (coinDropdown.value == "all-coins") {
        cryptocurrenciesArray.forEach((cryptocurrency) => {
            createCoinListItem(cryptocurrency)
        })
    } else if (coinDropdown.value == "top-ten") {
        cryptocurrenciesArray.forEach((cryptocurrency) => {
            if ((Number(cryptocurrency.rank) <= 10)) {
                createCoinListItem(cryptocurrency)
            }
        })
    } else if (coinDropdown.value == "1-50") {
        cryptocurrenciesArray.forEach((cryptocurrency) => {
            if ((Number(cryptocurrency.rank) <= 50)) {
                createCoinListItem(cryptocurrency)
            }
        })
    } else if (coinDropdown.value == "50-100") {
        cryptocurrenciesArray.forEach((cryptocurrency) => {
            if ((Number(cryptocurrency.rank) > 50)) {
                createCoinListItem(cryptocurrency)
            }
        })
    } else if (coinDropdown.value == "A-Z") {
        const nameArray = cryptocurrenciesArray.map((cryptocurrency) => cryptocurrency.name)
        const aToZObject = nameArray.toSorted()
        for (let name of aToZObject) {
            let aToZName = name
            for (let cryptocurrency of cryptocurrenciesArray){
                if (aToZName == cryptocurrency.name) {
                    createCoinListItem(cryptocurrency)
                }
            }
        }
    } else if (coinDropdown.value == "Z-A") {
        const nameArray = cryptocurrenciesArray.map((cryptocurrency) => cryptocurrency.name)
        const aToZObject = nameArray.toSorted()
        const zToAObject = aToZObject.toReversed();
        for (let name of zToAObject) {
            let zToAName = name
            for (let cryptocurrency of cryptocurrenciesArray){
                if (zToAName == cryptocurrency.name) {
                    createCoinListItem(cryptocurrency)
                }
            }
        }
    } 
}

function displayCoinData(cryptocurrency) {
   
    const cryptoName = document.getElementById('name')
    const cryptoSymbol = document.getElementById('symbol')
    const cryptoPrice = document.getElementById('price')
    const crypto24Hr = document.getElementById('24-hour-change')

    const coinPrice = Number(cryptocurrency.priceUsd)
    const coin24Hr = Number(cryptocurrency.changePercent24Hr)

    cryptoName.textContent = `NAME: ${cryptocurrency.name}`
    cryptoSymbol.textContent = `SYMBOL: ${cryptocurrency.symbol}`
    cryptoPrice.textContent = `PRICE USD: $${roundAndFormatNumber(coinPrice)}`
    crypto24Hr.textContent = `24Hr CHANGE: ${roundAndFormatNumber(coin24Hr)}%`

    // CHANGE CUBE COLOR 

    if (coin24Hr > 0) {
        material.color.setColorName("green")
    } else {
        material.color.setColorName("red")
    }
    // CHANGE CUBE ROTATION SPEED
    if (coin24Hr >= 0) {
        cubeSpinMultiplier = coin24Hr;
    } else {
        cubeSpinMultiplier = coin24Hr;
    }
    // CHANGE 3D text
    threeDTextContent = cryptocurrency.symbol
    scene.remove(text)
    loadText()
    currentlyDisplayedCrypto = cryptocurrency;
}

// TRACK COIN 
trackCoinButton.addEventListener("click", () => {addCoinToMyCoinsList(currentlyDisplayedCrypto)})

function addCoinToMyCoinsList(cryptocurrency) {

    const coinCards = document.getElementsByClassName("tracked-coin-card")
    const newCard = document.createElement("div")

    newCardBuilder(cryptocurrency, newCard)

    // CHECK TO SEE IF NEWCARD CRYPTO IS ALREADY IN MY COINS LIST
    const newCardSymbol = newCard.getElementsByClassName("tracked-coin-symbol")
    let currentCoinSymbols = [];

    for (let htmlContent of coinCards) {
        const cardSymbol = htmlContent.getElementsByClassName('tracked-coin-symbol')
        for (let coin of cardSymbol) {
            currentCoinSymbols.push(coin.innerHTML)
        }
    }

    if (!currentCoinSymbols.find((element) => element == newCardSymbol[0].innerHTML)) {
        myCoinCardList.appendChild(newCard)
    } else {
        alert(`Error: ${newCardSymbol[0].innerHTML} is already in your list`)
    }
}

function newCardBuilder(cryptocurrency, newCard){
    newCard.innerHTML =
    `<div class="tracked-coin-card" >
        <h4 class="tracked-coin-symbol" >${cryptocurrency.symbol}</h4>
        <h4 class="tracked-coin-price">$${roundAndFormatNumber(cryptocurrency.priceUsd)}</h4>
        <button class="remove-button">REMOVE</button>
    </div >`

const removeButton = newCard.querySelector('.remove-button')

removeButton.addEventListener("click", () => {
    newCard.remove()
    })

    newCard.addEventListener("click", () => {displayCoinData(cryptocurrency)})
}

function calculateMarketCap() {
    const marketCapArray = coinDataArray.map((coin) => Number(coin.marketCapUsd))
    totalMarketCap = marketCapArray.reduce((a, b) => a + b)
    const marketCapHeader = document.getElementById('market-cap')
    marketCapHeader.innerText = `Top 100 Market Cap: $${roundAndFormatNumber(totalMarketCap)}`
}

function onResize() {
    sizes.width = window.innerWidth * 0.6;
    sizes.height = window.innerHeight * 0.4;

    camera.aspect = (sizes.width)/ (sizes.height);
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
}

window.addEventListener('resize', onResize)