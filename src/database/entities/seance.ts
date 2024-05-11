import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "seance" })
export class Seance {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    room: number

    @Column()
    movie: number

    @Column()
    start_time: string

    @Column()
    end_time: string

    constructor(id: number,
                room: number,
                movie: number,
                start_time: string,
                end_time: string) {
        this.id = id
        this.room = room
        this.movie = movie
        this.start_time = start_time
        this.end_time = end_time
    }

}