import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "your_username",
    password: "your_password",
    database: "your_database",
    logging: true, 
    synchronize: true,
    entities: [
        "src/database/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ]
})