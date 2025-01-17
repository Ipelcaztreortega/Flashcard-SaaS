import { loadStripe } from '@stripe/stripe-js'

// Defining our promise
let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY)
  }
  return stripePromise
}

export default getStripe;