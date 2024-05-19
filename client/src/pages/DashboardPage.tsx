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
import { Bar, Line } from 'react-chartjs-2';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import TimelineIcon from '@mui/icons-material/Timeline';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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


    const [blockSize, setBlockSize] = useState<string>('5');
    const [blockChainDates, setBlockChainDates] = useState([]);
    const [blockChainDays,setBlockChainDays] = useState([])
    const [blockChainColors, setBlockChainColors] = useState([])

    const handleBlockSizeChangeInput = (event: any) => {
        setBlockSize(event.target.value as string);
    };
    

    const [alignment, setAlignment] = React.useState<string | null>('lineChart');

    
    const blockChainOptions: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Visualization cover: ${totalDays} days`,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        // Get the original value
                        const value = context.raw;
                        // Divide the value by 2
                        const modifiedValue = value / parseInt(blockSize);
                        // Return the modified value
                        return `${modifiedValue} avg`;
                    }
                }
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


    const blockChainData: any = {
        //ts-ignore
        labels: blockChainDates,
        datasets: [
            {
                label: '',
                data: blockChainDays,
                backgroundColor: blockChainColors
            },
        ],
    }

    const handleAlignment = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: 'blockChainChart' | 'lineChart' | null,
    ) => {
      setAlignment(newAlignment);
    };

    const reloadPage = (): void => {
        window.location.reload()
    }
    useEffect(() => {
        const fetchFunction = async () => {
            const request = await fetch(`
            ${process.env.REACT_APP_BACKEND_URL}/user/${user._id}/track/dashboard/info?blockSize=${blockSize}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            )
            const response = await request.json()
            const { formattedDates, formattedDays, userData, blockchain } = response
            setDates(formattedDates)
            setDays(formattedDays)
            setUserData(userData);
            setBlockChainDates(blockchain?.blockchainDates)
            setBlockChainDays(blockchain?.blockchainDays)
            setBlockChainColors(blockchain?.blockchainColors)

            var myFilterArray = formattedDays.filter(Boolean);
            setTotalDays(formattedDays.reduce((a: number, b: number) => a + b))
        }
        fetchFunction()
    }, [blockSize])

    const [age, setAge] = useState<number>(userData.length || 0)

    const handleChange = (event: any) => {
        setAge(event.target.value);
      };
    return (
        <Container sx={{ width: isMobileScreen ? '95%' : '80%' }}>
            <Paper sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                mt: isMobileScreen ? 2 : 6, padding: '1rem',
                height: isMobileScreen ? '700px' : undefined,
            }}>
                <Container sx={{display:'flex', flexDirection:"row", width:"full",
                    justifyContent: "space-between"
                }}>
                <div style={{width:"100px"}}>
                {alignment === 'blockChainChart' && 
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Block Size</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={blockSize}
                        label="Block Size"
                        onChange={handleBlockSizeChangeInput}
                      >
                        <MenuItem value={4}>4</MenuItem>                        
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={32}>32</MenuItem>

                      </Select>
                    </FormControl>
                }
                </div>
                <Typography variant='h6' sx={{paddingTop: '0.5rem'}}>All-time Chart</Typography>
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    sx={{width:"100px"}}
                    >
                    <ToggleButton value="lineChart" aria-label="left aligned">
                        <TimelineIcon />
                    </ToggleButton>
                    <ToggleButton value="blockChainChart" aria-label="centered">
                        <ViewColumnIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                </Container>

                {alignment === 'lineChart' && < Line options={options} data={data}
                    height={isMobileScreen ? '600vh' : undefined}
                    width={isMobileScreen ? '400vh' : undefined} />}
                {alignment === 'blockChainChart' && 
                    <Bar options={blockChainOptions} data={blockChainData}
                    height={isMobileScreen ? '600vh' : undefined}
                    width={isMobileScreen ? '400vh' : undefined}
                    />
                }    
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
                        //to keep unique id, because my datastructure doesn't have one so I have created this wierd thing
                        //I believe collission is impossible
                        getRowId={(row) => row.date + Math.random() + Math.random() + Math.random() + Math.random()}
                        rows={userData}
                        columns={
                            isMobileScreen ? mobileColumns : columns
                        }
                        sortModel={sortModel}
                        onSortModelChange={(model) => setSortModel(model)}
                        isRowSelectable={() => false}

                    />
            </div>
        </Container >
    )
}

export default DashboardPage
