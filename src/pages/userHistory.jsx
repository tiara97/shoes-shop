import React from 'react'
import { Table, TableBody, TableCell, TableRow, TableHead, Card, CardContent } from '@material-ui/core'
import { connect } from 'react-redux'
import { LogIn } from '../actions'
import Axios from 'axios'

class UserHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount () {
        Axios.get(`http://localhost:2000/transaction_history`)
        .then(res => this.setState({data: res.data}))
        .catch(error => console.log(error))
    }
    renderTableHead = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Products</TableCell>
                </TableRow>
            </TableHead>
        )
    }
    renderTableBody = () => {
        return this.state.data.map((item, index) => {
            if(item.userID === this.props.id) {
                return (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.total}</TableCell>
                        <TableCell>
                            {item.products.map((value,i) => {
                                return (
                                    <Card key={i}>
                                        <CardContent>
                                            <h4>{value.name}</h4>
                                            <h5>Brand : {value.brand}</h5>
                                            <h5>Color : {value.color}</h5>
                                            <h5>Size : {value.size}</h5>
                                            <h5>Qty : {value.qty}</h5>
                                            <h5>Total : {value.total}</h5>
                                        </CardContent>
                                    </Card>
                                )
                            })
                            }
                        </TableCell>
                    </TableRow>
                )
            }
        })
    }
    render() {
        console.log(this.props.id)
        console.log(this.state.data)
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Transaction History</h1>
                <Table style={styles.table}>
                    {this.renderTableHead()}
                    <TableBody>
                        {this.renderTableBody()}
                    </TableBody>
                </Table>
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
    table : {
        backgroundColor : 'white'
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps, { LogIn })(UserHistory)