import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, child } from "firebase/database";

const firebaseConfig = {
  databaseURL: "url"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
