import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ticket" })
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    seance: number

    @Column()
    seat: number

    @Column()
    price: number

    constructor(id: number,
                seance: number,
                seat: number,
                price: number) {
        this.id = id
        this.seance = seance
        this.seat = seat
        this.price = price
    }

}