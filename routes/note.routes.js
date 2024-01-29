const express = require("express")
const jwt = require("jsonwebtoken")
const { authenticator } = require("../middlewares/authenticator")
const { NoteModel } = require("../models/NoteModel")

const noteRouter = express.Router()
noteRouter.use(authenticator)


noteRouter.get("/", async (req, res) => {
    const token = req.headers.authorization
    console.log(token)
    jwt.verify(token, "vivek", async (err, decode) => {
        console.log(decode)
        console.log(err)
        try {
            let data = await NoteModel.find({ user: decode.userId })
            res.send({
                data: data,
                message: "success",
                status: 1
            })
        } catch (error) {
            res.send({
                message: error.message,
                status: 0
            })
        }
    })

})

noteRouter.post("/create", async (req, res) => {
    const { title, body, user } = req.body
    // console.log(title, body, user)
    try {
        let note = new NoteModel({ title, body, user })
        await note.save()
        // console.log(note)
        res.send({
            message: "Note Created Successfully",
            note: note,
            status: 1
        })
    } catch (error) {
        res.send({
            message: error.message,
            status: 0
        })
    }
})

noteRouter.patch("/", async (req, res) => {
    let { id } = req.headers
    try {
        await NoteModel.findByIdAndUpdate({ _id: id }, req.body)
        res.send({
            message: "Notes Upadated",
            status: 1
        })
    } catch (error) {
        res.send({
            message: error.message,
            status: 0
        })
    }
})

noteRouter.delete("/", async (req, res) => {
    let { id } = req.headers
    try {
        await NoteModel.findByIdAndDelete({ _id: id })
        res.send({
            message: "Notes Deleted",
            status: 1
        })
    } catch (error) {
        res.send({
            message: error.message,
            status: 0
        })
    }
})

module.exports = {
    noteRouter
}