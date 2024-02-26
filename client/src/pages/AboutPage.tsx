import { Chart as ChartJS, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useSelector } from 'react-redux'
import { useMediaQuery, Container, Paper, Stack, Box, Typography, Divider } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type categoryClass = {
    week: number
    twoWeeks: number
    threeWeeks: number
    fourWeeks: number
    more: number
}

const defaultCategoryClass: categoryClass = {
    week: 0,
    twoWeeks: 0,
    threeWeeks: 0,
    fourWeeks: 0,
    more: 0
}

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, BarElement);

const AboutPage = () => {
    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')
    const user = useSelector((state: any) => state.user)
    const token = useSelector((state: any) => state.token)

    const [trueTimes, setTrueTimes] = useState<number>(0)
    const [falseTimes, setFalseTimes] = useState<number>(0)
    const [trueDays, setTrueDays] = useState<number>(0)
    const [falseDays, setFalseDays] = useState<number>(0)
    const [categoryClassTimes, setCategoryClassTimes] = useState<categoryClass>(defaultCategoryClass)
    const [categoryClassDays, setCategoryClassDays] = useState<categoryClass>(defaultCategoryClass)

    useEffect(() => {
        const fetchRequest = async () => {
            const request = await fetch(`
            https://submission-app-server.onrender.com/user/${user._id}/about/info
            `, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            const response = await request.json()
            if (!request.ok) {
                toast.error("Failed to fetch data! Please, try again.")
            } else {
                const { trueTimes, falseTimes,
                    trueDays, falseDays,
                    categoryClassDays, categoryClassTimes
                } = response
                setTrueTimes(trueTimes)
                setFalseTimes(falseTimes)
                setTrueDays(trueDays)
                setFalseDays(falseDays)
                setCategoryClassTimes(categoryClassTimes)
                setCategoryClassDays(categoryClassDays)
            }
        }
        fetchRequest()
    }, [])

    const optionsTFT: any = {
        plugins: {
            title: {
                display: true,
                text: `True/False Times`
            },
            datalabels: {
                formatter: (value: any, context: any) => {
                    return `${(value / (trueTimes + falseTimes) * 100).toFixed(2)}%`
                }
            }
        }
    }

    const dataTFT = {
        labels: [
            'False',
            'True',
        ],
        datasets: [{
            label: 'Times',
            data: [falseTimes, trueTimes],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 4
        }]
    };


    const optionsTFD: any = {
        plugins: {
            title: {
                display: true,
                text: `True/False Days`,
            },
            datalabels: {
                formatter: (value: any, context: any) => {
                    return `${(value / (trueDays + falseDays) * 100).toFixed(2)}%`
                }
            }
        }
    }

    const dataTFD = {
        labels: [
            'False',
            'True',
        ],
        datasets: [{
            label: 'Days',
            data: [falseDays, trueDays],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 4
        }]
    };

    const barChartLabels = ['1 Week', '2 Weeks', '3 Weeks', '4 Weeks', 'Month+']
    const barChartColors = ['rgb(255, 99, 132)', '#FFB26B', 'rgb(54, 162, 235)', '#B6E2A1', '#A6BB8D']

    const barOptionsTFT: any = {
        plugins: {
            title: {
                display: true,
                text: `Categories Times`
            },
            datalabels: {
                formatter: (value: any, context: any) => {
                    return `${(value / (trueTimes + falseTimes) * 100).toFixed(2)}%`
                }
            }
        }
    }

    const barDataTFT: number[] = []
    for (let [key, value] of Object.entries(categoryClassTimes)) {
        barDataTFT.push(value)
    }
    const barDatumTFT: any = {
        labels: barChartLabels,
        datasets: [
            {
                label: 'Times',
                data: barDataTFT,
                backgroundColor: barChartColors,
            },
        ],
    };

    const barOptionsTFD: any = {
        plugins: {
            title: {
                display: true,
                text: `Categories Days`
            },
            datalabels: {
                formatter: (value: any, context: any) => {
                    return `${(value / (trueDays + falseDays) * 100).toFixed(2)}%`
                }
            }
        }
    }


    const barDataTFD: number[] = []
    for (let [key, value] of Object.entries(categoryClassDays)) {
        barDataTFD.push(value)
    }
    const barDatumTFD: any = {
        labels: barChartLabels,
        datasets: [
            {
                label: 'Days',
                data: barDataTFD,
                backgroundColor: barChartColors
            },
        ],
    };




    return (<>
        <Container >
            <Paper sx={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '2rem',
                mt: isMobileScreen ? 2 : 6,
                mb: isMobileScreen ? 3 : undefined,
            }}>
                <Typography variant={isMobileScreen ? 'h6' : 'h5'} gutterBottom>Overall True/False Days & Times</Typography>
                <Stack direction={isMobileScreen ? 'column' : 'row'}
                    sx={{ mb: isMobileScreen ? undefined : '2rem' }}>
                    <Box>
                        <Pie data={dataTFT} options={optionsTFT} />
                    </Box>
                    <Box>
                        <Pie data={dataTFD} options={optionsTFD} />
                    </Box>
                </Stack>
                <Typography variant={isMobileScreen ? 'h6' : 'h5'} gutterBottom>Categories Visualization</Typography>
                <Box >
                    <Bar data={barDatumTFT} options={barOptionsTFT}
                        height='300vh'
                        width={isMobileScreen ? '300vh' : '500vh'} />
                </Box>
                <Box >
                    <Bar data={barDatumTFD} options={barOptionsTFD}
                        height='300vh'
                        width={isMobileScreen ? '300vh' : '500vh'} />
                </Box>
            </Paper>
        </Container>
        <ToastContainer />
    </>
    )
}

export default AboutPage
