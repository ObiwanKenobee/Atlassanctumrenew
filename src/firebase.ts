import { app, auth, googleProvider, firestoreInstance } from "./lib/db";

// Export unified instances to avoid duplicate initialization and eliminate WebChannel timeouts
export { auth, googleProvider, firestoreInstance as db };
export default app;

