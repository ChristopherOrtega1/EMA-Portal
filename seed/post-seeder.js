var Post = require('../models/post');

//UNICAMENTE USARSE EN AMBITO DE DESARROLLO

var mongoose = require('mongoose');
var randomSentence = require('random-sentence');

mongoose.connect('mongodb://localhost:27017/blog')

var posts = [
    new Post({
        title: randomSentence({min: 4, max: 9}),
        price: (Math.floor(Math.random() * (10000000 - 500000) + 500000)).toString(),
        description: randomSentence({min: 20, max: 80}),
        municipio: 'Guadalajara',
        image: 'https://ema-imagenes.s3.amazonaws.com/1.webp',
        time: 'developement env',
        user: 'Admin1',
        x: '20.6546286',
        y: '-103.2287421',
        rooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        fullBathrooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        parking: (Math.floor(Math.random() * (7 - 0) + 0)).toString(),
        size: (Math.floor(Math.random() * (300 - 30) + 30)).toString(),
        halfBathrooms: (Math.floor(Math.random() * (4 - 0) + 0)).toString(),
        pool: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        floors: (Math.floor(Math.random() * (4 - 1) + 1)).toString(),
        coto: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        extraRooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        balcones: (Math.floor(Math.random() * (5 - 0) + 0)).toString(),
        terraza: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        cocina: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        jardin: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        aire: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        partOfData: '0'
    }),
    new Post({
        title: randomSentence({min: 4, max: 9}),
        price: (Math.floor(Math.random() * (10000000 - 500000) + 500000)).toString(),
        description: randomSentence({min: 20, max: 80}),
        municipio: 'Tlaquepaque',
        image: 'https://ema-imagenes.s3.amazonaws.com/1.webp',
        time: 'developement env',
        user: 'Admin1',
        x: '20.6546286',
        y: '-103.2287421',
        rooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        fullBathrooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        parking: (Math.floor(Math.random() * (7 - 0) + 0)).toString(),
        size: (Math.floor(Math.random() * (300 - 30) + 30)).toString(),
        halfBathrooms: (Math.floor(Math.random() * (4 - 0) + 0)).toString(),
        pool: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        floors: (Math.floor(Math.random() * (4 - 1) + 1)).toString(),
        coto: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        extraRooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        balcones: (Math.floor(Math.random() * (5 - 0) + 0)).toString(),
        terraza: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        cocina: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        jardin: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        aire: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        partOfData: '0'
    }),
    new Post({
        title: randomSentence({min: 4, max: 9}),
        price: (Math.floor(Math.random() * (10000000 - 500000) + 500000)).toString(),
        description: randomSentence({min: 20, max: 80}),
        municipio: 'Tonalá',
        image: 'https://ema-imagenes.s3.amazonaws.com/1.webp',
        time: 'developement env',
        user: 'Admin1',
        x: '20.6546286',
        y: '-103.2287421',
        rooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        fullBathrooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        parking: (Math.floor(Math.random() * (7 - 0) + 0)).toString(),
        size: (Math.floor(Math.random() * (300 - 30) + 30)).toString(),
        halfBathrooms: (Math.floor(Math.random() * (4 - 0) + 0)).toString(),
        pool: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        floors: (Math.floor(Math.random() * (4 - 1) + 1)).toString(),
        coto: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        extraRooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        balcones: (Math.floor(Math.random() * (5 - 0) + 0)).toString(),
        terraza: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        cocina: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        jardin: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        aire: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        partOfData: '0'
    }),
    new Post({
        title: randomSentence({min: 4, max: 9}),
        price: (Math.floor(Math.random() * (10000000 - 500000) + 500000)).toString(),
        description: randomSentence({min: 20, max: 80}),
        municipio: 'Zapopan',
        image: 'https://ema-imagenes.s3.amazonaws.com/1.webp',
        time: 'developement env',
        user: 'Admin1',
        x: '20.6546286',
        y: '-103.2287421',
        rooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        fullBathrooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        parking: (Math.floor(Math.random() * (7 - 0) + 0)).toString(),
        size: (Math.floor(Math.random() * (300 - 30) + 30)).toString(),
        halfBathrooms: (Math.floor(Math.random() * (4 - 0) + 0)).toString(),
        pool: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        floors: (Math.floor(Math.random() * (4 - 1) + 1)).toString(),
        coto: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        extraRooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        balcones: (Math.floor(Math.random() * (5 - 0) + 0)).toString(),
        terraza: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        cocina: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        jardin: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        aire: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        partOfData: '0'
    }),
    new Post({
        title: randomSentence({min: 4, max: 9}),
        price: (Math.floor(Math.random() * (10000000 - 500000) + 500000)).toString(),
        description: randomSentence({min: 20, max: 80}),
        municipio: 'Tlajomulco de Zuñiga',
        image: 'https://ema-imagenes.s3.amazonaws.com/1.webp',
        time: 'developement env',
        user: 'Admin1',
        x: '20.6546286',
        y: '-103.2287421',
        rooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        fullBathrooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        parking: (Math.floor(Math.random() * (7 - 0) + 0)).toString(),
        size: (Math.floor(Math.random() * (300 - 30) + 30)).toString(),
        halfBathrooms: (Math.floor(Math.random() * (4 - 0) + 0)).toString(),
        pool: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        floors: (Math.floor(Math.random() * (4 - 1) + 1)).toString(),
        coto: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        extraRooms: (Math.floor(Math.random() * (7 - 1) + 1)).toString(),
        balcones: (Math.floor(Math.random() * (5 - 0) + 0)).toString(),
        terraza: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        cocina: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        jardin: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        aire: (Math.floor(Math.random() * (2 - 0) + 0)).toString(),
        partOfData: '0'
    }),

    

];


var done = 0;
for ( var i = 0; i < posts.length; i++){
    posts[i].save(function(err, result){
        done++;
        if (done == posts.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}