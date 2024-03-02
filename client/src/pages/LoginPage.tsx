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

import { useDispatch } from 'react-redux';

import { setLogin } from '../state';

const loginSchema = yup.object().shape({
    email: yup.string().email().required('required'),
    password: yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short.'),
})

type formSchema = {
    email: string,
    password: string,
}




const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const login = async (data: any) => {
        const loggedInUser = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        )
        const isLoggedIn = await loggedInUser.json()
        if (!loggedInUser.ok) {
            toast.error(isLoggedIn.msg)
            return
        }
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
    const resolver = useYupValidationResolver(loginSchema)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<formSchema>({ resolver });
    const onSubmit: SubmitHandler<formSchema> = async (data: any) => {
        login(data)
    }

    return (
        <>
            <Container sx={{ width: isMobileScreen ? '100%' : '70%' }}>
                <Paper elevation={2} sx={{
                    display: 'flex', alignItems: 'center', flexDirection: 'column',
                    mt: isMobileScreen ? 2 : 6, padding: '2rem'
                }}>
                    <Typography variant='h5' sx={{ m: 1 }}>Sign In</Typography>
                    <Box component='form' onSubmit={handleSubmit(onSubmit)}
                        sx={{ mt: 1, width: isMobileScreen ? '75%' : '50%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    label='Email'
                                    {...register('email', { required: true })}
                                    error={isTouched && Boolean(errors.email)}
                                    helperText={isTouched && errors.email?.message}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label='Password'
                                    {...register('password')}
                                    type='password'
                                    error={isTouched && Boolean(errors.password)}
                                    helperText={isTouched && errors.password?.message}
                                    fullWidth
                                    autoFocus />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    fullWidth
                                    size='large'
                                    onClick={() => setIsTouched(true)}
                                >Sign In</Button>
                            </Grid>
                            <Grid container display='grid' >
                                <Grid item display='flex' alignItems='center' justifyContent='center'>
                                    <Link href="/register" variant="body2" sx={{ mt: 2, mb: -1 }}>
                                        {"Do not have an account? Sign Up"}
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

export default LoginPage
