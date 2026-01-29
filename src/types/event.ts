import firebase from 'firebase/compat/app';

export interface EventList {
  docId: string;

  eventId: string;
  name: string;
  date: string;
  status: 'CREATED' | 'ACTIVE' | 'LOCKED';

  clientPin: string;
  pinExpiry: string;

  cameras: number;
  totalPhotos: number;
  selectedCount: number;

  createdBy: {
    customerId: string;
    customerName: string;
  };

  userId: string;
  createdAt?: firebase.firestore.Timestamp;
}
