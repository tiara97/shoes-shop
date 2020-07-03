import React from 'react'
import Axios from 'axios'
import {Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, Button} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { productAction } from '../actions'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount () {
        Axios.get('http://localhost:2000/products')
            .then(response => {
                this.props.productAction(response.data)
                // this.setState({ data: response.data })
            })
            .catch(error => console.log(error))
    }
    renderCard = () => {
        if (this.props.product !== null) {
            return this.props.product.map((item,index) => {
                return (
                    <Card style={styles.card} key={index}>
                      <CardActionArea style={styles.contentArea}>
                        <CardMedia image={item.images[0]} component='img' style={styles.contentImage}/>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.name}
                          </Typography>
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
    render () {
        console.log("MapStateToprops", this.props.product)
        return (
            <div style={styles.root}>
                <h1 style={styles.title}>Products</h1>
                <div style={styles.cardContainer}>
                    {this.renderCard()}
                </div>
            </div>
        )
    }
}
const styles = {
    root : {
        height : 'auto',
        width : '100%',
        backgroundColor : '#f2f2f2',
        padding : '2% 3%'
    },
    title : {
        fontSize : 50,
        fontWight : 600,
        margin : '2% 0px'
    },
    cardContainer : {
        width : '100%',
        display : 'flex',
        flexWrap : 'wrap',
        justifyContent : 'space-between'
    },
    card : {
        flexBasis : '20%',
        minWidth : '300px',
        marginBottom : '2%'
    },
    contentArea : {
        height : '87%',
        padding : '1%'
    },
    contentImage : {
        width : '100%',
        padding : '5%'
    },
    contentAction : {
        height : '13%',
        alignItems : 'center'
    },
    link : {
        textDecoration :'none'
    }
}
const mapStateToProps = (state) => {
    console.log(state)
    return {
        product: state.product
    }
}
export default connect(mapStateToProps, { productAction })(Products)