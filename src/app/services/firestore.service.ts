import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc, FirestoreDataConverter, query } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';  // Importamos 'map' desde rxjs/operators

export interface Item {
  id?: string;
  name: string;
  description: string;
  editing?: boolean;
}

// Conversor para convertir de DocumentData a Item
const itemConverter: FirestoreDataConverter<Item> = {
  toFirestore(item: Item) {
    return {
      name: item.name,
      description: item.description,
    };
  },
  fromFirestore(snapshot: any): Item {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
    };
  }
};

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private collectionName = 'items';  // Nombre de la colección en Firestore

  constructor(private firestore: Firestore) {}

  // Obtener todos los elementos de Firestore
  getItems(): Observable<Item[]> {
    const itemsCollection = collection(this.firestore, this.collectionName).withConverter(itemConverter);  // Aplicamos el conversor aquí
    const itemsQuery = query(itemsCollection);  // Hacemos una consulta para obtener los documentos
    return from(getDocs(itemsQuery)).pipe(
      map((snapshot: any) => snapshot.docs.map((doc: any) => doc.data() as Item))  // Aseguramos que 'snapshot' y 'doc' tengan el tipo adecuado
    );
  }

  // Agregar un nuevo item a Firestore
  addItem(item: Item): Promise<any> {
    const itemsCollection = collection(this.firestore, this.collectionName).withConverter(itemConverter);
    return addDoc(itemsCollection, item);
  }

  // Actualizar un item existente en Firestore
  updateItem(id: string, item: Partial<Item>): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`).withConverter(itemConverter);
    return updateDoc(itemDoc, item);
  }

  // Eliminar un item de Firestore
  deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`).withConverter(itemConverter);
    return deleteDoc(itemDoc);
  }
}
