import Joi from 'joi'
import { Movie } from '../../database/entities/movie'

export const movieValidation = Joi.object<MovieRequest>({
    title: Joi.string()
        .min(3)
        .required(),
    description: Joi.string()
        .min(3)
        .required(),
    image: Joi.string()
        .min(3)
        .required(),
    type: Joi.string()
        .min(3)
        .required(),
    duration: Joi.number()
        .greater(0)
        .required(),
    id: Joi.number()
        .optional()
}).options({ abortEarly: false })

export const movieByID = Joi.object<MovieRequest>({
    id: Joi.number()
        .required()
})

export interface MovieRequest {
    id?: number,
    title?: string,
    description?: string,
    image?: string,
    type?: string,
    duration?: number
}

export interface ListMovieRequest {
    type?: string
    limit?: number
}

export const listMovieValidation = Joi.object<ListMovieRequest>({
    type: Joi.string().optional()
})
