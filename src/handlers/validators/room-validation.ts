import Joi from "joi";
import { Room } from "../../database/entities/room";

export const roomValidation = Joi.object<RoomRequest>({
    name: Joi.string()
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
    capacity: Joi.number()
        .greater(14)
        .less(31)
        .required(),
    disabled_access: Joi.boolean()
        .required()
        .default(false)
}).options({ abortEarly: false })

export const roomByID = Joi.object<RoomRequest>({
    id: Joi.number()
        .required()
})

export interface RoomRequest {
    id?: number,
    name?: string,
    description?: string,
    image?: string,
    type?: string,
    capacity?: number,
    disabled_access?: boolean
}

export interface ListRoomRequest {
    capacity?: number
    type?: string
    disabled_access?: boolean,
    limit?: number
}

export const listRoomValidation = Joi.object<ListRoomRequest>({
    capacity: Joi.number()
        .greater(14)
        .less(31)
        .optional(),
    type: Joi.string().optional(),
    disabled_access: Joi.boolean().optional()
})

export const updateProductValidation = Joi.object<UpdateProductRequest>({
    id: Joi.number().required(),
    price: Joi.number().min(1).optional()
})

export interface UpdateProductRequest {
    id: number
    price?: number
}