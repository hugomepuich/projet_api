import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    admin: boolean

    @Column({ nullable: true })
    jwt: string;

    constructor(id: number, 
                firstName: string, 
                lastName: string,
                email: string,
                admin: boolean,
                jwt: string) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.admin = admin
        this.jwt = jwt
    }
}