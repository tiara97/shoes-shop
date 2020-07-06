import React from 'react'
import Axios from 'axios'
import { Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, Button, Box, OutlinedInput, Select, MenuItem, InputLabel } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { productAction } from '../actions'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            category: "",
            price: ""
        }
    }
    componentDidMount() {
        // this.getProductData('')
        Axios.get('http://localhost:2000/products')
            .then(response => {
                this.props.productAction(response.data)
                // this.setState({ data: response.data })
            })
            .catch(error => console.log(error))
    }
    getProductData = (input) => {
        Axios.get(`http://localhost:2000/products?q=${input}`)
            .then((res) => this.props.productAction(res.data))
            .catch((err) => console.log(err));
    };
    handleCategory = (event) => {
        console.log(event.target.value);
        let cat = event.target.value;
        this.setState({ category: cat });
        this.getProductData(cat);
    };
    handleSearch = () => {
        let searchInput = this.search.value;
        this.getProductData(searchInput);
    };
    handlePrice = (event) => {
        console.log(event.target.value);
        let sortPrice = event.target.value;
        let searchInput = this.search.value;
        this.setState({ price: sortPrice });
        Axios.get(
            `http://localhost:2000/products?q=${searchInput}&_sort=price&_order=${sortPrice}`
        )
            .then((res) => this.props.getProduct(res.data))
            .catch((err) => console.log(err));
    }
    handleReset = () => {
        Axios.get('http://localhost:2000/products')
            .then(response => {
                this.props.productAction(response.data)
            })
            .catch(error => console.log(error))
    }
    renderCard = () => {
        if (this.props.product !== null) {
            return this.props.product.map((item, index) => {
                return (
                    <Card style={styles.card} key={index}>
                        <CardActionArea style={styles.contentArea}>
                            <CardMedia image={item.images[0]} component='img' style={styles.contentImage} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.name}
                                </Typography>
                                <Box component="fieldset" mb={3} borderColor="transparent">
                                    <Rating name="read-only" value={item.rating.length > 0 ? item.rating.reduce((a, b) => (a + b)) / item.rating.length : 0} precision={0.5} readOnly />
                                </Box>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {`Rp. ${item.price}`}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions style={styles.contentAction}>
                            <Link to={`/details?id=${item.id}`} style={styles.link}>
                                <Button size="small" color="primary">
                                    Buy now
                        </Button>
                            </Link>
                            <Button size="small" color="secondary">
                                Wishlist
                        </Button>
                        </CardActions>
                    </Card>
                )
            })
        }
    }
    render() {
        const { category, price } = this.state
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Products</h1>
                <div style={styles.input}>
                    <OutlinedInput
                        inputRef={(search) => (this.search = search)}
                    ></OutlinedInput>
                    <Button variant="contained" type="button" onClick={this.handleSearch}>
                        Search
                    </Button>
                    <Typography variant="h6">Filter Products</Typography>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                        labelId="category"
                        value={category}
                        onChange={this.handleCategory}
                    >
                        <MenuItem value="Men">Men</MenuItem>
                        <MenuItem value="Women">Women</MenuItem>
                        <MenuItem value="sport">Sport</MenuItem>
                        <MenuItem value="converse">Converse</MenuItem>
                        <MenuItem value="sandals">Sandals</MenuItem>
                    </Select>
                    <Typography variant="h6">Sort Products by Price</Typography>
                    <InputLabel id="price">Sort</InputLabel>
                    <Select labelId="price" value={price} onChange={this.handlePrice}>
                        <MenuItem value="asc">From Low to High</MenuItem>
                        <MenuItem value="desc">From High to Low</MenuItem>
                    </Select>
                    <Button variant="contained" type="button" onClick={this.handleReset}>
                        Reset Filter
                    </Button>
                </div>
                <div style={styles.cardContainer}>
                    {this.renderCard()}
                </div>
            </div>
        )
    }
}
const styles = {
    root: {
        height: 'auto',
        width: '100%',
        backgroundColor: '#f2f2f2',
        padding: '2% 3%'
    },
    input: {
        padding: "2%",
        display: 'flex',
        justifyContent: 'space-between'
      },
    title: {
        fontSize: 50,
        fontWight: 600,
        margin: '2% 0px'
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    card: {
        flexBasis: '20%',
        minWidth: '300px',
        marginBottom: '2%'
    },
    contentArea: {
        height: '87%',
        padding: '1%'
    },
    contentImage: {
        width: '100%',
        padding: '5%'
    },
    contentAction: {
        height: '13%',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none'
    }
}
const mapStateToProps = (state) => {
    console.log(state)
    return {
        product: state.product
    }
}
export default connect(mapStateToProps, { productAction })(Products)