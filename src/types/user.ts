export interface UserProfile {
  uid: string;        // ✅ ADD THIS
  id?: string;        // Firestore user doc id (if you use it)
  email: string;
  name?: string;
  role?: string;
}
