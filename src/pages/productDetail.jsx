import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Paper, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core'
import Slider from "react-slick"
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { IconButton, Button } from '@material-ui/core'
import { LogIn } from '../actions'

class ProductDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            stock: null,
            toLogin: false,
            selectedSize: null,
            total: 0,
            size: null,
            toCart: false,
            alert: false
        }
    }
    componentDidMount() {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
            .then(res => {
                this.setState({ product: res.data[0] })
            })
            .catch(error => console.log(error))
    }
    handleAddToCart = () => {
        const { total, product, size,selectedSize } = this.state
        // check user input
        if (size === null || total === 0) {
            this.setState({ alert: true })
            return
        }
        // check if user already sign in ?
        if (!this.props.id) {
            this.setState({ toLogin: true })
        } else {
            console.log('user already login')
            let cartData = {
                name: product.name,
                image: product.images[0],
                brand: product.brand,
                color: product.colour,
                size: size,
                qty: total,
                total: total * product.price,
                price: product.price,
                id : product.id,
                index: selectedSize
            }
            let tempCart = this.props.cart
            tempCart.push(cartData)

            Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
                .then(res => {
                    Axios.get(`http://localhost:2000/users/${this.props.id}`)
                        .then(res => {
                            this.props.LogIn(res.data)
                            this.setState({ toCart: true })
                        })
                        .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
        }
    }
    handleClose = () => {
        this.setState({alert : false})
    }
    renderSlider = () => {
        // (this.state.product.images || []) -> ini sama aja kyk ternary function -> (this.state.product.images ? this.state.product.images || []). jadi kalo array kosong (kondisi awal kan masih kosong), maka ga ngelakuin apa2
        // pake this.state.product.images.map krn this.state.product bentuknya object, jadi lgsg ngemap images aja
        return (this.state.product.images || []).map((item, index) => {
            return (
                <div key={index}>
                    {/* <img src={item} style={styles.img}></img> */}
                    <div style={{ backgroundImage: `url(${item})`, ...styles.img }}>
                    </div>
                </div>
            )
        })
    }
    renderButton = () => {
        const { selectedSize } = this.state
        return (this.state.product.stock || []).map((item, index) => {
            return (
                <Button key={index}
                variant="contained" 
                disabled={item.total > 0 ? false : true} onClick={() => this.setState({ stock: item.total, selectedSize : index, size: item.code, total: 0 })} 
                style={{backgroundColor : selectedSize === index ? '#130f40' : '', color : selectedSize === index ? 'white' : 'black', ...styles.sizeButton, marginRight: '2%'}}>
                    {item.code}
                </Button>
            )
        })
    }
    render() {
        // console.log(this.props.location)
        // this.props.location ini cmn mau ngasih tau lokasi kita dimana
        console.log(this.state.product)

        const settings = {
            dots: true,
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            appendDots: dots => {
                return (
                    <div style={styles.dot}>
                        <ul>{dots}</ul>
                    </div>
                )
            },
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        }
        if (this.state.toLogin) {
            return <Redirect to='/login' />
        }
        else if (this.state.toCart) {
            return <Redirect to='/cart' />
        }
        return (
            <div style={styles.root}>
                <Paper style={styles.paper}>
                    <div style={styles.leftContent}>
                        <Slider {...settings} style={styles.slider}>
                            {this.renderSlider()}
                        </Slider>
                    </div>
                    <div style={styles.rightContent}>
                        <h1 style={styles.info}>Name : {this.state.product.name}</h1>
                        <h1 style={styles.info}>Category : {this.state.product.category}</h1>
                        <h1 style={styles.info}>Brand : {this.state.product.brand}</h1>
                        <h1 style={styles.info}>Color : {this.state.product.colour}</h1>
                        <h1 style={styles.info}>Price : Rp. {this.state.product.price}</h1>
                        <h1 style={styles.info}>Description : </h1>
                        <h1 style={styles.decs}>{this.state.product.description}</h1>
                        <h1 style={styles.info}>Size : </h1>
                        <div style={styles.divButton}>
                            {this.renderButton()}
                        </div>
                        <h5>{this.state.stock ? `stock = ${this.state.stock}` : ''}</h5>
                        <div style={styles.total}>
                            <Button variant='contained' disabled={this.state.total < 1 ? true : false} onClick={() => this.setState({ total: this.state.total - 1 })}>-</Button>
                            <h1>{this.state.total}</h1>
                            <Button variant='contained'  disabled={this.state.total >= this.state.stock ? true : false} onClick={() => this.setState({ total: this.state.total + 1 })}>+</Button>
                        </div>
                        <Button style={styles.button} onClick={this.handleAddToCart}>Add to Cart</Button>
                    </div>
                </Paper>
                <Dialog
                    open={this.state.alert}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"⚠ Warning !"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please choose size, and input quantity of your choice. (Min = 1)
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
function NextArrow(props) {
    const { onClick } = props
    return (
        <IconButton style={styles.next} onClick={onClick}>
            <NavigateNextIcon />
        </IconButton>
    )
}
function PrevArrow(props) {
    const { onClick } = props
    return (
        <IconButton style={styles.prev} onClick={onClick}>
            <NavigateBeforeIcon />
        </IconButton>
    )
}
const styles = {
    root: {
        minHeight: 'calc(100vh - 70px)',
        height: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: '90px 10% 3% 10%'
    },
    paper: {
        height: 'auto',
        width: '100%',
        padding: '3% 3%',
        display: 'flex'
    },
    leftContent: {
        // backgroundColor: 'lavenderblush',
        height: '100%',
        width: '40vw',
        marginRight: '3%'
    },
    rightContent: {
        height: '100%',
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column'
    },
    slider: {
        // backgroundColor: 'blue',
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    img: {
        height: '70vh',
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% auto',
        backgroundPosition: 'center'
    },
    info: {
        fontSize: 22,
        marginBottom: '2%',
        fontWeight: 600,
        textTransform: 'capitalize'
    },
    decs: {
        fontSize: 18,
        marginBottom: '2%',
        fontWeight: 400
    },
    divButton: {
        display: 'flex'
    },
    button: {
        backgroundColor: '#130f40',
        color: 'white',
        width: '30%',
        alignSelf: 'flex-end'
        // marginTop: '5%',
        // position: 'absolute',
        // bottom: '5%'
    },
    total : {
        display : 'flex',
        alignItems : 'center',
        marginTop: '2%'
    },
    next: {
        position: 'absolute',
        right: '3%',
        top: '45%',
        zIndex: '3',
        backgroundColor: 'rgba(255,255,255,0.4)'
    },
    prev: {
        position: 'absolute',
        left: '3%',
        top: '45%',
        zIndex: '3',
        backgroundColor: 'rgba(255,255,255,0.4)'
    },
    dot: {
        position: 'absolute',
        zIndex: '2',
        height: '30',
        bottom: '0'
    }
}
const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps, { LogIn })(ProductDetail)