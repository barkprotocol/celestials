import { prisma } from '@/lib/prisma';

/**
 * Interface representing a payment record.
 */
export interface Payment {
  id: string;
  token: string;
  amount: number;
  userWallet: string;
  status: 'success' | 'failed';
  createdAt: Date;
  error?: string | null;
}

/**
 * Creates a new payment record in the database.
 * 
 * @param data - Payment data to save in the database.
 * @returns The created payment record.
 */
export const createPaymentRecord = async (data: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> => {
  try {
    const payment = await prisma.payment.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return payment;
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw new Error('Failed to create payment record.');
  }
};

/**
 * Retrieves all payment records for a specific user wallet.
 * 
 * @param userWallet - The user's wallet address to filter payments.
 * @returns An array of payment records.
 */
export const getPaymentsByUserWallet = async (userWallet: string): Promise<Payment[]> => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userWallet },
      orderBy: { createdAt: 'desc' },
    });
    return payments;
  } catch (error) {
    console.error('Error fetching payment records:', error);
    throw new Error('Failed to fetch payment records.');
  }
};

/**
 * Retrieves a payment record by its ID.
 * 
 * @param id - The unique identifier of the payment.
 * @returns The payment record, or `null` if not found.
 */
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });
    return payment;
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    throw new Error('Failed to fetch payment record.');
  }
};
