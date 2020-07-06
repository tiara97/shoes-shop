import React from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import {
    Paper,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TextField,
    Button
} from '@material-ui/core'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            checkUser: false,
            checkEmail: false,
            error: [false, false, false, false],
            redirect: false,
            errorCheck: false,
            data: []
        }
    }
    componentDidMount () {
        Axios.get(`http://localhost:2000/users`)
            .then(response => {
                console.log(response.data)
                this.setState({data: response.data})
            })
            .catch(error => console.log(error))
    }
    checkInputUsername = (usernameInput) => {
        let check = false
        this.state.data.filter(item => {
            console.log(item.username)
            console.log(usernameInput)
            if(item.username === usernameInput) {
                return check = true
            }
        })
        return check
    }
    checkInputEmail = (emailInput) => {
        let check = false
        this.state.data.filter(item => {
            console.log(item.email)
            if(item.email === emailInput) {
                return check = true
            }
        })
        return check
    }
    handleClick = () => {
        let username = this.username.value.toLowerCase()
        let email = this.email.value.toLowerCase()
        let password = this.password.value
        let confPassword = this.confPassword.value
        let role = 'user'
        let cart = []
        console.log(username, email, password, confPassword)
        let inputError = this.inputValidation(username, email, password, confPassword)
        let checkUsernameError = this.checkInputUsername(username)
        let checkEmailError = this.checkInputEmail(email)
        console.log(checkUsernameError)
        console.log(checkEmailError)
        if (inputError.includes(true) || checkUsernameError || checkEmailError) {
            // this.username.value = ''
            // this.email.value = ''
            // this.password.value = ''
            // this.confPassword.value = ''
            this.setState({ error: inputError, checkUser: checkUsernameError, checkEmail: checkEmailError })
            console.log('error')
            return
        }
        console.log('masuk')
        Axios.post('http://localhost:2000/users', { username, password, role, email, cart })
        .then(response => {
            console.log(response.data)
            this.username.value = ''
            this.email.value = ''
            this.password.value = ''
            this.confPassword.value = ''
            this.setState({error : [false, false, false, false], checkUser:false, checkEmail:false, redirect: true})
        })
        .catch(error => console.log(error))
    }
    inputValidation = (username, email, password, confPassword) => {
        let usernameError = username ? false : true
        let emailError = email ? false : true
        let passError = password ? false : true
        let confPassError = confPassword ? false : true
        let checkUser = /[^A-Za-z0-9_]/
        let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
        // kalo kosong inputnya
        if (usernameError || emailError || passError || confPassError) {
            console.log(usernameError, emailError, passError, confPassError)
            return [usernameError, emailError, passError, confPassError]
        }
        //kalo bener semua
        if (checkUser.test(username) === false && checkEmail.test(email) === true && checkPass.test(password) === true && password === confPassword) {
            console.log(usernameError, emailError, passError, confPassError)
            return [false, false, false, false]
        }
        // cek satu2 kalo ada yg salah
        if (checkUser.test(username) === true) { usernameError = true }
        if (checkEmail.test(email) === false) { emailError = true }
        if (checkPass.test(password) === false) { passError = true }
        if (password !== confPassword) { confPassError = true }
        console.log(usernameError, emailError, passError, confPassError)
        return [usernameError, emailError, passError, confPassError]
    }
    usernameCheck = (e) => {
        let username = e.target.value
        // console.log(username)
        let check = /[^A-Za-z0-9_]/
        // console.log(check.test(username))
        if (check.test(username) === true) {
            this.setState({ error: [true, false, false, false] })
        } else {
            this.setState({ error: [false, false, false, false] })
        }
    }
    render() {
        const { visible, redirect, error, errorCheck, checkUser, checkEmail } = this.state
        if (redirect) {
            return <Redirect to='/login' />
        }
        return (
            <div style={styles.root}>
                <Paper style={styles.paper} elevation={3}>
                    <h1 style={styles.title}>Register to Shoes Shop</h1>
                    {/* input username */}
                    <TextField
                        id="outlined-basic"
                        error={error[0]}
                        helperText={error[0] ? 'Input must not contain symbol' : ''}
                        // helperText={checkUser ? 'Username already taken' : ''}
                        label="Username"
                        variant="outlined"
                        style={styles.input}
                        inputRef={(username) => this.username = username}
                        onChange={this.usernameCheck}
                    />
                    {/* input email */}
                    <TextField
                        id="outlined-basic"
                        error={error[1]}
                        helperText={error[1] ? 'Email invalid' : ''}
                        label="Email"
                        variant="outlined"
                        style={styles.input}
                        inputRef={(email) => this.email = email}
                        onChange={this.emailCheck}
                    />
                    {/* input password */}
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            error={error[2]}
                            id="outlined-adornment-password"
                            onChange={this.passCheck}
                            type={visible ? "text" : "password"}
                            inputRef={(password) => this.password = password}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={() => this.setState({ visible: !visible })}
                                    >
                                        {visible ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <FormHelperText >{'Password length must be 6-15 char, and must contain lowercase, uppercase, and a number'}</FormHelperText>
                    </FormControl>
                    {/* confirm password */}
                    <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                        <OutlinedInput
                            error={error[3]}
                            id="outlined-adornment-password"
                            type={visible ? "text" : "password"}
                            onChange={this.passConfCheck}
                            inputRef={(confPassword) => this.confPassword = confPassword}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={() => this.setState({ visible: !visible })}
                                    >
                                        {visible ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <FormHelperText style={styles.error}>{error[3] ? 'Those passwords did not match, try again' : ''}</FormHelperText>
                        <FormHelperText style={styles.error}>{checkUser ? 'Username is already taken' : ''}</FormHelperText>
                        <FormHelperText style={styles.error}>{checkEmail ? 'Email is already taken' : ''}</FormHelperText>
                    </FormControl>
                    <Button style={styles.button} onClick={this.handleClick}>Register</Button>
                </Paper>
            </div>
        )
    }
}

const styles = {
    root: {
        height: '100vh',
        width: '100%',
        backgroundColor: '#f2f2f2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        backgroundImage: 'url(https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    paper: {
        height: 'auto',
        width: '50vw',
        padding: '2% 4%',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: 50,
        marginBottom: '2%'
    },
    input: {
        marginBottom: '2%'
    },
    button: {
        width: '50%',
        backgroundColor: '#130f40',
        color: 'white',
        margin: 'auto'
        // marginTop: '7%'
    },
    error: {
        color: 'red',
        marginTop: '2%'
    }
}

export default Register