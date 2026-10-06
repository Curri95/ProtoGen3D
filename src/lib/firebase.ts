import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocFromServer, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Must specify firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Configure Google OAuth Provider with Workspace Scopes
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-Memory Token Caching (Never store in localStorage / sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
): Unsubscribe => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string | null } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Firestore Error Handler Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client offline warning:", error.message);
    }
    return false;
  }
}

// Quote Data Model
export interface StoredQuote {
  id: string;
  ticketNumber: string;
  userId: string;
  company: string;
  email: string;
  technology: string;
  material: string;
  surfaceFinish: string;
  quantity: number;
  slaSpeed: string;
  status: 'received' | 'dfm_review' | 'in_production' | 'qc_cmm' | 'shipped';
  autoDfmCompensation: boolean;
  fileNames: string;
  notes?: string;
  syncedToSheets?: boolean;
  createdAt: string;
}

// Save Quote to Firestore
export async function saveQuoteToFirestore(quote: StoredQuote): Promise<void> {
  const docRef = doc(db, 'quotes', quote.id);
  try {
    await setDoc(docRef, quote);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `quotes/${quote.id}`);
  }
}

// Subscribe to User Quotes
export function subscribeToUserQuotes(
  userId: string,
  onQuotes: (quotes: StoredQuote[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const quotesQuery = query(
    collection(db, 'quotes'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    quotesQuery,
    (snapshot) => {
      const quotes: StoredQuote[] = [];
      snapshot.forEach((doc) => {
        quotes.push(doc.data() as StoredQuote);
      });
      // Sort in-memory by date descending
      quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onQuotes(quotes);
    },
    (error) => {
      console.error("Quotes snapshot error:", error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'quotes');
    }
  );
}
