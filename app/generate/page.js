// 'use client';
// import { db } from '@/config/firebaseConfig';
// import {useUser} from '@clerk/nextjs';
// import { 
//     Box, 
//     Container, 
//     Typography, 
//     Paper, 
//     TextField, 
//     Button, 
//     Grid, 
//     Card, 
//     CardActionArea, 
//     CardContent, 
//     Dialog, 
//     DialogTitle, 
//     DialogContent, 
//     DialogContentText, 
//     DialogActions, 
//     CircularProgress 
// } from '@mui/material';
// import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function Generate() {
//     const { isLoaded, isSignedIn, user } = useUser();
//     const [flashcards, setFlashcards] = useState([]);
//     const [flipped, setFlipped] = useState([]);
//     const [text, setText] = useState('');
//     const [name, setName] = useState('');
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false); // New state for loading
//     const router = useRouter();

//     const handleSubmit = async () => {
//         setLoading(true); // Start loading

//         try {
//             const res = await fetch('api/generate', {
//                 method: 'POST',
//                 body: text,
//             });
//             const data = await res.json();
//             setFlashcards(data);
//         } catch (error) {
//             console.error('Error generating flashcards:', error);
//         } finally {
//             setLoading(false); // End loading
//         }
//     };

//     const handleCardClick = (id) => {
//         setFlipped((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     const handleOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     const saveFlashcards = async () => {
//         if (!name) {
//             alert('Please enter a name');
//             return;
//         }
//         const batch = writeBatch(db);
//         const userDocRef = doc(collection(db, 'users'), user.id);
//         const docSnap = await getDoc(userDocRef);

//         if (docSnap.exists()) {
//             const collections = docSnap.data().flashcards || [];
//             if (collections.find((f) => f.name === name)) {
//                 alert('Flashcard collection with the same name already exists');
//                 return;
//             } else {
//                 collections.push({ name });
//                 batch.set(userDocRef, { flashcards: collections }, { merge: true });
//             }
//         } else {
//             batch.set(userDocRef, { flashcards: [{ name }] });
//         }

//         const colRef = collection(userDocRef, name);
//         flashcards.forEach((flashcard) => {
//             const cardDocRef = doc(colRef);
//             batch.set(cardDocRef, flashcard);
//         });

//         await batch.commit();
//         handleClose();
//         router.push('/flashcards');
//     };

//     return (
//         <Container maxWidth='md'>
//             <Box 
//                 sx={{
//                     mt: 4, 
//                     mg: 6, 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     alignItems: 'center',
//                     marginTop: '10%',
//                 }}
//             >
//                 <Typography variant='h4'>Generate Flashcards</Typography>
//                 <Paper sx={{ p: 4, width: '100%' }}>
//                     <TextField 
//                         value={text} 
//                         onChange={(e) => setText(e.target.value)}
//                         label='Enter text'
//                         fullWidth
//                         multiline
//                         rows={4}
//                         variant='outlined'
//                         sx={{ mb: 2 }}
//                     />
//                     <Button
//                         variant='contained'
//                         color='primary'
//                         onClick={handleSubmit}
//                         fullWidth
//                     >
//                         Submit
//                     </Button>
//                 </Paper>
//             </Box>
//             {loading ? (
//                 <Box sx={{ mt: 4, textAlign: 'center' }}>
//                     <CircularProgress />
//                     <Typography variant='h6'>Generating flashcards...</Typography>
//                 </Box>
//             ) : (
//                 flashcards.length > 0 && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant='h5'>Flashcards Preview</Typography>
//                         <Grid container spacing={3}>
//                             {flashcards.map((flashcard, index) => (
//                                 <Grid item xs={12} sm={6} md={4} key={index}>
//                                     <Card>
//                                         <CardActionArea
//                                             onClick={() => handleCardClick(index)}
//                                         >
//                                             <CardContent>
//                                                 <Box 
//                                                     sx={{
//                                                         perspective: '1000px',
//                                                         '& > div': {
//                                                             transition: 'transform 0.6s',
//                                                             transformStyle: 'preserve-3d',
//                                                             position: 'relative',
//                                                             width: '100%',
//                                                             height: '200px',
//                                                             boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
//                                                             transform: flipped[index] 
//                                                             ? 'rotateY(180deg)'
//                                                             : 'rotateY(0deg)',
//                                                         },
//                                                         '& > div > div': {
//                                                             position: 'absolute',
//                                                             width: '100%',
//                                                             height: '100%',
//                                                             backfaceVisibility: 'hidden',
//                                                             display: 'flex',
//                                                             justifyContent: 'center',
//                                                             alignItems: 'center',
//                                                             padding: 2,
//                                                             boxSizing: 'border-box',
//                                                         },
//                                                         '& > div > div:nth-of-type(2)': {
//                                                             transform: 'rotateY(180deg)',
//                                                         },
//                                                     }}
//                                                 >
//                                                     <div>
//                                                         <div>
//                                                             <Typography variant='h5' component='div'>
//                                                                 {flashcard.front}
//                                                             </Typography>
//                                                         </div>
//                                                         <div>
//                                                             <Typography variant='h5' component='div'>
//                                                                 {flashcard.back}
//                                                             </Typography>
//                                                         </div>
//                                                     </div>
//                                                 </Box>
//                                             </CardContent>
//                                         </CardActionArea>
//                                     </Card>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', mb:10 }}>
//                             <Button variant='contained' color='secondary' onClick={handleOpen}>
//                                 Save
//                             </Button>
//                         </Box>
//                     </Box>
//                 )
//             )}

//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Save Flashcards</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Please enter a name for flashcards collection
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin='dense'
//                         label='Collection Name'
//                         type='text'
//                         fullWidth
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         variant='outlined'
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>
//                         Cancel
//                     </Button>
//                     <Button onClick={saveFlashcards}>
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// }

'use client';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { 
    Box, 
    Container, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Grid, 
    Card, 
    CardActionArea, 
    CardContent, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions, 
    CircularProgress 
} from '@mui/material';
import { collection, doc, getDoc, writeBatch, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generationAttempts, setGenerationAttempts] = useState(0); // Track attempts
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false); // For subscription message
    const router = useRouter();

    // Load user's generation attempts from Firestore
    useEffect(() => {
        if (user) {
            const userDocRef = doc(collection(db, 'users'), user.id);
            getDoc(userDocRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setGenerationAttempts(userData.generationAttempts || 0);
                }
            });
        }
    }, [user]);

    const handleSubmit = async () => {
        if (generationAttempts >= 1) {
            setSubscriptionDialogOpen(true); // Show subscription message if user has generated once
            return;
        }

        setLoading(true); // Start loading

        try {
            const res = await fetch('api/generate', {
                method: 'POST',
                body: text,
            });
            const data = await res.json();
            setFlashcards(data);

            // Increment generation attempts and save to Firestore
            const newAttempts = generationAttempts + 1;
            const userDocRef = doc(collection(db, 'users'), user.id);
            await setDoc(userDocRef, { generationAttempts: newAttempts }, { merge: true });
            setGenerationAttempts(newAttempts);
        } catch (error) {
            console.error('Error generating flashcards:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubscriptionClose = () => {
        setSubscriptionDialogOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }
        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth='md'>
            <Box 
                sx={{
                    mt: 4, 
                    mg: 6, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    marginTop: '10%',
                }}
            >
                <Typography variant='h4'>Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        label='Enter text'
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Submit
                    </Button>
                </Paper>
            </Box>
            {loading ? (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant='h6'>Generating flashcards...</Typography>
                </Box>
            ) : (
                flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant='h5'>Flashcards Preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea
                                            onClick={() => handleCardClick(index)}
                                        >
                                            <CardContent>
                                                <Box 
                                                    sx={{
                                                        perspective: '1000px',
                                                        '& > div': {
                                                            transition: 'transform 0.6s',
                                                            transformStyle: 'preserve-3d',
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '200px',
                                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                            transform: flipped[index] 
                                                            ? 'rotateY(180deg)'
                                                            : 'rotateY(0deg)',
                                                        },
                                                        '& > div > div': {
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: '100%',
                                                            backfaceVisibility: 'hidden',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: 2,
                                                            boxSizing: 'border-box',
                                                        },
                                                        '& > div > div:nth-of-type(2)': {
                                                            transform: 'rotateY(180deg)',
                                                        },
                                                    }}
                                                >
                                                    <div>
                                                        <div>
                                                            <Typography variant='h5' component='div'>
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant='h5' component='div'>
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', mb:10 }}>
                            <Button variant='contained' color='secondary' onClick={handleOpen}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                )
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='Collection Name'
                        type='text'
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant='outlined'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveFlashcards}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Subscription dialog */}
            <Dialog open={subscriptionDialogOpen} onClose={handleSubscriptionClose}>
                <DialogTitle>Subscription Required</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have already generated flashcards. Please subscribe to generate more.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubscriptionClose}>
                        Close
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}