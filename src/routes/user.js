const router = require('express').Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

dotenv.config();
const jwtSecret = process.env.JWT_SECRET

router.post('/register', [
    body('name', "Enter a valid name!!").isAlphanumeric(),
    body('email', "Enter a valid email!!").isEmail(),
    body('password', "Password length needs to be min 5 characters!!").isLength({min: 5})
], async (req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'Failure',
            message: errors.array()
        })
    }
    const {name, email, password} = req.body
    try{
        //check if user already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                status: 'Failure',
                message: 'A user already exists with this email!'
            })
        }
        //generating hash
        const hash = await bcrypt.hash(password, 10);
        //creating new user
        user = await User.create({
            name,
            email,
            password: hash
        })
        return res.status(201).json({
            status: 'Success',
            user
        })
    }
    catch(e){
        return res.status(500).json({
            status: 'Failure',
            message: e.message
        })
    }
})

router.post('/login',[
    body('email', "Enter a valid email!!").isEmail(),
    body('password', "Password length needs to be min 5 characters!!").isLength({min: 5})
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'Failure',
            message: errors.array()
        })
    }
    const {email, password} = req.body
    try{
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                staus: 'Failure',
                message: 'Invalid credentials'
            })
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.status(400).json({
                staus: 'Failure',
                message: 'Invalid credentials'
            })
        }
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: user._id
        }, jwtSecret)
        return res.status(200).json({
            status: "Successfully loggedin",
            token
        })
    }
    catch(e){
        return res.status(500).json({
            status: 'Failure',
            message: e.message
        })
    }
})

module.exports = router