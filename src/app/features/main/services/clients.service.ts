import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
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

  private mapToClientsData(documents: any[]): ClientsData[] {
    return documents.map((doc) => {
      const clientData = {
        address: doc.address,
        clientSince: this.convertTimestampToDate(doc.clientSince),
        companyName: doc.companyName,
        contactPerson: doc.contactPerson,
        email: doc.email,
        id: doc.id,
        phone: doc.phone,
        status: doc.status,
        orderHistory: (doc.orderHistory || []).map((order: any) => ({
          material: order.material,
          orderDate: order.orderDate,
          price: order.price,
          quantity: order.quantity,
          status: order.status,
        })),
      };
      return clientData;
    });
  }

  private convertTimestampToDate(timestamp?: {
    seconds: number;
    nanoseconds: number;
  }): string {
    if (
      !timestamp ||
      timestamp.seconds === undefined ||
      timestamp.nanoseconds === undefined
    ) {
      return 'N/A'; // or return an empty string or a default value
    }

    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString(); // You can format the date as needed
  }
}
