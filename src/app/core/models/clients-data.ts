export interface OrderHistory {
  material: string;
  orderDate: string;
  price: number;
  quantity: number;
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
  email: string;
  id: string;
  phone: string;
  status: string;
  orderHistory: OrderHistory[];
}
