import Joi from "joi";
import { Seance } from "../../database/entities/seance";

export const seanceValidation = Joi.object<SeanceRequest>({
    room: Joi.number()
        .required(),
    movie: Joi.number()
        .required(),
    start_time: Joi.string()
        .required(),
    end_time: Joi.string()
        .required()
}).options({ abortEarly: false })

export const seanceByID = Joi.object<SeanceRequest>({
    id: Joi.number()
        .required()
})

export interface SeanceRequest {
    id?: number,
    room?: number,
    movie?: number,
    start_time?: string,
    end_time?: string
}

export interface ListSeanceRequest {
    room?: number
    movie?: number
    limit?: number
}

export const listSeanceValidation = Joi.object<ListSeanceRequest>({
    room: Joi.number().optional(),
    movie: Joi.number().optional()
})
