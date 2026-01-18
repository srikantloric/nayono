import { use } from 'react';

// project-imports
import AuthContext from 'contexts/FirebaseContext';

// ==============================|| HOOKS - AUTH ||============================== //

export default function useAuth() {
  const context = use(AuthContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
}
