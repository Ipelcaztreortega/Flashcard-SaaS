import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export async function GET(req, {params}){
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try{
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({error: {message:error.message}}, {status: 500})
  }
}
export async function POST(req) {

  const { planType } = await req.json(); // Get the plan type from the request body
  let price;
  let planName;

  // Determine price and plan name based on the plan type
  if (planType === 'basic') {
    price = 5; // $5 for basic
    planName = 'Basic subscription';
  } else if (planType === 'pro') {
    price = 10; // $10 for pro
    planName = 'Pro subscription';
  }

  const params = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: planName,
          },
          unit_amount: formatAmountForStripe(price, 'usd'),
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
  };
  
  const checkoutSession = await stripe.checkout.sessions.create(params)
  
  return NextResponse.json(checkoutSession, {
    status: 200,
  })
}
