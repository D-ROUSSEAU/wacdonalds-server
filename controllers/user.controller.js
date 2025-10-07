const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passwordValidator = require('password-validator')

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body

        if(!email || !password)
            return res.status(400).json({error: 'Email and password are required'})

        const schema = new passwordValidator()
        schema
            .is().min(8)
            .is().max(100)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().not().spaces()
            
        if(!schema.validate(password))
            return res.status(400).json({error: 'Password does not meet security criteria'})

        const existingUser = await User.findOne({ email })

        if(existingUser)
            return res.status(400).json({error: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            password: hashedPassword,
            role
        })

        await newUser.save()

        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({error: 'Error when trying to register user'})
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        if(!email || !password)
            return res.status(400).json({error: 'Email and password are required'})

            const existingUser = await User.findOne({ email })

            if(!existingUser)
                return res.status(400).json({error: 'Invalid login credentials'})

            const isPasswordValid = await bcrypt.compare(password, existingUser.password)

            if(!isPasswordValid)
                return res.status(400).json({error: 'Invalid login credentials'})

            const token = jwt.sign(
                { userId: existingUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.status(200).json({ token, user: existingUser })
    } catch (error) {
        res.status(500).json({error: 'Error when trying to login user'})
    }
}