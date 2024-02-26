import { Container, Button, Paper, useMediaQuery, Typography, Box } from '@mui/material'

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'
import { Line } from 'react-chartjs-2';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend,
    zoomPlugin
);


const DashboardPage = () => {
    const user = useSelector((state: any) => state.user)
    const token = useSelector((state: any) => state.token)
    const navigate = useNavigate()
    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')

    const [reload, setReload] = useState<Array<number>>([1])
    const [dates, setDates] = useState<Array<Date> | null>(null)
    const [days, setDays] = useState<Array<number>>([0])
    const [totalDays, setTotalDays] = useState<number>(0)

    const labels = dates

    const data: any = {
        labels,
        datasets: [
            {
                fill: true,
                label: '',
                data: days,
                pointStyle: 'circle',
                pointRadius: 7,
                spanGaps: true,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Visualization cover: ${totalDays} days`,
            },
            zoom: {
                pan: {
                    // pan options and/or events
                },
                limits: {
                    // axis limits
                },
                zoom: {
                    // zoom options and/or events
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
            // responsive: true
        },

    };


    const reloadPage = (): void => {
        window.location.reload()
    }
    useEffect(() => {
        const fetchFunction = async () => {
            const request = await fetch(`
            https://submission-app-server.onrender.com/user/${user._id}/track/dashboard/info
            `, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            )
            const response = await request.json()
            console.log(response)
            const { formattedDates, formattedDays } = response
            setDates(formattedDates)
            setDays(formattedDays)
            var myFilterArray = formattedDays.filter(Boolean);
            setTotalDays(formattedDays.reduce((a: number, b: number) => a + b))
        }
        fetchFunction()
    }, [])

    return (
        <Container sx={{ width: isMobileScreen ? '95%' : '80%' }}>
            <Paper sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                mt: isMobileScreen ? 2 : 6, padding: '1rem',
                height: isMobileScreen ? '600px' : undefined,
            }}>
                <Typography variant='h6'>All-time Chart</Typography>

                < Line options={options} data={data}
                    height={isMobileScreen ? '600vh' : undefined}
                    width={isMobileScreen ? '400vh' : undefined} />
                <Button variant='contained' size='large' sx={{ width: '150px' }}
                    onClick={reloadPage}>Reload</Button>
            </Paper>
        </Container >
    )
}

export default DashboardPage
