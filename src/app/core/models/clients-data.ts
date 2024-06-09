export interface OrderHistory {
  invoiceNumber: string;
  material: string;
  orderDate: string;
  orderID: number;
  paymentStatus: string;
  price: number;
  quantity: number;
  receiptNumber: string;
  status: string;
}

export interface ClientsData {
  address: {
    city: string;
    number: string;
    street: string;
    zip: string;
  };
  clientSince: string;
  companyName: string;
  contactPerson: string;
  deliveryMethods: string[];
  email: string;
  id: string;
  phone: string;
  status: string;
  orderHistory: OrderHistory[];
}
