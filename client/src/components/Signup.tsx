import React, {FunctionComponent, useState} from 'react';
import {Box, Button, Container, Grid, Link, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface OwnProps {
}

type Data = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}

type Props = OwnProps;

const Signup: FunctionComponent<Props> = (props) => {

    const [errors, setErrors] = useState<{ [key: string]: null | string }>({});

    const nav = useNavigate();

    const verify = (data: Data) => {
        let errorsFound: { [key: string]: null | string } = {};
        if (data["name"] === "") {
            errorsFound = {
                ...errorsFound,
                "userName": "Name cannot be empty"
            }
        }

        if (data["email"] === "") {
            errorsFound = {
                ...errorsFound,
                "email": "Email cannot be empty"
            }
        }

        if (data["password"].length < 6) {
            errorsFound = {
                ...errorsFound,
                "email": "Minimum of 6 characters"
            }
        }

        if (data["password"] !== data["confirmPassword"]) {
            errorsFound = {
                ...errorsFound,
                "confirmPassword": "Passwords do not match"
            }
        }

        if (Object.keys(errorsFound).length === 0) {
            return true;
        } else {
            setErrors(errorsFound);
            return false;
        }
    };

    const handleSignup = async (e: any) => {
        e.preventDefault();
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        let signupData: Data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        if (verify(signupData)) {
            return await fetch('/api/user/signup', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            }).then(res => res.json()).then(() => {
                nav("/login");
            }).catch(console.log);
        }
    }

    return (
        <Container component={'main'} maxWidth={'xs'}>
            <Box component={'form'} onSubmit={handleSignup}
                 sx={{marginTop: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component={'h1'} variant={'h4'}>Sign Up</Typography>
                <TextField name={'name'} margin={'normal'} required fullWidth id={'name'}
                           error={Boolean(errors.name)}
                           label={'Name'} variant={'outlined'} autoFocus type={'text'}
                           helperText={errors.name}/>
                <TextField name={'email'} margin={'normal'} required fullWidth id={'email'}
                           error={Boolean(errors.userName)}
                           label={'Email Address'} variant={'outlined'} type={'email'}
                           helperText={errors.userName}/>
                <TextField name={'password'} margin={'normal'} required fullWidth id={'password'}
                           error={Boolean(errors.password)}
                           label={'Password'} variant={'outlined'} type={'password'} helperText={errors.password}/>
                <TextField name={'confirmPassword'} margin={'normal'} required fullWidth id={'confirmPassword'}
                           error={Boolean(errors.confirmPassword)}
                           label={'Confirm Password'} variant={'outlined'} type={'password'}
                           helperText={errors.password}/>
                <Button type={'submit'} fullWidth variant={'contained'} sx={{mt: 3, mb: 2}}>Sign Up</Button>
            </Box>

            <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
                <Grid item>
                    <Link href={'/login'} variant={'body2'}>Already have an account? Log In</Link>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Signup;