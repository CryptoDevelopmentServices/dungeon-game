const validate = (schema) => async (req, res, next) => {
    try {
        const validateBody = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        req.body = validateBody;
        next()
    } catch (err) {
        res.status(400).json({ error: err.errors[0] })
    }
}

export default validate;
