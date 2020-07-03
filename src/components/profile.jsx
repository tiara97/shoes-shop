import React from 'react'
import { IconButton, Avatar, Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { LogOut } from '../actions'

class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null
        }
    }
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }
    handleClose = () => {
        this.setState({ anchorEl: null })
    }
    handleLogout = () => {
        localStorage.clear()
        this.props.LogOut()
    }
    render() {
        return (
            <div>
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => this.handleClick(e)}>
                    {
                        this.props.username ?
                            <Avatar style={{ backgroundColor: '#130f40' }}>{this.props.username.charAt(0).toUpperCase()}</Avatar> : <Avatar></Avatar>
                    }
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {
                        this.props.username ?
                            this.props.role === 'admin' ?
                                <div>
                                    <MenuItem>Product Management</MenuItem>
                                    <Link to='/adminDashboard' style={styles.link}>
                                    <MenuItem>Transaction Management</MenuItem>
                                    </Link>
                                    <Link to='/' style={styles.link}>
                                    <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                                    </Link>
                                </div>
                                :
                                <div>
                                    <Link to='/profile' style={styles.link}>
                                    <MenuItem>Profile</MenuItem>
                                    </Link>
                                    <Link to='/cart' style={styles.link}>
                                    <MenuItem>Cart</MenuItem>
                                    </Link>
                                    <Link to='/history' style={styles.link}>
                                    <MenuItem>History</MenuItem>
                                    </Link>
                                    <Link to='/' style={styles.link}>
                                    <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                                    </Link>
                                </div>
                            :
                            <div>
                                <Link to='/login' style={styles.link}>
                                    <MenuItem>Login</MenuItem>
                                </Link>
                                    <Link to='/register' style={styles.link}>
                                    <MenuItem>Register</MenuItem>
                                    </Link>
                            </div>
                    }
                </Menu>
            </div >
        )
    }
}
const styles = {
    link: {
        textDecoration: 'none',
        color: 'black'
    },
    ul: {
        listStyle: 'none'
    }
}

const mapStateToProps = (state) => {
    // mapStateToProps -> define data apa aja yg mau diambil
    return {
        username: state.user.username,
        role: state.user.role
    }
}
export default connect(mapStateToProps, { LogOut })(Profile)