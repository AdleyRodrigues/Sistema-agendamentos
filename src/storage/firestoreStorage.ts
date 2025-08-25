import type { Booking, StorageAdapter } from '../features/booking/types';

// TODO(next): Implementar Firestore adapter quando migrar do IndexedDB
class FirestoreStorage implements StorageAdapter {
    async listBookingsByDate(_dateISO: string): Promise<Booking[]> {
        // TODO: Implementar query no Firestore
        // const bookingsRef = collection(db, 'bookings');
        // const q = query(bookingsRef, where('dateISO', '==', dateISO));
        // const snapshot = await getDocs(q);
        // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

        console.warn('FirestoreStorage.listBookingsByDate não implementado ainda');
        return [];
    }

    async findBookingByDateTime(_dateISO: string, _startTime: string): Promise<Booking | null> {
        // TODO: Implementar query composta no Firestore
        // const bookingsRef = collection(db, 'bookings');
        // const q = query(
        //   bookingsRef, 
        //   where('dateISO', '==', dateISO),
        //   where('startTime', '==', startTime),
        //   where('status', '!=', 'cancelled')
        // );
        // const snapshot = await getDocs(q);
        // return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Booking;

        console.warn('FirestoreStorage.findBookingByDateTime não implementado ainda');
        return null;
    }

    async createBooking(_booking: Booking): Promise<void> {
        // TODO: Implementar criação no Firestore com verificação de conflito
        // const existingBooking = await this.findBookingByDateTime(booking.dateISO, booking.startTime);
        // if (existingBooking) {
        //   throw new Error('Este horário já está ocupado. Por favor, escolha outro horário.');
        // }
        // 
        // const bookingsRef = collection(db, 'bookings');
        // await addDoc(bookingsRef, booking);

        console.warn('FirestoreStorage.createBooking não implementado ainda');
        throw new Error('Firestore adapter não implementado ainda');
    }

    async getBooking(_id: string): Promise<Booking | null> {
        // TODO: Implementar busca por ID no Firestore
        // const bookingRef = doc(db, 'bookings', id);
        // const snapshot = await getDoc(bookingRef);
        // return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Booking : null;

        console.warn('FirestoreStorage.getBooking não implementado ainda');
        return null;
    }
}

export const firestoreStorage = new FirestoreStorage();
