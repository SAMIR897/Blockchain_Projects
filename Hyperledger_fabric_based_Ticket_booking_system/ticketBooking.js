'use strict';

const { Contract } = require('fabric-contract-api');

class TicketBookingContract extends Contract {

    async initLedger(ctx) {
        console.info('Initializing Ledger with sample data');
        const events = [
            {
                eventId: 'EVENT1',
                name: 'Concert A',
                date: '2025-09-30',
                location: 'Hall 1',
                totalTickets: 100,
            },
            {
                eventId: 'EVENT2',
                name: 'Concert B',
                date: '2025-10-15',
                location: 'Hall 2',
                totalTickets: 50,
            },
        ];

        for (const event of events) {
            await ctx.stub.putState(
                `EVENT${event.eventId}`,
                Buffer.from(JSON.stringify(event))
            );
            // create tickets for each event
            for (let seat = 1; seat <= event.totalTickets; seat++) {
                const ticket = {
                    ticketId: `${event.eventId}_T${seat}`,
                    eventId: event.eventId,
                    seatNo: seat,
                    status: 'available',
                    owner: '',
                };
                await ctx.stub.putState(ticket.ticketId, Buffer.from(JSON.stringify(ticket)));
            }
        }
        console.info('Ledger Initialized');
    }

    async queryEvent(ctx, eventId) {
        const eventKey = `EVENT${eventId}`;
        const eventBytes = await ctx.stub.getState(eventKey);
        if (!eventBytes || eventBytes.length === 0) {
            throw new Error(`Event ${eventId} not found`);
        }
        return eventBytes.toString();
    }

    async queryAllEvents(ctx) {
        const iterator = await ctx.stub.getStateByRange('EVENT', 'EVENT9999999');
        const allResults = [];

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                // Only include keys starting with 'EVENT'
                if (!Key.startsWith('EVENT')) {
                    continue;
                }
                const Record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(Record);
            }

            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    async queryTicketsByOwner(ctx, ownerId) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const tickets = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                if (obj.owner === ownerId && obj.ticketId && obj.status === 'booked') {
                    tickets.push(obj);
                }
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(tickets);
            }
        }
    }

    async bookTicket(ctx, eventId, seatNo, ownerId) {
        const ticketId = `${eventId}_T${seatNo}`;
        const ticketBytes = await ctx.stub.getState(ticketId);
        if (!ticketBytes || ticketBytes.length === 0) {
            throw new Error(`Ticket ${ticketId} not found`);
        }

        const ticket = JSON.parse(ticketBytes.toString());
        if (ticket.status === 'booked') {
            throw new Error(`Ticket ${ticketId} already booked`);
        }

        ticket.status = 'booked';
        ticket.owner = ownerId;

        await ctx.stub.putState(ticketId, Buffer.from(JSON.stringify(ticket)));
        return JSON.stringify(ticket);
    }
}

module.exports = TicketBookingContract;
