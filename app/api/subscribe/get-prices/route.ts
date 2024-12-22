import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define a function to handle GET requests for fetching subscription pricing
export async function GET(req: Request) {
  try {
    // Fetch subscription pricing details from the database
    const prices = await prisma.subscriptionPrice.findMany();

    // If no prices are found, return an appropriate message
    if (prices.length === 0) {
      return NextResponse.json(
        { message: 'No pricing information available' },
        { status: 404 }
      );
    }

    // Respond with the list of prices
    return NextResponse.json(
      { prices },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching subscription prices: ', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching subscription prices' },
      { status: 500 }
    );
  }
}
