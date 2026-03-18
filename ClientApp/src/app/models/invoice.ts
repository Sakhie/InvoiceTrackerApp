export interface Invoice {
  invoiceNumber: number;
  customerId: number;
  invoiceDate: Date;
  dueDate: Date;
  invoiceAmount: number;
  paidAmount: number;
  balance: number;
  statusId: number;
}
