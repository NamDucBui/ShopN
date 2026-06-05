const authService = require("../services/auth.service");

class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body)
            res.status(201).json({
                success: true,
                message: "Register success",
                data: { user, token }
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    async login(req, res) {
        try {
            const {user, token} = await authService.login(req.body.email, req.body.password)
            res.status(200).json({
                success: true,
                message: "Login success",
                user,
                token
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = new AuthController()