import { DataSource } from "typeorm";
import { Seance } from "../database/entities/seance";

export interface ListSeanceFilter {
    room: number
    movie: number
    limit: number
}

export class SeanceUseCase {
    constructor(private readonly db: DataSource) { }

    // Get Seance by id
    async getSeance(id: number): Promise<Seance | null> {
        const repo = this.db.getRepository(Seance)
        const seance = await repo.findOneBy({ id })
        return seance
    }

    // Delete Seance
    async deleteSeance(id: number): Promise<boolean> {
        const repo = this.db.getRepository(Seance)
        const seance = await repo.findOneBy({ id })
        if (seance === null) return false

        await repo.remove(seance)
        return true
    }

    // List Seances
    async listSeance(filter: ListSeanceFilter): Promise<Seance[]> {
        const repo = this.db.getRepository(Seance)
        const seances = await repo.findBy(filter)
        return seances
    }

    // List ALL Seances
    async listAllSeances(): Promise<Seance[]> {
        const repo = this.db.getRepository(Seance)
        const seances = await repo.findBy({})
        return seances
    }

}