//ng g s services/firestore

import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc, FirestoreDataConverter, query } from '@angular/fire/firestore';
//Firestore: representa la base de datos FireStore
//collection: Función acceder a una colección en Firestore
//getDocs: Función para obtener todos los documentos de una colección
//doc: Función para acceder a un documento específico en Firestore
//addDoc: Función para agregar un documento a una colección en Firestore
//updateDoc: Función para actualizar un documento en Firestore
//deleteDoc: Función para eliminar un documento de Firestore
//FirestoreDataConverter: Permitir convertir los datos entre Firestore y nuestro modelo de datos definidos en la aplicación
//query: Función para hacer una consulta en Firestore para obtener documentos que se identifiquen con los criterios de búsqueda
import { Observable, from } from 'rxjs';
//Observable: Es un tipo de dato que puede emitir valores a lo largo tiempo
//from: Crea una observable a partir de una promesa o un iterable en observables
import { map } from 'rxjs/operators';  // Importamos 'map' desde rxjs/operators
//map: Operador que nos permite transformar los valores emitidos por un observable

//Modelos de datos en Angular: Interfaces que representan un elemento en Angular y que además definen su estructura.
export interface Item {
  id?: string;
  name: string;
  description: string;
  editing?: boolean; // Lo vamos a usar para saber si el item está siendo editado
}

export interface Tareas {
  id?: string;
  name: string;
  description: string;
  editing?: boolean; // Lo vamos a usar para saber si el item está siendo editado
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
  //Definimos el nombre de la colección de Firestore en la que vamos a trabajar
  private collectionName = 'items'
  private collectionNameTareas = 'tareas' // Nombre de la colección en Firestore

  constructor(private firestore: Firestore) {}

  // Obtener todos los elementos de Firestore
  getItems(): Observable<Item[]> {
    //Obtener la colección de datos "items" desde firestore
    const itemsCollection = collection(this.firestore, this.collectionName).withConverter(itemConverter);  // Aplicamos el conversor aquí
    const itemsQuery = query(itemsCollection);  // Hacemos una consulta para obtener los documentos
    return from(getDocs(itemsQuery)).pipe(
      map((snapshot: any) => snapshot.docs.map((doc: any) => doc.data() as Item))  // Aseguramos que 'snapshot' y 'doc' tengan el tipo adecuado
    );
  }

  getTareas(): Observable<Tareas[]> {
    //Obtener la colección de datos "items" desde firestore
    const itemsCollection = collection(this.firestore, this.collectionNameTareas).withConverter(itemConverter);  // Aplicamos el conversor aquí
    const itemsQuery = query(itemsCollection);  // Hacemos una consulta para obtener los documentos
    return from(getDocs(itemsQuery)).pipe(
      map((snapshot: any) => snapshot.docs.map((doc: any) => doc.data() as Tareas))  // Aseguramos que 'snapshot' y 'doc' tengan el tipo adecuado
    );
  }

  // Agregar un nuevo item a Firestore
  addItem(item: Item): Promise<any> {
    const itemsCollection = collection(this.firestore, this.collectionName).withConverter(itemConverter);
    return addDoc(itemsCollection, item);
  }

  addTarea(item: Tareas): Promise<any> {
    const itemsCollection = collection(this.firestore, this.collectionNameTareas).withConverter(itemConverter);
    return addDoc(itemsCollection, item);
  }

  // Actualizar un item existente en Firestore
  updateItem(id: string, item: Partial<Item>): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`).withConverter(itemConverter);
    return updateDoc(itemDoc, item);
  }

  updateTarea(id: string, item: Partial<Tareas>): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionNameTareas}/${id}`).withConverter(itemConverter);
    return updateDoc(itemDoc, item);
  }

  // Eliminar un item de Firestore
  deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionName}/${id}`).withConverter(itemConverter);
    return deleteDoc(itemDoc);
  }

  deleteTarea(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this.collectionNameTareas}/${id}`).withConverter(itemConverter);
    return deleteDoc(itemDoc);
  }
}
