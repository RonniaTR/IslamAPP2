import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc 
} from 'firebase/firestore';

export class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.colRef = collection(db, collectionName);
  }

  async getAll() {
    try {
      const q = query(this.colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      return [];
    }
  }

  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} by ID:`, error);
      return null;
    }
  }

  async getBySlug(slug) {
    try {
      const q = query(this.colRef, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} by slug:`, error);
      return null;
    }
  }

  async getPublished(limitCount = 10) {
    try {
      const q = query(
        this.colRef, 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching published ${this.collectionName}:`, error);
      return [];
    }
  }

  async create(data) {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error(`Error updating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting in ${this.collectionName}:`, error);
      throw error;
    }
  }
}
