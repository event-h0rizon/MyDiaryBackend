const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const crypto = require('crypto')
const bcrypt = require('bcrypt')

// router.get('/create', async (req, res)=>{
//     res.json({name: 'Test', email: 'Test', password:'pwd'})
//  })


// ROUTE 1: SIGNING UP

router.post('/signup', async (req, res) => {
    data = req.body

    const userExists = await User.findOne({ email: `${req.body.email}` })
    if (!userExists) {
        console.log('RESULT', userExists)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(hashedPassword)
        const user = await new User({
            name: data.name,
            email: data.email,
            password: hashedPassword
        })
        await user.save()
        const auth_token = await jwt.sign({ name: req.body.name, email: req.body.email, id: user._id }, process.env.JWT_SECRET)
        res.json(auth_token)


        console.log(`SUCCESS, ${user}`)
        // res.json(data)
    }
    else {
        res.json(userExists)
    }

})


// MIDDLEWARE FOR AUTHENTICATING THE USER VIA JWT

const fetchUser = async (req, res, next) => {

    try {
        const jwtHeader = req.headers['authorization']
        const token = jwtHeader && jwtHeader.split(" ")[1]

        if (token == null) {
            res.sendStatus(401)
        }

        await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                res.json({ err })
            }
            // console.log(user)
            req.user = user
            // res.json(req.user)
            next()
        })

    } catch (error) {
        console.log(error)
        res.sendStatus(401)

    }
}


// ROUTE 2: LOGGING IN

router.post('/login', async (req, res) => {




    const user = await User.findOne({ email: `${req.body.email}` })
    if (user) {
        console.log('USER FOUND')
        if (await bcrypt.compare(req.body.password, user.password)) {
            console.log('LOGIN SUCCESS')
            const auth_token = await jwt.sign({ name: user.name, email: req.body.email, id: user._id }, process.env.JWT_SECRET)
            res.json({ auth_token })
        }
        else {
            const errorPWD = true
            console.log('Password Incorrect')
            res.json({ errorPWD })
        }
    }
    else {
        const errorUSER = true
        console.log('NO USER FOUND')
        res.json({ errorUSER })
    }



})



module.exports = router