import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, child } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://workspacemember-9f193-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);