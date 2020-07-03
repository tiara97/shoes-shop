import React from 'react'
import SimpleSlider from '../components/carousel'
import Products from '../components/products'

const URL = 'http://localhost:2000/'

class Homepage extends React.Component {
    render () {
        // console.log(this.props.location)
        // this.props.location ini cmn mau ngasih tau lokasi kita dimana
        return (
            <div>
                <SimpleSlider/>
                <Products/>
            </div>
        )
    }
}
export default Homepage