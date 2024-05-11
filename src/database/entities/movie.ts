import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "movie" })
export class Movie {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    image: string

    @Column()
    type: string

    @Column()
    duration: number

    constructor(id: number, 
                title: string, 
                description: string, 
                image: string,
                type: string,
                duration: number,
                disabled_access: boolean) {
        this.id = id
        this.title = title
        this.description = description
        this.image = image
        this.type = type
        this.duration = duration
    }
}