import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Flashcard Generator
        </Typography>
        
        <SignedOut>
          <Button color="inherit">
            <Link href="/sign-in" style={{ textDecoration: 'none', color: 'white' }}>Login</Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" style={{ textDecoration: 'none', color: 'white' }}>Sign Up</Link>
          </Button>
        </SignedOut>

        <SignedIn>
        <Button color="inherit">
            <Link href="/generate" style={{ textDecoration: 'none', color: 'white', marginRight: '10px'}}>Generate</Link>
          </Button>
          <Button color="inherit">
            <Link href="/flashcards" style={{ textDecoration: 'none', color: 'white', marginRight: '10px'}}>Collections</Link>
          </Button>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
