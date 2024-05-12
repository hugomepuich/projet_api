import { DataSource } from 'typeorm';
import { Ticket } from '../entities/ticket';

export class TicketUseCase {
    constructor(private readonly db: DataSource) {}

    async getTicket(id: number): Promise<Ticket | null> {
        const repo = this.db.getRepository(Ticket);
        const ticket = await repo.findOneBy({ id });
        return ticket;
    }

    async deleteTicket(id: number): Promise<boolean> {
        const repo = this.db.getRepository(Ticket);
        const ticket = await repo.findOneBy({ id });
        if (ticket === null) return false;

        await repo.remove(ticket);
        return true;
    }

    async updateTicket(id: number, values: {}): Promise<boolean> {
        const repo = this.db.getRepository(Ticket);
        const ticket = await repo.findOneBy({ id });
        if (ticket === null) return false;

        await repo.update(ticket, values);
        return true;
    }
}