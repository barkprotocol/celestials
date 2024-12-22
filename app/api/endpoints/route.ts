import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSolanaPaymentTransaction, confirmSolanaTransaction } from '@/lib/solana-utils';

export async function GET(req: Request) {
  try {
    const { paymentId } = req.url.searchParams;

    if (!paymentId) {
      return NextResponse.json(
        { message: 'Missing payment ID' },
        { status: 400 }
      );
    }

    // Fetch payment information by ID from the database
    const payment = await prisma.payment.findUnique({
      where: { id: Number(paymentId) },
    });

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { payment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving payment information:', error);
    return NextResponse.json(
      { message: 'Error retrieving payment' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse the incoming request data
    const { token, amount, userWallet, paymentMethod } = await req.json();

    if (!token || !amount || !userWallet || !paymentMethod) {
      return NextResponse.json(
        { message: 'Missing required fields (token, amount, userWallet, paymentMethod)' },
        { status: 400 }
      );
    }

    // Create a payment record in the database
    const payment = await prisma.payment.create({
      data: {
        token,
        amount,
        userWallet,
        status: 'pending', // Status is pending until payment is confirmed
        createdAt: new Date(),
        paymentMethod,
      },
    });

    // Handle payment method-specific logic (e.g., Solana)
    if (paymentMethod === 'Solana') {
      // Generate a payment transaction using the Solana utility function
      const { transactionId, signature } = await createSolanaPaymentTransaction(userWallet, amount);

      // Update the payment record with the transaction ID and signature
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          transactionId,
          signature,
        },
      });

      return NextResponse.json(
        { message: 'Payment created successfully', payment },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: 'Payment method not supported' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { message: 'Error creating payment' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Parse the incoming request data
    const { transactionId, paymentStatus, transactionStatus } = await req.json();

    if (!transactionId || !paymentStatus || !transactionStatus) {
      return NextResponse.json(
        { message: 'Missing required fields (transactionId, paymentStatus, transactionStatus)' },
        { status: 400 }
      );
    }

    // Find the payment by transaction ID
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update the payment status based on the transaction confirmation
    const updatedPayment = await prisma.payment.update({
      where: { transactionId },
      data: {
        status: paymentStatus,
        transactionStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Payment status updated successfully', updatedPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { message: 'Error updating payment status' },
      { status: 500 }
    );
  }
}
