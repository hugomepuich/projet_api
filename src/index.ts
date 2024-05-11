import express from "express";
import { initRoutes } from "./handlers/routes";
import { AppDataSource } from "./database/database";


const main = async () => {
    const app = express()
    const port = 3000

    try {

        await AppDataSource.initialize()
        console.error("Connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot connect to database")
        process.exit(1)
    }

    app.use(express.json())
    initRoutes(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()