import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  userId: z.string(),
  type: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  paymentId: z.string().optional(),
})

const getSubscriptionPrices = () => {
  return {
    MONTHLY: {
      amount: 99,
      currency: 'INR',
      description: 'Monthly subscription'
    },
    QUARTERLY: {
      amount: 267,
      currency: 'INR',
      description: 'Quarterly subscription (10% off)'
    },
    YEARLY: {
      amount: 950,
      currency: 'INR',
      description: 'Yearly subscription (20% off)'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, paymentId } = createSubscriptionSchema.parse(body)

    // For demo mode, return mock subscription
    const prices = getSubscriptionPrices()
    const price = prices[type]
    const startDate = new Date()
    let endDate = new Date()
    
    switch (type) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
    }

    // Return mock subscription for demo
    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully (demo mode)',
      subscription: {
        id: `sub_demo_${Date.now()}`,
        type: type,
        status: 'ACTIVE',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: price.amount,
        currency: price.currency
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Create subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    // For demo mode, return no active subscription
    return NextResponse.json({
      success: true,
      hasActiveSubscription: false,
      subscription: null,
      message: 'Demo mode - no active subscription'
    })

  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}