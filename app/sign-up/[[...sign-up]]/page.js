import { SignUp } from '@clerk/nextjs';
import {Button, Container, Typography, AppBar, Toolbar, Box} from '@mui/material';
import Link from 'next/link';


export default function SignUpPage(){
    return(
        <Container maxWidth='100vw'>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                marginTop='20px'
            >
                <Typography variant='h4' marginBottom='20px'>Sign Up</Typography>
                <SignUp/>
            </Box>
        </Container>
    )
}