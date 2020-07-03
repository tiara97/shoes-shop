import React from 'react'
import { AppBar, Toolbar, IconButton, Badge } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { LOGO } from '../assets'
import Profile from './profile'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { LogIn} from '../actions'

class Navbar extends React.Component {
    render() {
        return (
            <AppBar position="fixed" style={styles.root}>
                <Toolbar style={styles.Toolbar}>
                    <div style={styles.leftContent}>
                        <img src={LOGO} alt='logo' height='90%'/>
                        <Link to='/' style={styles.link}>
                        <h1 style={styles.home}>Home</h1>
                        </Link>
                    </div>
                    <div style={styles.rightContent}>
                        <IconButton color="inherit">
                            <Badge badgeContent={this.props.cart.length} color="primary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        <Profile/>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}
const styles = {
    root: {
        height: '70px',
        padding: '2% 0%',
        display: 'flex',
        justifyContent : 'center',
        backgroundColor: 'rgba(30,39,46,0.3)'
    },
    toolbar : {
        display: 'flex',
        justifyContent : 'space-between',
        padding: '0px'
    },
    leftContent : {
        height: '100%',
        flexBasis : '50%',
        maxWidth: '50%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    home : {
        fontSize: '14',
        cursor: 'pointer',
        color: 'white'
    },
    rightContent: {
        flexBasis : '50%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none',
        paddingLeft: '5%',
        color: 'white'
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id
    }
}
export default connect(mapStateToProps, { LogIn})(Navbar)
// export default Navbar