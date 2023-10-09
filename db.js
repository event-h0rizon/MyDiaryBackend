const mongoose= require('mongoose')
const mongoURI= 'mongodb://0.0.0.0:27017/MyDiary'

const connectToMongo= async ()=> {
   await mongoose.connect(mongoURI)
   console.log('Connected to Database Successfully')
     
}

module.exports= connectToMongo