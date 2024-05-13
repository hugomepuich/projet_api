import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";

import { Room } from "../database/entities/room";
import { roomValidation as RoomRequest, roomValidation, listRoomValidation, updateProductValidation, roomByID } from "./validators/room-validation";
import { RoomUseCase } from "../domain/room-usecase";

import { Movie } from "../database/entities/movie";
import { movieValidation, movieByID, listMovieValidation } from "./validators/movie-validation";
import { MovieUseCase } from "../domain/movie-usecase";
import { User } from "../database/entities/user";
import { userValidation } from "./validators/user-validation";
import jwt from 'jsonwebtoken';

import { Seance } from "../database/entities/seance";
import { seanceValidation, seanceByID, listSeanceValidation } from "./validators/seance-validator";
import { SeanceUseCase } from "../domain/seance-usecase";
import { valid } from "joi";

export const initRoutes = (app: express.Express) => {

    // ROOM ROUTES
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

    // Get by ID
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
        
        const validation = roomValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const roomRequest = validation.value
        const roomRepo = AppDataSource.getRepository(Room)

        try {
            const updated = await roomRepo.update(req.params.id, roomRequest)
            if (updated) {
                res.status(200).send({ "message": "Room updated" })
            }
            else {
                res.status(404).send({ error: "Error" })
            }
        }
        catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

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

    // MOVIE ROUTES
    // POST
    app.post("/movies", async (req: Request, res: Response) => {

        const validation = movieValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const movieRequest = validation.value
        const movieRepo = AppDataSource.getRepository(Movie)

        try {
            const movieCreated = await movieRepo.save(movieRequest)
            res.status(201).send(movieCreated)
        } 
        catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    });

    // GET MOVIE BY ID
    app.get("/movies/:id", async (req: Request, res: Response) => {
        
        const validation = movieByID.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getMovieRequest = validation.value
        try {
            const movieUsecase = new MovieUseCase(AppDataSource);
            const movie = await movieUsecase.getMovie(getMovieRequest.id??0)
            if(movie) {
                res.status(200).send(movie)
            }
            else {
                res.status(404).send({ error: "Did not find the movie" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the movie" })
        }


    });

    // GET ALL MOVIES
    app.get("/movies", async (req: Request, res: Response) => {

        const validation = listMovieValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listMovieRequest = validation.value

        try {
            const movieUsecase = new MovieUseCase(AppDataSource);
            const listMovies = await movieUsecase.listAllMovies()/*{ ...listProductRequest, page, limit }*/
            res.status(200).send(listMovies)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }

    })

    // MODIFY MOVIE
    app.patch("/movies/:id", async (req: Request, res: Response) => {

        const validation = movieValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const movieRequest = validation.value
        const movieRepo = AppDataSource.getRepository(Movie)

        try {
            const updated = await movieRepo.update(req.params.id, movieRequest)
            if (updated) {
                res.status(200).send({ "message": "Movie updated" })
            }
            else {
                res.status(404).send({ error: "Error" })
            }
        }
        catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    });

    // DELETE MOVIE
    app.delete("/movies/:id", async (req: Request, res: Response) => {

        const validation = movieByID.validate({...req.params, ...req.body});

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getMovieRequest = validation.value

        try {
            const movieUsecase = new MovieUseCase(AppDataSource);

            if (getMovieRequest.id === undefined || getMovieRequest.id <= 0) {
                res.status(404).send({ error: "Did not find the movie" })
            }

            const movie = await movieUsecase.getMovie(getMovieRequest.id??0)
            if(movie) {
                const deletedMovie = await movieUsecase.deleteMovie(getMovieRequest.id??0)
                if (deletedMovie) {
                    res.status(200).send({ "message": "Movie deleted" })
                }
                else {
                    res.status(404).send({ error: "Did not find the movie" })
                }
            }
            else {
                res.status(404).send({ error: "Did not find the movie" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the movie" })
        }

    });

    // SEANCE ROUTES
    // POST
    app.post("/seances", async (req: Request, res: Response) => {

        const validation = seanceValidation.validate(req.body);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const seanceRequest = validation.value;
        const seanceRepo = AppDataSource.getRepository(Seance);

        try {
            const seanceCreated = await seanceRepo.save(seanceRequest)
            res.status(201).send(seanceCreated)
        }
        catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    });

    // GET SEANCE BY ID
    app.get("/seances/:id", async (req: Request, res: Response) => {

        const validation = seanceByID.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSeanceRequest = validation.value

        try {
            const seanceUsecase = new SeanceUseCase(AppDataSource);
            const seance = await seanceUsecase.getSeance(getSeanceRequest.id??0)
            if(seance) {
                res.status(200).send(seance)
            }
            else {
                res.status(404).send({ error: "Did not find the seance" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the seance" })
        }
    });

    // GET ALL SEANCES
    app.get("/seances", async (req: Request, res: Response) => {
            
            const validation = listSeanceValidation.validate(req.query)
    
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }
    
            const listSeanceRequest = validation.value
    
            try {
                const seanceUsecase = new SeanceUseCase(AppDataSource);
                const listSeances = await seanceUsecase.listAllSeances()/*{ ...listProductRequest, page, limit }*/
                res.status(200).send(listSeances)
            } catch (error) {
                console.log(error)
                res.status(500).send({ error: "Internal error" })
            }
    });

    // DELETE SEANCE
    app.delete("/seances/:id", async (req: Request, res: Response) => {

        const validation = seanceByID.validate({...req.params, ...req.body});

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSeanceRequest = validation.value

        try {
            const seanceUsecase = new SeanceUseCase(AppDataSource);

            if (getSeanceRequest.id === undefined || getSeanceRequest.id <= 0) {
                res.status(404).send({ error: "Did not find the seance" })
            }

            const seance = await seanceUsecase.getSeance(getSeanceRequest.id??0)
            if(seance) {
                const deletedSeance = await seanceUsecase.deleteSeance(getSeanceRequest.id??0)
                if (deletedSeance) {
                    res.status(200).send({ "message": "Seance deleted" })
                }
                else {
                    res.status(404).send({ error: "Did not find the seance" })
                }
            }
            else {
                res.status(404).send({ error: "Did not find the seance" })
            }

        }
        catch (error) {
            console.log(error)
            res.status(500).send({ error: "Did not find the seance" })
        }
    });

    // Modify seance
    app.patch("/seances/:id", async (req: Request, res: Response) => {
            
            const validation = seanceValidation.validate(req.body)
    
            if (validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }
    
            const seanceRequest = validation.value
            const seanceRepo = AppDataSource.getRepository(Seance)
    
            try {
                const updated = await seanceRepo.update(req.params.id, seanceRequest)
                if (updated) {
                    res.status(200).send({ "message": "Seance updated" })
                }
                else {
                    res.status(404).send({ error: "Error" })
                }
            }
            catch (error) {
                res.status(500).send({ error: "Internal error" })
            }
    
        });

    // USER ROUTES

    // POST
    app.post("/users", async (req: Request, res: Response) => {
        const validation = userValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
        const userRequest = validation.value
        const userRepo = AppDataSource.getRepository(User)

        try {
            const userCreated = await userRepo.save(userRequest)
            res.status(201).send(userCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    });

    // User Login
    /*
    app.post("/login", async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send({ error: "Email and password are required" });
            return;
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).send({ error: "Invalid email or password" });
                return;
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                res.status(401).send({ error: "Invalid email or password" });
                return;
            }

            const token = jwt.sign({ id: user.id }, process
                .env.JWT_SECRET as string, { expiresIn: "2h" });

            user.token = token;
            await user.save();

            res.status(200).send({ token });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });

    // User Logout
    
    app.post("/logout", async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            res.status(400).send({ error: "Email is required" });
            return;
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).send({ error: "User not found" });
                return;
            }

            user.token = null;
            await user.save();

            res.status(200).send({ message: "User logged out" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    */
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