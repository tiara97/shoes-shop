import React from 'react'
import {
    Table, TableBody, TableCell, TableRow, TableHead, Box, IconButton, Collapse, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@material-ui/core'
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Rating from "@material-ui/lab/Rating";
import { connect } from 'react-redux'
import { LogIn, productAction } from '../actions'
import Axios from 'axios'

class UserHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            opencollapse: false,
            cellId: null,
            read: false,
            rate: 0,
            alert: false,
            idProduct: null
        }
    }
    componentDidMount() {
        // console.log(localStorage.getItem('id'))
        Axios.get(`http://localhost:2000/transaction_history?userID=${localStorage.getItem('id')}`)
            .then(res => this.setState({ data: res.data }))
            .catch(error => console.log(error))
    }
    handleClose = () => {
        this.setState({ alert: false })
    }
    buttonRating = (index, i) => {
        let idProduct = this.state.data[index].products[i].id
        console.log(this.props.product)
        console.log(index, i);
        console.log(idProduct)
        this.setState({ alert: true, idProduct: idProduct });
    }
    handleRating = (newvalue) => {
        console.log(newvalue)
        this.setState({ rate: newvalue })
    }
    handleConfirm = () => {
        const { rate } = this.state
        Axios.get(`http://localhost:2000/products/${this.state.idProduct}`)
            .then(res => {
                if (res.data.rating.length !== 0) {
                    console.log(res.data.rating)
                    let total = res.data.rating
                    total.push(rate)
                    console.log(total)
                    Axios.patch(`http://localhost:2000/products/${this.state.idProduct}`, { rating: total })
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err))
                } else {
                    Axios.patch(`http://localhost:2000/products/${this.state.idProduct}`, { rating: [rate] })
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err))
                }
                this.setState({ alert: false})
            })
            .catch(err => console.log(err))
    }
    renderTableHead = () => {
        return (
            <TableRow>
                <TableCell></TableCell>
                <TableCell>No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
            </TableRow>
        )
    }
    renderTableBody = () => {
        const { opencollapse, cellId, rate, idProduct } = this.state;
        return this.state.data.map((item, index) => {
            if (item.userID === this.props.id) {
                return (
                    <TableBody>
                        <TableRow>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => this.setState({ opencollapse: !opencollapse, cellId: index })}
                                open={opencollapse && cellId === index}
                            >
                                {opencollapse && cellId === index ? (<KeyboardArrowUpIcon />) : (<KeyboardArrowDownIcon />)}
                            </IconButton>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>Rp. {item.total.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}
                            >
                                <Collapse
                                    in={opencollapse && cellId === index}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <Box>
                                        <Typography variant="h6" gutterBottom component="div">
                                            History Details
                          </Typography>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Image</TableCell>
                                                <TableCell>Item</TableCell>
                                                <TableCell>Color</TableCell>
                                                <TableCell>Size</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Rating</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.products.map((value, i) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>
                                                                <img src={value.image} alt="" width="100px" />{" "}
                                                            </TableCell>
                                                            <TableCell>{value.name}</TableCell>
                                                            <TableCell>{value.color}</TableCell>
                                                            <TableCell>{value.size}</TableCell>
                                                            <TableCell>{value.qty}</TableCell>
                                                            <TableCell>
                                                                Rp. {value.total.toLocaleString()}
                                                            </TableCell>
                                                        {value.id !== idProduct ?
                                                            <TableCell>
                                                                <Button onClick={() => this.buttonRating(index, i) } color='primary' variant='outlined'>Rate</Button>
                                                            </TableCell>
                                                        :
                                                            <TableCell>
                                                                <Box
                                                                    component="fieldset"
                                                                    mb={3}
                                                                    borderColor="transparent"
                                                                >
                                                                    <Rating
                                                                        name="read-only"
                                                                        readOnly
                                                                        value={rate}
                                                                        precision={0.5}
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                        }
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )
            }
        })
    }
    render() {
        const { read, rate, alert } = this.state
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Transaction History</h1>
                <Table style={styles.table}>
                    {this.renderTableHead()}
                    {this.renderTableBody()}
                </Table>
                <Dialog
                    open={alert}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="form-dialog-title">Rate our products</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {'Give us a feedback!'}
                        </DialogContentText>
                        <Box
                            component="fieldset"
                            mb={3}
                            borderColor="transparent"
                        >
                            <Rating
                                name="simple-controlled"
                                value={rate}
                                onChange={(event, newvalue) =>
                                    this.handleRating(newvalue)
                                }
                            />
                        </Box>
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
        minHeight: 'calc(100vh - 70px)',
        height: 'auto',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%'
    },
    table: {
        backgroundColor: 'white'
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart,
        product: state.product
    }
}

export default connect(mapStateToProps, { LogIn, productAction })(UserHistory)
// kalo ga pake action / cmn ambil data aja kyk gini :
// export default connect(mapStateToProps)(Login)
// ingat! action itu untuk edit / simpan data di global store
