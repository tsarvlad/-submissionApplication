import {
    Grid, TextField, FormControlLabel, FormControl, Button, Paper, Box, Typography,
    FormLabel, RadioGroup, Radio, Select, MenuItem, useMediaQuery, Toolbar
} from '@mui/material'
import * as yup from 'yup'

const registerSchema = yup.object().shape({
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    email: yup.string().email().required('required'),
    password: yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    image: yup.string().required('required')
})

const loginSchema = yup.object().shape({
    email: yup.string().email().required('required'),
    password: yup.string().required('required')
})

const Form = () => {
    return (
        <div>

        </div>
    )
}

export default Form
