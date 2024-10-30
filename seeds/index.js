const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/trek-it')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
});

//ouputs the passed array with a random index
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 300; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            author: '66ed324349388f7abe493ffe',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dsrmnbnha/image/upload/v1730132047/Trekit/qdscskcj7xtokzncrtip.jpg',
                    filename: 'Trekit/qdscskcj7xtokzncrtip'
                },
                {
                    url: 'https://res.cloudinary.com/dsrmnbnha/image/upload/v1730132048/Trekit/rxbe5byg5raiqbxgpklh.jpg',
                    filename: 'Trekit/rxbe5byg5raiqbxgpklh'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
}) //returns a promise because async function