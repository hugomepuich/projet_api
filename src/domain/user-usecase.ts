import { DataSource } from "typeorm";
import { User } from "../database/entities/user";

export interface ListUserFilter {
    admin: boolean
}

export class UserUseCase {
    constructor(private readonly db: DataSource) { }

    // Get User by id
    async getUser(id: number): Promise<User | null> {
        const repo = this.db.getRepository(User)
        const user = await repo.findOneBy({ id })
        return user
    }

    // Delete User by id
    async deleteUser(id: number): Promise<boolean> {
        const repo = this.db.getRepository(User)
        const product = await repo.findOneBy({ id })
        if (product === null) return false

        await repo.remove(product)
        return true
    }

    async updateUser(id: number, values: {}): Promise<boolean> {
        const repo = this.db.getRepository(User)
        const user = await repo.findOneBy({ id })
        if (user === null) return false

        await repo.update(user, values)
        return true
    }

    // List Users
    async listUsers(filter: ListUserFilter): Promise<User[]> {
        const repo = this.db.getRepository(User)
        const users = await repo.findBy(filter)
        return users
    }

    // List ALL Users
    async listAllUsers(): Promise<User[]> {
        const repo = this.db.getRepository(User)
        const users = await repo.findBy({})
        return users
    }

}