import React from "react";
import Slider from "react-slick";
import Axios from 'axios'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { IconButton } from '@material-ui/core'
import { connect } from 'react-redux'
import { getSlider } from '../actions'


// const URL = 'http://localhost:2000/'

class SimpleSlider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        Axios.get('http://localhost:2000/slider')
            .then(response => {
                this.props.getSlider(response.data)
                // this.setState({ data: response.data })
            })
            .catch(error => console.log(error))
    }
    renderSlider = () => {
            return this.props.slide.map((item, index) => {
                return (
                    <div key={index}>
                        <div style={{ background: `url(${item.images}) no-repeat center`, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <h1>{item.title}</h1>
                        </div>
                    </div>
                )
            })
    }
    render() {
        console.log("MapStateToprops", this.props.slide)
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
        return (
            <div style={styles.root}>
                <Slider {...settings} style={styles.slider}>
                    {this.renderSlider()}
                </Slider>
            </div>
        )
    }
}
const styles = {
    root: {
        height: '100vh',
        width: '100%'
    },
    slider: {
        height: '100%',
        width: '100%',
        position: 'relative'
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
const mapStateToProps = (state) => {
    // mapStateToProps -> define data apa aja yg mau diambil
    // state isinya semua data di reducer yg berupa object, makanya line 120 jadi state.slide
    console.log(state)
    return {
        slide: state.slide
    }
}
export default connect(mapStateToProps, { getSlider })(SimpleSlider)
// syntax connect : ((mapStateToProps (fungsi untuk ambil data)), {action})(Component)
// kalo gamau ambil data apa2 bisa ditulis connect(null, {action})(Component)