import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Grid, TextField, FormControlLabel, FormControl, Button, Paper, Box, Typography,
    Container, Checkbox, IconButton,
    FormLabel, RadioGroup, Radio, Select, MenuItem, useMediaQuery, Toolbar, Avatar, Link
} from '@mui/material'

import { Copyright, InsightsOutlined, DeleteOutlined } from '@mui/icons-material';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'

import Form from '../scenes/Form'
import Dropzone, { useDropzone } from 'react-dropzone'
import { match } from 'assert';
import { useDispatch } from 'react-redux';

import { setLogin } from '../state';


const registerSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().email('Not valid email').required('Required'),
    password: yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short.'),
    confirmPassword: yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short.'),
})

// const loginSchema = yup.object().shape({
//     email: yup.string().email().required('required'),
//     password: yup.string().required('required')
// })

type formSchema = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}




const RegisterPage = () => {
    // DropZone
    const [picture, setPicture] = useState<any>()
    const onDrop = useCallback((acceptedFiles: any) => {
        setPicture(acceptedFiles)
    }, [])
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const login = async (data: any) => {
        const loggedInUser = await fetch(
            'https://submission-app-server.onrender.com/auth/login',
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        )
        const isLoggedIn = await loggedInUser.json()
        if (isLoggedIn) {
            dispatch(
                setLogin({
                    user: isLoggedIn.user,
                    token: isLoggedIn.token
                })
            );
            toast.success('Successfully logged in!')
            navigate('/home')

        } else {
            toast.error(isLoggedIn?.msg)
        }
    }

    const registerAndLogin = async (data: any) => {
        const formData: FormData = new FormData()
        for (let input in data) {
            formData.append(input, data[input])
        }
        // Image append
        if (!picture) {
            toast.error("Please, select image")
            return
        }

        formData.append('picture', picture[0])
        formData.append('picturePath', picture[0].name)

        const savedUserResponse = await fetch(
            "https://submission-app-server.onrender.com/auth/register",
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        if (savedUserResponse.statusText === 'Bad Request') {
            toast.error(savedUser.msg)
        } else {
            login(data)
        }
    }

    const isMobileScreen: Boolean = !useMediaQuery('(min-width: 1000px)')
    const [isTouched, setIsTouched] = useState<boolean>(false)
    //This is not my code, it's taken from docs
    const useYupValidationResolver = (validationSchema: any) =>
        useCallback(
            async (data: any) => {
                try {
                    const values = await validationSchema.validate(data, {
                        abortEarly: false
                    });

                    return {
                        values,
                        errors: {}
                    };
                } catch (errors: any) {

                    return {
                        values: {},
                        errors: errors.inner.reduce(
                            (allErrors: any, currentError: any) => ({
                                ...allErrors,
                                [currentError.path]: {
                                    type: currentError.type ?? "validation",
                                    message: currentError.message
                                }
                            }),
                            {}
                        )
                    };
                }
            },
            [validationSchema]
        );
    const resolver = useYupValidationResolver(registerSchema)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<formSchema>({ resolver });
    const onSubmit: SubmitHandler<formSchema> = async (data: any) => {
        registerAndLogin(data)
    }

    return (
        <>
            <Container sx={{ width: isMobileScreen ? '100%' : '70%' }}>
                <Paper elevation={2} sx={{
                    display: 'flex', alignItems: 'center', flexDirection: 'column',
                    mt: isMobileScreen ? 2 : 6, padding: '2rem'
                }}>
                    <Typography variant='h5' sx={{ m: 1 }}>Sign up</Typography>
                    <Box component='form' onSubmit={handleSubmit(onSubmit)}
                        sx={{ mt: 1, width: isMobileScreen ? '75%' : '50%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='First name'
                                    fullWidth
                                    autoFocus
                                    {...register('firstName')}
                                    error={isTouched && Boolean(errors.firstName)}
                                    helperText={isTouched && errors.firstName?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Last name'
                                    {...register('lastName')}
                                    error={isTouched && Boolean(errors.lastName)}
                                    helperText={isTouched && errors.lastName?.message}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    label='Email'
                                    {...register('email', { required: true })}
                                    error={isTouched && Boolean(errors.email)}
                                    helperText={isTouched && errors.email?.message}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Password'
                                    {...register('password')}
                                    type='password'
                                    error={isTouched && Boolean(errors.password)}
                                    helperText={isTouched && errors.password?.message}
                                    fullWidth
                                    autoFocus />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label='Confirm Password'
                                    {...register('confirmPassword')}
                                    type='password'
                                    error={isTouched && Boolean(errors.confirmPassword)}
                                    helperText={isTouched && errors.confirmPassword?.message}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Box component='section' sx={{
                                    flex: 1,
                                    height: picture ? undefined : '3.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    padding: '20px',
                                    borderWidth: '2px',
                                    borderRadius: '2px',
                                    borderStyle: 'dashed',
                                    backgroundColor: '#fafafa',
                                    color: '#bdbdbd',
                                    outline: 'none',
                                    transition: 'border .24s ease-in-out',
                                }}>
                                    <Typography>Avatar</Typography>
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()}
                                            name='picture' />
                                        {picture ? (<Typography variant='body1'>Accepted:</Typography>)
                                            : (isDragActive ? (
                                                <Typography variant='body1'>
                                                    Drop it here!
                                                </Typography>
                                            ) : (
                                                <Typography variant='body1'>Drag 'n click, or click to select image</Typography>
                                            ))}
                                    </div>
                                    <aside>
                                        {picture ? (
                                            <>
                                                <IconButton
                                                    onClick={() => setPicture(null)}
                                                // sx={{ width: "15%" }}
                                                >
                                                    <Typography variant='body2'>{picture[0].name}</Typography> <DeleteOutlined />
                                                </IconButton>
                                            </>
                                        ) : (undefined)}
                                    </aside>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    fullWidth
                                    size='large'
                                    onClick={() => setIsTouched(true)}
                                >Register</Button>
                            </Grid>
                            <Grid container display='grid' >
                                <Grid item display='flex' alignItems='center' justifyContent='center'>
                                    <Link href="/login" variant="body2" sx={{ mt: 2, mb: -1 }}>
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
            <ToastContainer />
        </>
    )
}

export default RegisterPage
