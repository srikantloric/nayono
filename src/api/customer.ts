import { useEffect, useMemo, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import useFirebase from 'hooks/useFirebase';
import { CustomerList, CustomerProps } from 'types/customer';

// ==============================|| CUSTOMER MODAL STATE ||============================== //

const initialState: CustomerProps = {
  modal: false
};

// ==============================|| FIRESTORE - CUSTOMER ||============================== //

export function useGetCustomer() {
  const { db } = useFirebase();

  const [customers, setCustomers] = useState<CustomerList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!db) return;

    const unsubscribe = db.collection('customers').onSnapshot(
      (snapshot) => {
        const list: CustomerList[] = snapshot.docs.map((doc) => ({
          docId: doc.id, // ✅ Firestore document ID
          ...(doc.data() as Omit<CustomerList, 'docId'>)
        }));

        setCustomers(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  return useMemo(
    () => ({
      customers,
      customersLoading: loading,
      customersError: error,
      customersEmpty: !loading && customers.length === 0
    }),
    [customers, loading, error]
  );
}

// ==============================|| FIRESTORE CRUD ||============================== //

/**
 * Insert new customer
 * Firestore auto-generates document ID
 */
export async function insertCustomer(
  db: firebase.firestore.Firestore,
  newCustomer: Omit<CustomerList, 'docId' | 'customerId'>
) {
  const docRef = db.collection('customers').doc(); // 🔥 creates doc reference

  await docRef.set({
    ...newCustomer,
    customerId: docRef.id, // ✅ SAME as document ID
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return docRef.id;
}

/**
 * Update customer by Firestore document ID
 */
export async function updateCustomer(
  db: firebase.firestore.Firestore,
  docId: string,
  updatedCustomer: Partial<CustomerList>
) {
  await db.collection('customers').doc(docId).update(updatedCustomer);
}

/**
 * Delete customer by Firestore document ID
 */
export async function deleteCustomer(
  db: firebase.firestore.Firestore,
  docId: string
) {
  await db.collection('customers').doc(docId).delete();
}

// ==============================|| CUSTOMER MODAL STATE (KEEP AS IS) ||============================== //

export function useGetCustomerMaster() {
  const [state, setState] = useState<CustomerProps>(initialState);

  return useMemo(
    () => ({
      customerMaster: state,
      customerMasterLoading: false
    }),
    [state]
  );
}

export function handlerCustomerDialog(modal: boolean) {
  return { modal };
}
