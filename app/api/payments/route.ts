import { NextApiRequest, NextApiResponse } from 'next';
import createPayment from '@/api/subscribe/payments';

// Payment API Route to handle payment requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Call the createPayment function that processes the payment
    await createPayment(req, res);
  } else {
    // Return method not allowed if it's not a POST request
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
