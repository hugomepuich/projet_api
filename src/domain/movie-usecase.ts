import { DataSource } from "typeorm";
import { Movie } from "../database/entities/movie";

export interface ListMovieFilter {
    type: string
    limit: number
}

export class MovieUseCase {
    constructor(private readonly db: DataSource) { }

    // Get Movie by id
    async getMovie(id: number): Promise<Movie | null> {
        const repo = this.db.getRepository(Movie)
        const movie = await repo.findOneBy({ id })
        return movie
    }

    // Delete Movie
    async deleteMovie(id: number): Promise<boolean> {
        const repo = this.db.getRepository(Movie)
        const movie = await repo.findOneBy({ id })
        if (movie === null) return false

        await repo.remove(movie)
        return true
    }

    // List Movies
    async listMovie(filter: ListMovieFilter): Promise<Movie[]> {
        const repo = this.db.getRepository(Movie)
        const movies = await repo.findBy(filter)
        return movies
    }

    async updateMovie(id: number, values: {}): Promise<boolean> {
        const repo = this.db.getRepository(Movie)
        const movie = await repo.findOneBy({ id })
        if (movie === null) return false

        await repo.update(movie, values)
        return true
    }

    // List ALL Movies
    async listAllMovies(): Promise<Movie[]> {
        const repo = this.db.getRepository(Movie)
        const movies = await repo.findBy({})
        return movies
    }

}