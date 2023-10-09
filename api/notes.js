const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Note = require('../models/Note')

require('dotenv').config()


// MIDDLEWARE TO AUTHENTICATE TOKEN

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
                // res.json({err})
            }
            // console.log(user)
            req.user = user
            // res.json(req.user)
            next()
        })

    } catch (error) {
        console.log(error)

    }



}

// router.use('/create', fetchUser)


// ROUTE 1: FETCH ALL USER SPECIFIC NOTES

router.post('/', fetchUser, async (req, res) => {

    try {
        if (req.user == null) {
            res.json([])
        }

        userNotes = await Note.find({ "user": `${req.user.id}` })
        console.log(userNotes)
        res.json(userNotes)

    } catch (error) {
        console.log(error)

    }


})



// ROUTE 2: CREATE A NEW NOTE

router.post('/create', fetchUser, async (req, res) => {
    data = req.body

    // Middleware authenticates the token and appends req.user

    try {
        const note = new Note({
            title: data.title,
            desc: data.desc,
            user: req.user.id
        })
        await note.save()
        res.json(note)


    } catch (error) {
        console.log(error)
    }




})
// ROUTE 3: DELETE AN EXISING NOTE

router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {
        const noteIDtoDelete = req.params.id
        const noteToDelete = await Note.findById(req.params.id)
        if (req.user == null) {
            res.sendStatus(403)
            return
        }
        if (noteToDelete == null) {
            res.sendStatus(401)
            return
        }
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        res.json(deletedNote)
        // if (req.user != null && noteToDelete != null) {

        // }



    } catch (error) {
        console.log(error)

    }
})

// ROUTE 4: EDITING AN EXISTING NOTE

router.put('/edit/:id', fetchUser, async (req, res) => {
    try {
        const noteIDtoEdit = req.params.id
        const noteToEdit = await Note.findById(req.params.id)
        if (req.user == null) {
            res.sendStatus(403)
            return
        }
        if (noteToEdit == null) {
            res.sendStatus(401)
            return
        }
        let editedNote = {
            title: req.body.title,
            desc: req.body.desc,
            // user: req.user.id
        }
        updatedNote = await Note.findByIdAndUpdate(req.params.id, {$set: editedNote}, {new: true})
        res.json(updatedNote)
        // if (req.user != null && noteToDelete != null) {

        // }



    } catch (error) {
        console.log(error)

    }
})




module.exports = router