import React from 'react'
import { TextField, Button, Paper, IconButton, OutlinedInput, InputAdornment, FormControl, InputLabel, FormHelperText } from '@material-ui/core'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {LogIn} from '../actions'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: [],
            visible: false,
            loginError: false
        }
    }
    handleLogin = () => {
        let username = this.username.value
        let password = this.password.value
        console.log(username, password)
        Axios.get(`http://localhost:2000/users?username=${username}&password=${password}`)
            .then(response => {
                console.log(response.data)
                if (response.data.length === 0) {
                    this.setState({error: true})
                } else {
                    localStorage.setItem('id', response.data[0].id)
                    this.props.LogIn(response.data[0])
                    this.setState({error: false})
                }
            })
            .catch(error => console.log(error))
    }
    render() {
        const { visible, loginError} = this.state
        console.log(this.props.username)
        if(this.props.username) {
            return <Redirect to='/' />
        }
        return (
            <div style={styles.root}>
                <Paper style={styles.paper} elevation={5}>
                        <h1>Login to Shoes Shop</h1>
                        <TextField 
                        id="outlined-basic" 
                        label="Username" 
                        variant="outlined" 
                        style={styles.input}
                        inputRef={(username) => this.username = username}
                        />
                       
                       <FormControl variant="outlined" style={styles.input}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={visible ? "text" : "password"}
                            inputRef={(password) => this.password = password}
                            helperText="Incorrect entry."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={() => this.setState({visible : !visible})}
                                    >
                                        { visible ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <FormHelperText style={styles.error}>{loginError ? '* username or password is invalid' : ''}</FormHelperText>
                    </FormControl>
                    <h5 style={styles.info}>Forgot password</h5>
                    <h5 style={styles.info}><Link to='/register' style={styles.link}>Register</Link></h5>
                    <Button style={styles.button} onClick={this.handleLogin}>Login</Button>
                </Paper>
            </div>
        )
    }
}
const styles = {
    root : {
        height : 'calc(100vh - 70px)',
        width : '100%',
        backgroundColor : '#f2f2f2',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        paddingTop : 80,
        backgroundImage : 'url(https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
    },
    paper : {
        height : '70vh',
        width : '45vw',
        padding : '5% 8%',
        display : 'flex',
        flexDirection : 'column'
    },
    title : {
        fontSize : 50,
        marginBottom : '5%'
    },
    input : {
        margin : '2% 0px'
    },
    info : {
        margin : '1% 0px'
    },
    button : {
        width : '50%',
        backgroundColor : '#130f40',
        color : 'white',
        margin: 'auto'
    },
    error : {
        color : 'red'
    },
    link: {
        textDecoration: 'none',
        color: 'black'
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps, {LogIn})(Login)
// kalo ga pake action / cmn ambil data aja kyk gini : 
// export default connect(mapStateToProps)(Login)
// ingat! action itu untuk edit / simpan data di global store
