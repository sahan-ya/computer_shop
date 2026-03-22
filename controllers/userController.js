import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User({
        email : req.body.email,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        password : hashedPassword,
    })

    user.save()
    .then((result)=>{
        res.status(201).json({
            message : "User created successfully",
            user : result
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message : "Error creating user",
            error : err.message
        })
    })

}

export function loginUser(req, res) {
    User.findOne({email : req.body.email})
    .then(
        
    (user)=>{
        
    
    if(user == null){
        res.status(404).json({
            message : "User not found"
        })
    }else{
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
        
if(isPasswordValid){

const token = jwt.sign({
firstname : user.firstname, 
lastname : user.lastname,
email : user.email,
role : user.role,
image : user.image,
isemailVerified : user.isEmailVerified,
}, "I-computers54")

console.log(token)

console.log({
    firstname : user.firstname, 
lastname : user.lastname,
email : user.email,
role : user.role,
image : user.image,
isemailVerified : user.isEmailVerified,
})


            res.status(200).json({
                message : "Login successful",
                user : user
            })
        }else{
            res.status(401).json({
                message : "Invalid password"
            })
        }
    }
    })
}
