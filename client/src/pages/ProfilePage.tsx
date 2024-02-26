import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box, Stack, FormControlLabel, Checkbox, Divider } from '@mui/material'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DatePicker } from '@mui/x-date-pickers';
import { Container, Paper, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';


const ProfilePage = () => {
    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')
    const user = useSelector((state: any) => state.user)
    const token = useSelector((state: any) => state.token)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [since, setSince] = useState<Date>(new Date())
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://submission-app-server.onrender.com/user/${user?._id}/track`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            const responseJson = await response.json()
            const { data } = responseJson
            setSince(data[0].date)
        }
        fetchData()
            .catch(console.error)
    }, [])


    const [submissionDate, setSubmissionDate] = useState<Date>(new Date())
    const [condition, setCondition] = useState<Boolean>(false)

    const handleAddSubmission = async () => {
        const request = await fetch(`https://submission-app-server.onrender.com/user/${user._id}/track/addlast`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date: submissionDate, condition: condition })
            })
        const response = await request.json()
        if (!request.ok) {
            toast.error(response.message)
        } else {
            toast.success(response.message)
            setSubmissionDate(new Date())
            setCondition(false)
        }

    }
    const handleDeleteLastSubmission = async () => {
        const request = await fetch(`https://submission-app-server.onrender.com/user/${user._id}/track/deletelast`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
        const response = await request.json()
        if (!request.ok) {
            toast.error(response.message)
        } else {
            toast.success(response.message)
        }
    }

    return (
        <>
            <Container>
                <Box sx={{
                    display: 'flex', alignItems: 'center', flexDirection: 'column',
                    mt: isMobileScreen ? 2 : 6,
                }} >
                    <Card sx={{
                        width: isMobileScreen ? '90%' : '70%',
                        mb: isMobileScreen ? 3 : undefined,
                    }}>
                        <CardMedia
                            sx={{ height: 240 }}
                            image={`https://submission-app-server.onrender.com/assets/${user?.picturePath}`}
                            title="green iguana"
                        />
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Registered: {new Date(`${user?.createdAt}`).toLocaleDateString('en-US')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Since: {new Date(since).toLocaleDateString('en-US')}
                            </Typography>
                            <Divider />
                            <Paper elevation={4}>
                                <Stack spacing={2} sx={{
                                    padding: '2rem',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant='h5' gutterBottom>Append submission retroactively</Typography>
                                    <DatePicker label='Date picker'
                                        value={submissionDate}
                                        renderInput={(params: any) => <TextField {...params} />}
                                        onChange={((newValue: any) => setSubmissionDate(newValue))}

                                    />
                                    <Button variant='contained'
                                        onClick={handleAddSubmission}>Submit</Button>
                                    <FormControlLabel label="I appreciated terms and conditions" control={
                                        <Checkbox value={condition} onChange={() => setCondition(!condition)}
                                        />} />
                                    <Typography variant='h5' gutterBottom>Delete last submission</Typography>
                                    <Button variant='contained' size='large' color='error'
                                        onClick={handleDeleteLastSubmission}>Delete</Button>
                                </Stack></Paper>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', alignItems: 'end', flexDirection: 'column', marginRight: '1rem' }}>
                            <Button size="small" onClick={() => {
                                dispatch(setLogout())
                                navigate('/login')
                            }}>Logout</Button>
                        </CardActions>
                    </Card>
                </Box >
            </Container >
            <ToastContainer />
        </>
    );

}

export default ProfilePage
