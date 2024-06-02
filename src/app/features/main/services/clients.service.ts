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
        email: doc.email,
        id: doc.id,
        phone: doc.phone,
        status: doc.status,
        orderHistory: (doc.ordersHistoy || []).map((order: any) => ({
          invoiceNumber: order.invoiceNumber,
          material: order.material,
          orderDate: this.dateConversionService.convertTimestampToDate(
            order.orderDate
          ),
          orderID: order.orderID,
          price: order.price,
          quantity: order.quantity,
          receiptNumber: order.receiptNumber,
          status: order.status,
        })),
      };
      return clientData;
    });
  }
}
