
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase"; 


const defaultWeek = {
  Monday: 0,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 0,
  Friday: 0,
  Saturday: 0,
  Sunday: 0,
};


export const getContribDocRef = (userId) =>
  doc(db, "users", userId, "contributions", "week");


export async function ensureWeekDoc(userId) {
  const ref = getContribDocRef(userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...defaultWeek, createdAt: serverTimestamp() });
  }
}


export async function fetchWeekContributions(userId) {
  const ref = getContribDocRef(userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...defaultWeek, createdAt: serverTimestamp() });
    return { ...defaultWeek };
  }
  return snap.data();
}


export async function incrementContribution(userId, weekday, amount = 1) {
  const ref = getContribDocRef(userId);
  try {
    await updateDoc(ref, { [weekday]: increment(amount), lastUpdated: serverTimestamp() });
  } catch (err) {
   
    const base = { ...defaultWeek, [weekday]: amount, createdAt: serverTimestamp() };
    await setDoc(ref, base);
  }
}


export async function decrementContributionSafely(userId, weekday, amount = 1) {
  const ref = getContribDocRef(userId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;
    const current = snap.data()[weekday] || 0;
    const newVal = Math.max(0, current - amount);
    transaction.update(ref, { [weekday]: newVal });
  });
}
