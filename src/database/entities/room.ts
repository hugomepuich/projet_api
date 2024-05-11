import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "room" })
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    image: string

    @Column()
    type: string

    @Column()
    capacity: number

    @Column()
    disabled_access: boolean

    constructor(id: number, 
                name: string, 
                description: string, 
                image: string,
                type: string,
                capacity: number,
                disabled_access: boolean) {
        this.id = id
        this.name = name
        this.description = description
        this.image = image
        this.type = type
        this.capacity = capacity
        this.disabled_access = disabled_access
    }
}