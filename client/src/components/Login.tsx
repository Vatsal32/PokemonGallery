import React, {FunctionComponent, useState} from 'react';
import {Box, Button, Container, Grid, Link, TextField, Typography} from "@mui/material";
import {useAppDispatch} from "../store/hooks";
import {useNavigate} from "react-router-dom";
import {login} from "../store/UserReducer";

interface OwnProps {
}

type Props = OwnProps;

const Login: FunctionComponent<Props> = () => {

    const [errors, setErrors] = useState<{[key: string]: null | string}>({});

    const nav = useNavigate();

    const dispatch = useAppDispatch();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        let loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        await fetch('/api/user/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        }).then(res => {
            if (res.status === 401) {
                setErrors(error => ({
                    ...error,
                    userName: "Invalid email or password",
                    password: "Invalid email or password"
                }));
            } else {
                setErrors(error => ({
                    ...error,
                    userName: "Invalid email or password",
                    password: "Invalid email or password"
                }));
            }
            return res.json();
        }).then(res => {
            if (res.token_type === 'bearer') {
                dispatch({ type: login.toString(), payload: {email: res.user, token: res.access_token} });
                nav("/");
            }
        }).catch(console.log);
    }

    return (
        <Container component={'main'} maxWidth={'xs'}>
            <Box component={'form'} onSubmit={handleLogin}
                 sx={{marginTop: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component={'h1'} variant={'h5'}>Log In</Typography>
                <TextField name={'email'} margin={'normal'} required fullWidth id={'email'}
                           error={Boolean(errors.userName)}
                           label={'Email Address'} variant={'outlined'} autoFocus type={'email'}
                           helperText={errors.userName}/>
                <TextField name={'password'} margin={'normal'} required fullWidth id={'password'}
                           error={Boolean(errors.password)}
                           label={'Password'} variant={'outlined'} type={'password'} helperText={errors.password}/>
                <Button type={'submit'} fullWidth variant={'contained'} sx={{mt: 3, mb: 2}}>Log In</Button>
            </Box>

            <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
                <Grid item>
                    <Link href={'/signup'} variant={'body2'}>Don't have an account? Sign Up</Link>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Login;