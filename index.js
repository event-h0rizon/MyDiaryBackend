const express= require('express')
const cors= require('cors')
const app= express()
const connectToMongo= require('./db')
require('dotenv').config()



const port= process.env.PORT
const host= process.env.HOST

app.use(express.json())
app.use(cors())


connectToMongo()


app.use('/users', require('./api/users'))
app.use('/notes', require('./api/notes'))



app.get('/', (req, res)=>{
    res.send('HELLO')
})

app.listen(port, host, ()=>{
    console.log(`Backend server running at http://${host}:${port}`)
})