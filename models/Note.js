const mongoose= require('mongoose')

const noteSchema= new mongoose.Schema(
    {
        title:{
            type: String,
            default: 'Untitled'
        },
        desc:{
            type: String
        },
        date: {
            type: String,
            default: ()=>{
                return new Date
            },
            immutable: true
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            populate: true
        }
    }
)
module.exports= mongoose.model('Note', noteSchema, 'Note' )