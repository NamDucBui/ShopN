const {ZodError, file} = require ('zod')

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })
        return next()
    } catch (error) {
        if(error instanceof ZodError){
            const errorMessages = error.issues.map((err) => ({
                field: err.path.join('.').replace('body.', '').replace('query.', '').replace('params.', ''),
                message: err.message
            }))

            return res.status(400).json({
                success: false,
                message: 'Invalid request data',
                errors: errorMessages
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error during validation"
        })
    }
}

module.exports = validate