# CryptoCube

CryptoCube recieves data on the top 100 cryptocurrencies from the CoinCap API. It then displays the data for each coin. 

The CrptoCube has API data mapped to a 3D animation. When the cryptocurrency that is selected is going up in price over the last 24 hours, the cube will be green and rotating counter-clockwise. If it is going down in price, it will be red and rotating clockwise. The speed of the rotation reflects how quickly the price is changing. 

Use the "TRACK COIN" button in "COIN DATA" to create a list of favorite coins that you can refer back to. 

# INSTRUCTIONS

## Installation
$ npm install

## Set up json-server
first time - npm install -g json-server

all other times - json-server --watch db.json

## Run site using vite
npm run dev