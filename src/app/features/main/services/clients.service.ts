import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { ClientsData } from '../../../core/models/clients-data';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  firestore = inject(Firestore);

  clientsData(): Observable<ClientsData[]> {
    return collectionData(
      collection(this.firestore, 'clients') as CollectionReference<DocumentData>
    ).pipe(map((documents: any[]) => this.mapToClientsData(documents)));
  }

  // Separate function to transform documents into ClientsData[]
  private mapToClientsData(documents: any[]): ClientsData[] {
    return documents.map((doc) => ({
      address: doc.address,
      clientSince: doc.clientSince,
      companyName: doc.companyName,
      contactPerson: doc.contactPerson,
      email: doc.email,
      id: doc.id,
      phone: doc.phone,
      status: doc.status,
    }));
  }
}
