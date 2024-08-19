// import Image from "next/image";
'use client'
import styles from "./page.module.css";
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import{AppBar, Box, Button, Container, Grid, Toolbar, Typography} from '@mui/material';
import Head from "next/head";
export default function Home() {

  const handleSubmit = async (planType) =>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000/',
      },
      body: JSON.stringify({ planType }), // Send the plan type
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }

  }
  return (
    <Container maxWidth='100vw'sx={{marginTop:'8%'}}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name='description' content='Create flashcard from your text'/>
      </Head>

      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant='h2' gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant='h5' gutterBottom>
          {' '}
          The easiest way to make flashcards from your text
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          href='/sign-up'
        >
          Get Started
        </Button>
      </Box>
      <Box sx={{my:6}}>
        <Typography variant='h4' gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6' gutterBottom>Easy Text Input</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='h6' gutterBottom>Smart flashcards</Typography>
            <Typography>
              {' '}
              Our AI Intelligently breaks down your text into concise flashcards, perfect for studying
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant='h6'gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              {' '}
              Acess your flashcards from any device, at any time, on the go. 
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant='h4' gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2}}>
              <Typography variant='h5' gutterBottom>Basic</Typography>
              <Typography variant='h6' gutterBottom>$5 / Month</Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant='contained' color='primary' sx={{mt:2}} onClick={() => handleSubmit('basic')}>
                Choose basic
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2}}>
                <Typography variant='h5' gutterBottom>Pro</Typography>
                <Typography variant='h6' gutterBottom>$10 / Month</Typography>
                <Typography>
                  {' '}
                  Unlimited flashcards and storage, with priority support. 
                </Typography>
                <Button 
                  variant='contained' 
                  color='primary' 
                  sx={{mt:2}}
                  onClick={() => handleSubmit('pro')}
                >
                  Choose pro
                </Button>
              </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
