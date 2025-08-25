// Storage adapter principal - troque aqui para migrar de IndexedDB para Firestore
import { indexedDbStorage } from './indexedDbStorage';
// import { firestoreStorage } from './firestoreStorage';

// Para trocar para Firestore, descomente a linha abaixo e comente a de cima:
export const storage = indexedDbStorage;
// export const storage = firestoreStorage;
