import React from 'react'
import { Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core'
import { connect } from 'react-redux'
import { LogIn } from '../actions'
import Axios from 'axios'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            editOn: false,
            error: [false, false],
            checkUser: false,
            checkEmail: false,
            editPass: false,
            errorPass: [false, false]
        }
    }
    componentDidMount () {
        Axios.get(`http://localhost:2000/users`)
            .then(response => this.setState({data: response.data})
            )
            .catch(error => console.log(error))
    }
    checkInputUsername = (usernameInput) => {
        let check = false
        if(usernameInput === this.props.user.username) {
            return check
        } else {
            this.state.data.filter(item => {
                if(item.username === usernameInput) {
                    check = true
                }
            })
            return check
        }
    }
    checkInputEmail = (emailInput) => {
        let check = false
        if(emailInput === this.props.user.email) {
            return check
        } else {
            this.state.data.filter(item => {
                if(item.email === emailInput) {
                    check = true
                }
            })
            return check
        }
    }
    handleClose = () => {
        this.setState({ editOn: false })
    }
    handleConfirm = () => {
        let username = this.username.value
        let email = this.email.value
        let inputError = this.inputValidation(username, email)
        let checkUsernameError = this.checkInputUsername(username)
        let checkEmailError = this.checkInputEmail(email)
        console.log(inputError, checkUsernameError, checkEmailError)
        if(inputError.includes(true) || checkUsernameError || checkEmailError) {
            this.setState({error: inputError, checkUser: checkUsernameError, checkEmail: checkEmailError})
            return
        }
        console.log('masuk')
    }
    handleConfirmPass = () => { // blm lanjutin
        let password = this.password.value
        let confpassword = this.confpassword.value
        let passError = this.passValidation(password)
        if(passError === true || password !== confpassword) {
        } 
    }
    passValidation = (password, confpassword) => {
        let passError = password ? false : true
        let checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/
        // kalo kosong inputnya
        if (passError) {
            return passError
        }
        //kalo bener
        if (checkPass.test(password) === false) {
            passError = true
        }
        //cek pass dan confpass sama
        if(password !== confpassword)
        return passError
    }
    inputValidation = (username, email) => {
        let usernameError = username ? false : true
        let emailError = email ? false : true
        let checkUser = /[^A-Za-z0-9_]/
        let checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // kalo kosong inputnya
        if (usernameError || emailError) {
            return [usernameError, emailError]
        }
        //kalo bener semua
        if (checkUser.test(username) === false && checkEmail.test(email) === true) {
            return [false, false]
        }
        // cek satu2 kalo ada yg salah
        if (checkUser.test(username) === true) { usernameError = true }
        if (checkEmail.test(email) === false) { emailError = true }
        return [usernameError, emailError]
    }
    editProfile = () => {
        this.setState({ editOn: true })
    }
    render() {
        const { editOn, error, checkUser, checkEmail, editPass, errorPass } = this.state
        console.log(this.props.user)
        return (
            <div style={styles.root}>
                <Paper style={styles.paper}>
                    <h1 style={styles.title}>Profile</h1>
                    <h3>ID : {this.props.user.id}</h3>
                    <h3>Username : {this.props.user.username}</h3>
                    <h3>Email : {this.props.user.email}</h3>
                    <Button variant='outlined' onClick={this.editProfile}>Edit Profile</Button>
                    <Button variant='outlined' onClick={this.editPassword}>Edit Password</Button>
                </Paper>
                <Dialog
                    open={editOn}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            helperText={error[0] ? 'Input must not contain symbol' : ''}
                            // helperText={checkUser ? 'Username already taken' : ''}
                            defaultValue={this.props.user.username}
                            id="name"
                            label='New username'
                            type="text"
                            error={error[0] || checkUser}
                            inputRef={(username) => this.username = username}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            helperText={error[1] ? 'Email is invalid' : ''}
                            defaultValue={this.props.user.email}
                            id="email"
                            label='New email'
                            type="text"
                            error={error[1] || checkEmail}
                            inputRef={(email) => this.email = email}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={this.handleConfirm} color="primary" autoFocus>
                            Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={editPass}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="form-dialog-title">Edit Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            helperText={errorPass[0] ? 'Password length must be 6-15 char, and must contain lowercase, uppercase, and a number' : ''}
                            id="password"
                            label='New password'
                            type="password"
                            error={errorPass[0]}
                            inputRef={(password) => this.password = password}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            helperText={errorPass[1] ? 'Password does not match' : ''}
                            id="confPassword"
                            label='Confirm password'
                            type="password"
                            error={errorPass[1]}
                            inputRef={(confpassword) => this.confpassword = confpassword}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={this.handleConfirmPass} color="primary" autoFocus>
                            Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
const styles = {
    root: {
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%',
        display: 'flex',
        justifyContent: 'center'
    },
    paper: {
        height: '70vh',
        width: '45vw',
        padding: '5% 8%',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        marginBottom: '3%'
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, { LogIn })(UserProfile)
// export default UserProfile