import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, Typography, Popover, Divider, MenuItem } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { LOGO } from '../assets'
import Profile from './profile'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { LogIn } from '../actions'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            open: false
        }
    }
    handlePopoverOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget, open: !this.state.open })
    };

    handlePopoverClose = () => {
        this.setState({ anchorEl: null, open: false })
    };

    renderPopOver = () => {
        return (
            <Popover
                id="mouse-over-popover"
                style={styles.popover}
                open={Boolean(this.state.anchorEl)}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={this.handlePopoverClose}
                disableRestoreFocus
            >
                {this.props.cart.length > 0 ?
                <>
                <h3 style={{ textAlign: 'center' }}>Cart({this.props.cart.length})</h3>
                <Divider />
                {(this.props.cart).map(item => {
                    return (
                        <div style={styles.cartPopOver}>
                            <div style={{ margin: 'auto' }}>
                                <MenuItem>
                                    <img src={item.image} width='60px' />
                                </MenuItem>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                <MenuItem>{item.name}</MenuItem>
                                <div style={{ display: 'flex',  flexWrap: 'wrap' }}>
                                    <MenuItem>Rp. {item.price.toLocaleString()}</MenuItem>
                                    <MenuItem>Qty : {item.qty}</MenuItem>
                                </div>
                            </div>
                            <Divider />
                        </div>
                    )
                })}
                <h2 style={{textAlign: 'center'}}><Link to='/cart' style={{textDecoration: 'none', color: 'black'}}>Go to Cart</Link></h2>
                </>
                :
                <div style={{width: '150px'}}>
                <h3 style={{ textAlign: 'center' }}>Cart is empty.</h3>
                </div>
                }
            </Popover>
        )
    }
    totalPrice = () => {
        let total = 0
        this.props.cart.map(item => {
            total += item.total
        })
        return total.toLocaleString()
    }
    totalCart = () => {
        let count = 0
        if(this.props.cart.length > 0) {
            for (let i = 0; i < this.props.cart.length; i++) {
                count += this.props.cart[i].qty
            }
        }
        return count
    }
    render() {
        return (
            <AppBar position="fixed" style={styles.root}>
                <Toolbar style={styles.Toolbar}>
                    <div style={styles.leftContent}>
                        <img src={LOGO} alt='logo' height='90%' />
                        <Link to='/' style={styles.link}>
                            <h1 style={styles.home}>Home</h1>
                        </Link>
                    </div>
                    <div style={styles.rightContent}>
                        <IconButton color="inherit" aria-label="cart" onClick={(e) => this.handlePopoverOpen(e)}>
                            <Badge badgeContent={this.totalCart()} color="primary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        {this.renderPopOver()}
                        <Typography style={{ color: 'white', width: 'auto', marginLeft: '1vw' }}>IDR. {this.totalPrice()}</Typography>
                        <Profile />
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
        justifyContent: 'center',
        backgroundColor: 'rgba(30,39,46,0.3)'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px'
    },
    leftContent: {
        height: '100%',
        flexBasis: '50%',
        maxWidth: '50%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    home: {
        fontSize: '14',
        cursor: 'pointer',
        color: 'white'
    },
    rightContent: {
        flexBasis: '50%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none',
        paddingLeft: '5%',
        color: 'white'
    },
    popover:{
        width: '500px'
    },
    cartPopOver:{
        display: 'flex',
        // flexDirection: 'column',
        width: '500px'
      }
}
const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id
    }
}
export default connect(mapStateToProps, { LogIn })(Navbar)
// export default Navbar