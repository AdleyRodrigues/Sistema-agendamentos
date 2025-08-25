import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Booking, StorageAdapter } from '../features/booking/types';

interface BookingDB extends DBSchema {
    bookings: {
        key: string;
        value: Booking;
        indexes: {
            'by-date': string;
            'by-date-time': [string, string];
        };
    };
}

class IndexedDBStorage implements StorageAdapter {
    private db: IDBPDatabase<BookingDB> | null = null;

    private async getDB(): Promise<IDBPDatabase<BookingDB>> {
        if (this.db) return this.db;

        this.db = await openDB<BookingDB>('bookings-db', 1, {
            upgrade(db: any) {
                const store = db.createObjectStore('bookings', {
                    keyPath: 'id',
                });

                store.createIndex('by-date', 'dateISO');
                store.createIndex('by-date-time', ['dateISO', 'startTime'], { unique: false });
            },
        });

        return this.db;
    }

    async listBookingsByDate(dateISO: string): Promise<Booking[]> {
        const db = await this.getDB();
        return await db.getAllFromIndex('bookings', 'by-date', dateISO);
    }

    async findBookingByDateTime(dateISO: string, startTime: string): Promise<Booking | null> {
        const db = await this.getDB();
        const bookings = await db.getAllFromIndex('bookings', 'by-date-time', [dateISO, startTime]);

        // Retorna apenas bookings que não foram cancelados
        const activeBooking = bookings.find((booking: Booking) => booking.status !== 'cancelled');
        return activeBooking || null;
    }

    async createBooking(booking: Booking): Promise<void> {
        const db = await this.getDB();

        // Verifica se já existe um booking no mesmo horário que não foi cancelado
        const existingBooking = await this.findBookingByDateTime(booking.dateISO, booking.startTime);

        if (existingBooking) {
            throw new Error('Este horário já está ocupado. Por favor, escolha outro horário.');
        }

        await db.add('bookings', booking);
    }

    async getBooking(id: string): Promise<Booking | null> {
        const db = await this.getDB();
        const booking = await db.get('bookings', id);
        return booking || null;
    }

    // Método adicional para desenvolvimento/debug
    async clearAllBookings(): Promise<void> {
        const db = await this.getDB();
        await db.clear('bookings');
    }
}

export const indexedDbStorage = new IndexedDBStorage();
