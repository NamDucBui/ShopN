const { prisma } = require("../config/prisma");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class AuthService {
    generateToken(user) {
        return jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
    }

    async register(userData) {
        const existing = await prisma.user.findUnique({
            where: {email: userData.email}
        })

        if(existing){
            throw new Error('Email already exists')
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const newUser = await prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                fullname: userData.fullname,
                phone: userData.phone
            }
        })

        const {password, ...userWithoutPassword} = newUser

        const token = this.generateToken(userWithoutPassword)

        return {user: userWithoutPassword, token}
    }

    async login(email, password){
        const user = await prisma.user.findUnique({
            where: {email: email}
        })

        if(!user){
            throw new Error('Invalid email or password')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch === false){
            throw new Error('Invalid email or password')
        }
        if(user.isActive === false){
            throw new Error('Your account has been deactivated')
        }

        const {password, ...userWithoutPassword} = user

        const token = this.generateToken(userWithoutPassword)

        return {user: userWithoutPassword, token}
    }
}

module.exports = new AuthService()