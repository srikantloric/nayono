import { useEffect, useMemo, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import useFirebase from 'hooks/useFirebase';
import { EventList } from 'types/event';

// ==============================|| FIRESTORE - INSERT EVENT ||============================== //

export async function insertEvent(
  db: firebase.firestore.Firestore,
  data: Omit<EventList, 'docId' | 'eventId' | 'createdAt'>
) {
  const docRef = db.collection('events').doc();

  await docRef.set({
    ...data,
    eventId: docRef.id, // 🔑 eventId === documentId
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return docRef.id;
}

// ==============================|| FIRESTORE - GET EVENTS (REALTIME) ||============================== //

export function useGetEvents() {
  const { db, user } = useFirebase();

  const [events, setEvents] = useState<EventList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // ✅ WAIT for auth + db
    if (!db || !user?.id) return;

    setLoading(true);

    const unsubscribe = db
      .collection('events')
      .where('userId', '==', user.id) // 🔑 Auth UID
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const list: EventList[] = snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...(doc.data() as Omit<EventList, 'docId'>)
          }));

          setEvents(list);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [db, user?.id]);

  return useMemo(
    () => ({
      events,
      eventsLoading: loading,
      eventsError: error,
      eventsEmpty: !loading && events.length === 0
    }),
    [events, loading, error]
  );
}
