import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, catchError, from, map } from 'rxjs';
import { ClientsData } from '../../../core/models/clients-data';
import { DateConversionService } from './date-conversion.service'; // Import the new service

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  firestore = inject(Firestore);
  dateConversionService = inject(DateConversionService); // Inject the service

  clientsData(): Observable<ClientsData[]> {
    return collectionData(
      collection(this.firestore, 'clients') as CollectionReference<DocumentData>
    ).pipe(map((documents: any[]) => this.mapToClientsData(documents)));
  }

  private mapToClientsData(documents: any[]): ClientsData[] {
    return documents.map((doc) => {
      const clientData = {
        address: doc.address,
        clientSince: this.dateConversionService.convertTimestampToDate(
          doc.clientSince
        ),
        companyName: doc.companyName,
        contactPerson: doc.contactPerson,
        deliveryMethods: doc.deliveryMethods,
        email: doc.email,
        id: doc.id,
        phone: doc.phone,
        status: doc.status,
        orderHistory: (doc.ordersHistory || []).map((order: any) => ({
          invoiceNumber: order.invoiceNumber,
          material: order.material,
          orderDate: this.dateConversionService.convertTimestampToDate(
            order.orderDate
          ),
          orderID: order.orderID,
          paymentStatus: order.paymentStatus,
          price: order.price,
          quantity: order.quantity,
          receiptNumber: order.receiptNumber,
          status: order.status,
        })),
      };
      return clientData;
    });
  }

  addClient(clientData: any): Observable<void> {
    const clientsCollection = collection(
      this.firestore,
      'clients'
    ) as CollectionReference<DocumentData>;
    return from(addDoc(clientsCollection, clientData)).pipe(
      map(() => {
        console.log('Client added successfully');
      }),
      catchError((error) => {
        console.error('Error adding client: ', error);
        throw error;
      })
    );
  }
}
