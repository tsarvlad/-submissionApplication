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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user?._id}/track`,
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
        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track/addlast`,
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
        const request = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track/deletelast`,
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

    function generateDatesBetween(lastDateStr: string, nowTimeStr: string): string[] {
        const lastDate = new Date(lastDateStr);
        const nowTime = new Date(nowTimeStr);

        if (isNaN(lastDate.getTime()) || isNaN(nowTime.getTime())) {
            throw new Error("Invalid date format");
        }

        if (lastDate >= nowTime) {
            throw new Error("lastDate must be earlier than nowTime");
        }

        const result: string[] = [];

        const weights: { days: number; weight: number }[] = [
            { days: 2, weight: 55 },
            { days: 3, weight: 20 },
            { days: 1, weight: 15 },
            { days: 4, weight: 10 },
        ];

        // Create weighted pool
        const weightedChoices: number[] = [];
        weights.forEach(({ days, weight }) => {
            for (let i = 0; i < weight; i++) {
                weightedChoices.push(days);
            }
        });

        let currentDate = new Date(lastDate.getTime());
        currentDate.setDate(currentDate.getDate() + 2); // Ensure minimum 2-day offset

        while (currentDate < nowTime) {
            const remainingDays = (nowTime.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
            if (remainingDays < 2) break;

            const dateWithTime = new Date(currentDate.getTime());

            // Random hour between 11 and 19
            const hour = Math.floor(Math.random() * 9) + 11;
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);

            dateWithTime.setHours(hour, minute, second, 0);
            result.push(dateWithTime.toISOString());

            // Choose next spacing
            const diffDays = weightedChoices[Math.floor(Math.random() * weightedChoices.length)];
            currentDate.setDate(currentDate.getDate() + diffDays);
        }

        return result;
    }

    const handleForceRandomSubmissions = async (): Promise<void> => {
        if (!user?._id || !token) {
            console.error("Missing user or token");
            return;
        }

        try {
            const trackResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!trackResponse.ok) {
                const error = await trackResponse.json();
                toast.error(error.message || "Failed to fetch track data.");
                return;
            }

            const { lastDate, nowTime }: { lastDate: string; nowTime: string } = await trackResponse.json();

            const generatedDates = generateDatesBetween(lastDate, nowTime);

            let successCount = 0;
            for (const submissionDate of generatedDates) {
                const addResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track/addlast`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ date: submissionDate, condition: condition }),
                });

                if (addResponse.ok) {
                    successCount++;
                } else {
                    const error = await addResponse.json();
                    console.error("Failed to submit date:", error.message);
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} submissions added successfully.`);
                setSubmissionDate(new Date());
                setCondition(false);
            } else {
                toast.error("No submissions were added.");
            }

        } catch (err: any) {
            console.error(err);
            toast.error("Unexpected error occurred.");
        }
    };

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
                            image={`${process.env.REACT_APP_BACKEND_URL}/assets/${user?.picturePath}`}
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
                                </Stack>
                                <Stack spacing={2} sx={{
                                    padding: '2rem',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant='h5' gutterBottom>Fill randomly submission retroactively to this day</Typography>
                                    <Button variant='contained' size='large' color='info'
                                            onClick={handleForceRandomSubmissions}>Force</Button>
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
