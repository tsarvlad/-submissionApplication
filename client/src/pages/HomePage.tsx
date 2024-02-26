import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    useMediaQuery, Container, Paper, Box, Stack,
    Typography, Button, ToggleButtonGroup, ToggleButton, FormControlLabel, Switch, Checkbox
} from '@mui/material'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

import ReactSpeedometer from 'react-d3-speedometer';
import { useSelector } from 'react-redux';

type colorsPack = '#50a322' | '#86af1e' | '#b9ab1b' | '#f6961e' | '#cc3814'

const HomePage = () => {
    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')
    const user = useSelector((state: any) => state.user)
    const token = useSelector((state: any) => state.token)
    const defineColor = (int: number): colorsPack => {
        const RANGE28_50 = Array.from(Array(22 + 1).keys()).map(x => x + 28)
        const RANGE21_27 = Array.from(Array(7).keys()).map(x => x + 21)
        const RANGE14_20 = Array.from(Array(7).keys()).map(x => x + 14)
        const RANGE7_13 = Array.from(Array(7).keys()).map(x => x + 7)
        const RANGE0_6 = Array.from(Array(7).keys())
        switch (true) {
            case RANGE28_50.includes(int):
                return '#50a322'
            case RANGE21_27.includes(int):
                return '#86af1e'
            case RANGE14_20.includes(int):
                return '#b9ab1b'
            case RANGE7_13.includes(int):
                return '#f6961e'
            case RANGE0_6.includes(int):
                return '#cc3814'
            default:
                return '#86af1e'
        }
    }

    const [value, setValue] = useState<number>(0)
    const [dummyUseEffectVariable, setDummyUseEffectVariable] = useState<Array<number>>([])
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
            const { differenceD } = responseJson
            setValue(differenceD)
        }
        fetchData()
            .catch(console.error)
    }, [dummyUseEffectVariable])

    const [condition, setCondition] = useState<boolean>(false)
    const handleSubmit = async () => {
        const submitRequest = await fetch(
            `https://submission-app-server.onrender.com/user/${user?._id}/track/submit`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "condition": condition })
            }
        )
        const submitResponse = await submitRequest.json()
        if (!submitRequest.ok) {
            toast.error('Request failed, try again!')
        } else {
            toast.success(submitResponse.message)
            setDummyUseEffectVariable([...dummyUseEffectVariable, 1])
        }
    }

    return (<>
        <Container sx={{
            width: isMobileScreen ? '90%' : '45%'
        }}
        >
            <Paper sx={{
                padding: '2rem',
                mt: isMobileScreen ? 6 : 2
            }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h5' gutterBottom>Your current track</Typography>
                    <ReactSpeedometer
                        maxValue={50}
                        value={value}
                        currentValueText={'Days: ' + value}
                        // customSegmentStops={[0, 7, 11, 18, 25, 50]}
                        customSegmentStops={[0, 7, 14, 21, 28, 50]}
                        segmentColors={['#ff471a',
                            '#f6961e',
                            '#ecdb23',
                            '#aee228',
                            '#6ad72d'
                        ]}
                        height={200}
                    />
                    <Stack direction='column' spacing={2}>
                        <Button variant='contained' size='large'
                            sx={{ '&:hover': { backgroundColor: defineColor(value) } }}
                            onClick={handleSubmit}>
                            SUBMIT
                        </Button>
                        <FormControlLabel label='I appreciate terms and conditions' control={
                            <Switch checked={condition} onChange={() => setCondition(!condition)} />
                        } />
                    </Stack>

                </Box>
            </Paper>
        </Container>
        <ToastContainer />
    </>
    )
}

export default HomePage
