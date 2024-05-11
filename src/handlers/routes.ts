import express, { Request, Response } from "express";
import { roomValidation as RoomRequest, roomValidation, listRoomValidation, updateProductValidation, roomByID } from "./validators/room-validation";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { Room } from "../database/entities/room";
import { RoomUseCase } from "../domain/room-usecase";

export const initRoutes = (app: express.Express) => {

    // Create
    app.post("/rooms", async (req: Request, res: Response) => {

        const validation = roomValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const roomRequest = validation.value
        const roomRepo = AppDataSource.getRepository(Room)

        try {
            const roomCreated = await roomRepo.save(roomRequest)
            res.status(201).send(roomCreated)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    });

    // Get all
    app.get("/rooms", async (req: Request, res: Response) => {
        const validation = listRoomValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listProductRequest = validation.value
        let limit = 20
        if (listProductRequest.limit) {
            limit = listProductRequest.limit
        }
        
        try {
            const roomUsecase = new RoomUseCase(AppDataSource);
            const listRooms = await roomUsecase.listAllProducts()/*{ ...listProductRequest, page, limit }*/
            res.status(200).send(listRooms)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    });

    app.get("/rooms/:id", async (req: Request, res: Response) => {

        const validation = roomByID.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoomRequest = validation.value

        try {
            const roomUsecase = new RoomUseCase(AppDataSource);
            const room = await roomUsecase.getRoom(getRoomRequest.id??0)
            if(room) {
                res.status(200).send(room)
            }
            else {
                res.status(404).send({ error: "Did not find the room" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the room" })
        }
    });

    // Modify
    app.patch("/rooms/:id", async (req: Request, res: Response) => {
        
    });

    // Delete
    app.delete("/rooms/:id", async (req: Request, res: Response) => {
    
        const validation = roomByID.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoomRequest = validation.value

        try {
            const roomUsecase = new RoomUseCase(AppDataSource);

            if (getRoomRequest.id === undefined || getRoomRequest.id <= 0) {
                res.status(404).send({ error: "Did not find the room" })
            }

            const room = await roomUsecase.getRoom(getRoomRequest.id??0)
            if(room) {
                const deletedRoom = await roomUsecase.deleteRoom(getRoomRequest.id??0)
                if (deletedRoom) {
                    res.status(200).send({ "message": "Room deleted" })
                }
                else {
                    res.status(404).send({ error: "Did not find the room" })
                }
            }
            else {
                res.status(404).send({ error: "Did not find the room" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the room" })
        }
    });

    /*
    
    app.get("/rooms/:id", async (req: Request, res: Response) => {

        const validation = updateProductValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getProductRequest = validation.value

        try {
            const productUsecase = new RoomUseCase(AppDataSource);
            const product = await productUsecase.getProduct(getProductRequest.id)
            if(product) {
                res.status(200).send(product)
            }
            else {
                res.status(404).send({ error: "Did not find the product" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the product" })
        }
    })
    
    /*app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "hello world" })
    })

    app.post("/products", async (req: Request, res: Response) => {
        const validation = productValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const productRequest = validation.value
        const productRepo = AppDataSource.getRepository(Product)
        try {

            const productCreated = await productRepo.save(
                productRequest
            )
            res.status(201).send(productCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/products", async (req: Request, res: Response) => {
        const validation = listProductsValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listProductRequest = validation.value
        let limit = 20
        if (listProductRequest.limit) {
            limit = listProductRequest.limit
        }
        const page = listProductRequest.page ?? 1

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const listProducts = await productUsecase.listProduct({ ...listProductRequest, page, limit })
            res.status(200).send(listProducts)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    // GET /products/:id
    app.get("/products/:id", async (req: Request, res: Response) => {
        const validation = updateProductValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getProductRequest = validation.value

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const product = await productUsecase.getProduct(getProductRequest.id)
            if(product) {
                res.status(200).send(product)
            }
            else {
                res.status(404).send({ error: "Did not find the product" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the product" })
        }
    })

    app.delete("/products/:id", async (req: Request, res: Response) => {

        const validation = updateProductValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteProductRequest = validation.value

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const deletedProduct = await productUsecase.deleteProduct(deleteProductRequest.id)
            if (deletedProduct === null || !deletedProduct) {
                res.status(404).send({"error": `product ${deleteProductRequest.id} not found`})
                return
            }
            res.status(200).send({ "message": "Product deleted"})
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    });

    app.patch("/products/:id", async (req: Request, res: Response) => {

        const validation = updateProductValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateProductRequest = validation.value

        try {
            const productUsecase = new ProductUsecase(AppDataSource);
            const updatedProduct = await productUsecase.updateProduct(updateProductRequest.id, { ...updateProductRequest })
            if (updatedProduct === null) {
                res.status(404).send({"error": `product ${updateProductRequest.id} not found`})
                return
            }
            res.status(200).send(updatedProduct)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })*/
}