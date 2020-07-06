import React from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableCell, TableRow, TableHead, Box, IconButton, Collapse, Typography, Button, Dialog, DialogTitle, DialogContent, Select, MenuItem, InputLabel } from '@material-ui/core'
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { LogIn } from '../actions'
import Axios from 'axios'

class AdminTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      opencollapse: false,
      cellId: null,
      detail: false,
      selectedIndex: null,
      type: 'userID',
      sortOrder: 'asc'
    }
  }
  componentDidMount() {
    Axios.get('http://localhost:2000/transaction_history')
      .then(res => this.setState({ data: res.data }))
      .catch(err => console.log(err))
    // this.getProductData()
  }
  getProductData = () => {
    console.log(this.state.type, this.state.sortOrder)
    Axios.get(`http://localhost:2000/transaction_history?_sort=${this.state.type}&_order=${this.state.sortOrder}`)
        .then((res) => {
          console.log(this.state.data)
          this.setState({ data: res.data })
        })
        .catch((err) => console.log(err));
  }
  renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>User ID</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
    )
  }
  handleClose = () => {
    this.setState({ detail: false, selectedIndex: null })
  }

  handleDetail = (index) => {
    console.log(this.state.data[0].products)
    this.setState({ detail: true, selectedIndex: index })
  }
  renderTableBodyCollapse = () => {
    const { opencollapse, cellId } = this.state
    // pake reverse kalo mau nampilin data yg terbaru dulu
    return this.state.data.reverse().map((item, index) => {
      return (
        <TableBody>
          <TableRow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() =>
                this.setState({ opencollapse: !opencollapse, cellId: index })
              }
              open={opencollapse && cellId === index}
            >
              {opencollapse && cellId === index ? (
                <KeyboardArrowUpIcon />
              ) : (
                  <KeyboardArrowDownIcon />
                )}
            </IconButton>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.userID}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>Rp. {item.total.toLocaleString()}</TableCell>
            <TableCell></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={5}
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
                      <TableCell>Item</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.products.map((value) => {
                      return (
                        <TableRow>
                          <TableCell>{value.name}</TableCell>
                          <TableCell>{value.color}</TableCell>
                          <TableCell>{value.size}</TableCell>
                          <TableCell>{value.qty}</TableCell>
                          <TableCell>
                            Rp. {value.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    })
  }
  renderTableBody = () => {
    return this.state.data.map((item, index) => {
      return (
        <TableBody>
          <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.userID}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>Rp. {item.total.toLocaleString()}</TableCell>
            <TableCell><Button variant='contained' onClick={() => this.handleDetail(index)}>Details</Button></TableCell>
          </TableRow>
        </TableBody>
      )
    })
  }
  handleType = (event) => {
    console.log(event.target.value)
    let typenew = event.target.value
    this.setState({type: typenew})
    this.getProductData()
  }
  handleOrder = (e) => {
    console.log(e.target.value)
    let ordernew = e.target.value
    this.setState({sortOrder: ordernew})
    this.getProductData()
  }
  render() {
    const { detail, selectedIndex, type, sortOrder } = this.state
    // console.log(this.state.data)
    // console.log(this.state.selectedIndex)
    return (
      <div style={styles.root}>
        <h1 style={styles.title}>Transaction History</h1>
        <div style={styles.sort}>
        <h3>Sort By</h3>
        <Select
        id="demo-simple-select"
          value={type}
          onChange={this.handleType}
        >
          <MenuItem value='userID'>user ID</MenuItem>
          <MenuItem value='date'>Date</MenuItem>
          <MenuItem value='total'>Total</MenuItem>
        </Select>
        <Select
          id="simple-select"
          value={sortOrder}
          onClick={this.handleOrder}
        >
          <MenuItem value='asc'>Ascending</MenuItem>
          <MenuItem value='desc'>Descending</MenuItem>
        </Select>
        </div>
      
        <Table>
          {this.renderTableHead()}
          {this.renderTableBody()}
        </Table>
        <Dialog
          open={detail}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth='lg'
        >
          <DialogTitle id="form-dialog-title">Transaction History Details</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedIndex !== null ?
                this.state.data[selectedIndex].products.map((value, index) => {
                  return (
                    <TableRow>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>
                        <img src={value.image} width='70px' alt='product-img'></img>
                    </TableCell>
                      <TableCell>{value.name}</TableCell>
                      <TableCell>{value.brand}</TableCell>
                      <TableCell>{value.color}</TableCell>
                      <TableCell>{value.size}</TableCell>
                      <TableCell>{value.price.toLocaleString()}</TableCell>
                      <TableCell>{value.qty}</TableCell>
                    </TableRow>
                  );
                })
                :
                    <TableRow></TableRow>
                }
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
const styles = {
  root: {
    minHeight: 'calc(100vh - 70px)',
    height: 'auto',
    backgroundColor: '#f2f2f2',
    padding: '90px 10% 3% 10%'
  },
  sort: {
    display: 'flex'
  }
}
const mapStateToProps = (state) => {
  return {
    cart: state.user.cart,
    id: state.user.id,
    product: state.product
  }
}
export default connect(mapStateToProps, { LogIn })(AdminTransaction)
// kalo ga pake action / cmn ambil data aja kyk gini :
// export default connect(mapStateToProps)(Login)
// ingat! action itu untuk edit / simpan data di global store