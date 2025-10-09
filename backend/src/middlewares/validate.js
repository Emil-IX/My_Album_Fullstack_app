import { validationResult } from 'express-validator'

//It's the second part of validators
export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}