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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material'

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
    const [userData, setUserData] = useState<Array<object>>([{date:'rst'}]);

console.log(userData)

    const [sortModel, setSortModel] = React.useState<any>([{ field: 'date', sort: 'desc' }])


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

    function formatDate(dateString: "string") {
        // Create a Date object from the string
        const date = new Date(dateString);
      
        // Format the date using desired format specifiers
        const formattedDate = date.toLocaleString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true // Use 12-hour format (optional)
        });
      
        return formattedDate;
      }

    const columns: GridColDef[] = [

        {
            field: 'date',
            headerName: 'Date',
            type: "string",
            align: 'center',
            width:700,

            headerAlign: 'center',
            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{formatDate(params.row.date)}</div >
                    </>
                )
            }
        },
        {
            field: 'days',
            headerName: 'days', 
            type:"number",
            align: 'center',
            headerAlign: 'center',
            width:150,

            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{+params.row.days}</div >
                    </>
                )
            }
        },
        {
            field: 'condition',
            headerName: 'conditions',
            type: "string",
            align: 'center',
            headerAlign: 'center',
            width:150,
            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{params.row.condition ? "true" : 'false'}</div >
                    </>
                )
            }
        },
    ];

    const mobileColumns: GridColDef[] = [

        {
            field: 'date',
            headerName: 'Date',
            type: "string",
            align: 'center',
            width:220,

            headerAlign: 'center',
            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{formatDate(params.row.date)}</div >
                    </>
                )
            }
        },
        {
            field: 'days',
            headerName: 'days', 
            type:"number",
            align: 'center',
            headerAlign: 'center',
            width:70,

            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{+params.row.days}</div >
                    </>
                )
            }
        },
        {
            field: 'condition',
            headerName: 'conditions',
            type: "string",
            align: 'center',
            headerAlign: 'center',
            width:50,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: (params: any) => {
                return (
                    <>
                        <div className='text-sm'>{params.row.condition ? "true" : 'false'}</div >
                    </>
                )
            }
        },
    ];


    const reloadPage = (): void => {
        window.location.reload()
    }
    useEffect(() => {
        const fetchFunction = async () => {
            const request = await fetch(`
            ${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track/dashboard/info
            `, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            )
            const response = await request.json()
            console.log('response', response)
            const { formattedDates, formattedDays, userData } = response
            setDates(formattedDates)
            setDays(formattedDays)
            setUserData(userData);
            var myFilterArray = formattedDays.filter(Boolean);
            setTotalDays(formattedDays.reduce((a: number, b: number) => a + b))
        }
        fetchFunction()
    }, [])

    const [age, setAge] = useState<number>(userData.length || 0)
    const handleChange = (event: any) => {
        console.log(age)
        setAge(event.target.value);
      };
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
                    
                {/* <Button variant='contained' size='large' sx={{ width: '150px', height: "42px" }}>

                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={handleChange}
                    >
                        <MenuItem value={userData.length || 0} defaultChecked>All</MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        <MenuItem value={100}>One Hundred</MenuItem>
                    </Select>
                    </FormControl></Button> */}
                
            </Paper>
  
                <div className="mt-5" style={{ marginTop: "32px", height: 631, width: "100%" }}>

                 <DataGrid
                        //to keep unique id, because my datastructure doesn't have one so I have created this vierd thing
                        //I believe collission is impossible
                        getRowId={(row) => row.date + Math.random() + Math.random() + Math.random() + Math.random()}
                        rows={userData}
                        columns={
                            isMobileScreen ? mobileColumns : columns
                        }
                        autoPageSize={true}
                        sortModel={sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                        isRowSelectable={() => false}

                    />
            </div>
        </Container >
    )
}

export default DashboardPage
