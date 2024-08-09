const Campground = require('../models/campground') //.. because we have to move back one directory 
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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi ipsa dolorum nam, consequuntur rem repellat maxime autem rerum recusandae alias et iste ea nesciunt modi, qui ex veritatis cumque odio.',
            price: price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
}) //returns a promise because async function