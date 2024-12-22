import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ZodError, z } from 'zod';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// Create a new ratelimiter, that allows 5 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "5 s"),
});

const subscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { email } = subscriptionSchema.parse(body);

    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 200 });
    }

    const newSubscription = await prisma.subscription.create({
      data: { email },
    });

    return NextResponse.json({ message: SUCCESS_MESSAGES.SUBSCRIPTION_SUCCESS, data: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'This email is already subscribed' }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: ERROR_MESSAGES.SUBSCRIPTION_FAILED }, { status: 500 });
  }
}
