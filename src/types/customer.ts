import { Gender } from 'config';

// ==============================|| TYPES - CUSTOMER  ||============================== //

export interface CustomerProps {
  modal: boolean;
}

// types/customer.ts
export interface CustomerList {
  docId: string;              
  customerId: string;         
  id: number;                
  customerName: string;
  customerFather: string;
  customerContact: string;
  customerAddress: string;
  userId: string;
  createdAt?: any;
}



