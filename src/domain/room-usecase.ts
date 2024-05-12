import { DataSource } from "typeorm";
import { Room } from "../database/entities/room";

export interface ListRoomFilter {
    capacity: number
    type: string
    disabled_access: boolean,
    limit: number
}

export class RoomUseCase {
    constructor(private readonly db: DataSource) { }

    // Get Room by id
    async getRoom(id: number): Promise<Room | null> {
        const repo = this.db.getRepository(Room)
        const product = await repo.findOneBy({ id })
        return product
    }

    // Delete Product
    async deleteRoom(id: number): Promise<boolean> {
        const repo = this.db.getRepository(Room)
        const product = await repo.findOneBy({ id })
        if (product === null) return false

        await repo.remove(product)
        return true
    }

    // Update Room
    async updateRoom(id: number, values: {}): Promise<boolean> {
        const repo = this.db.getRepository(Room)
        const room = await repo.findOneBy({ id })
        if (room === null) return false

        await repo.update(room, values)
        return true
    }

    // List Products
    async listProduct(filter: ListRoomFilter): Promise<Room[]> {
        const repo = this.db.getRepository(Room)
        const rooms = await repo.findBy(filter)
        return rooms
    }

    // List ALL Rooms
    async listAllProducts(): Promise<Room[]> {
        const repo = this.db.getRepository(Room)
        const rooms = await repo.findBy({})
        return rooms
    }

}