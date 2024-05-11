import Joi from "joi";

export const userValidation = Joi.object<UserRequest>({
    firstName: Joi.string()
        .min(2)
        .required(),
    lastName: Joi.string()
        .min(2)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    admin: Joi.boolean()
        .required(),
    jwt: Joi.string()
}).options({ abortEarly: false })

export interface UserRequest {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    admin: boolean,
    jwt?: string
}