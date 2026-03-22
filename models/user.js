import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },

    firstname : {
        type : String,
        required : true
    },

    lastname : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    role : {
        type : String,
        required : true,
        enum : ["admin", "customer"],
        default : "customer"
    },

    isBlocked : {
        type : Boolean,
        default : false
    },

    isEmailVerified : {
        type : Boolean,
        default : false
    },

    image : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
})  

const User = mongoose.model("User", userSchema)

export default User;