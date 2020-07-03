import React from 'react'
import { Table, TableHead, TableRow, TableCell, TextField, TableBody, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core'
import { connect } from 'react-redux'
import { LogIn } from '../actions'
import Axios from 'axios'

class UserCart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            error: false
        }
    }
    componentDidMount () {
        
    }
    handleDelete = (index) => {
        let tempCart = this.props.cart
        tempCart.splice(index, 1)
        // update data in database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then(res => {
                console.log(res.data)
                // update data redux
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then(res => {
                        console.log(res.data)
                        this.props.LogIn(res.data)
                    })
            })
            .catch(err => console.log(err))
    }
    handleCheckout = () => {
            if (this.props.cart.length === 0) return
            this.setState({ alert: true })
        
    }
    handleClose = () => {
        this.setState({ alert: false})
    }
    handleConfirm = () => {
        let password = this.password.value
        Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then(response => {
                if (response.data.password !== password) {
                    this.password.value = ''
                    this.setState({error: true, alert: true})
                    return
                } else {
                    let history = {
                        userID: this.props.id,
                        date: new Date().toLocaleString(),
                        total: this.props.cart.map(item => item.total).reduce((a, b) => a + b),
                        products: this.props.cart
                    }
                    console.log(history)
                    // update database
                    Axios.post('http://localhost:2000/transaction_history', history)
                        .then(res => {
                            console.log(res.data)
            
                            // update cart user => []
                            Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: [] })
                                .then(res => {
                                    console.log(res.data)

                                    // reduce stock
                                    // let tempProduct = this.props.product
                                    // let tempCart = this.props.cart.map(item => {return {id: item.id, index: item.index, qty: item.qty}})
                                    // for (let i=0; i<tempCart.length; i++) {
                                    //     tempProduct[tempCart[i].id-1].stock[tempCart[i].index].total -= tempCart[i].qty
                                    //     Axios.patch(`http://localhost:2000/products/${tempCart[i].id}`)
                                    // }
                                    
                                    // update data redux
                                    Axios.get(`http://localhost:2000/users/${this.props.id}`)
                                        .then(res => {
                                            console.log(res.data)
                                            this.props.LogIn(res.data)
                                        })
                                })
                        })
                        .catch(err => console.log(err))
                    this.setState({ alert: false})
                }
            })
            .catch(error => console.log(error))
        }
    renderTableHead = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
        )
    }
    renderTableBody = () => {
        return this.props.cart.map((item, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <img src={item.image} width='70px' alt='product-img'></img>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => this.handleDelete(index)}
                        >Delete</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }
    render() {
        const { alert, error } = this.state
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>User Cart</h1>
                <Table>
                    {this.renderTableHead()}
                    <TableBody>
                        {this.renderTableBody()}
                    </TableBody>
                </Table>
                <Button variant='contained' onClick={this.handleCheckout}>Check out</Button>
                {/* alert checkout */}
                <Dialog
                    open={alert}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="form-dialog-title">Checkout Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {'To confirm this purchase, please input your password.'}
                    </DialogContentText>
                    <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Password"
                            type="password"
                            error={error}
                            inputRef = {(password) => this.password = password}
                            fullWidth
                            helperText={error? 'Password is wrong' : ''}
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
            </div>
        )
    }
}
const styles = {
    root: {
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%'
    },
    title: {
        margin: '2% 0px'
    },
    ul: {
        listStyle: 'none'
    },
    buttonCheckOut: {
        marginTop: '3%',
        color: 'white',
        backgroundColor: '#130f40'
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id,
        product: state.product
    }
}
export default connect(mapStateToProps, { LogIn})(UserCart)