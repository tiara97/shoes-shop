import React from 'react'
import Axios from 'axios'
import Navbar from './components/navbar'
import Homepage from './pages/homepage'
import { Route, Switch } from 'react-router-dom'
import './index.css'
import Footer from './components/footer'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Login from './pages/login'
import NotFound from './pages/404'
import Register from './pages/register'
import UserHistory from './pages/userHistory'
import UserProfile from './pages/userProfile'
import ProductDetail from './pages/productDetail'
import UserCart from './pages/userCart'
import AdminTransaction from './pages/adminDashboard'
import { connect } from 'react-redux'
import { LogIn } from './actions'

class App extends React.Component {
    componentDidMount() {
        // keep login
        Axios.get(`http://localhost:2000/users?id=${localStorage.getItem('id')}`)
            .then(response => {
                this.props.LogIn(response.data[0])
            })
            .catch(error => console.log(error))
    }
    render() {
        console.log(this.props.role)
        if (this.props.role === 'admin') {
            return (
                <div>
                <Navbar />
                <Switch>
                    <Route path='/' component={Homepage} exact />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path="/adminDashboard" component={AdminTransaction} />
                    <Route path='*' component={NotFound} />
                </Switch>
                <Footer />
                </div>
            )
        } else {
            return (
                <div>
                    <Navbar />
                    <Switch>
                        <Route path='/' component={Homepage} exact />
                        <Route path='/login' component={Login} />
                        <Route path='/register' component={Register} />
                        <Route path='/profile' component={UserProfile} />
                        <Route path='/cart' component={UserCart} />
                        <Route path='/history' component={UserHistory} />
                        <Route path='/details' component={ProductDetail} />
                        <Route path='*' component={NotFound}/>
                    </Switch>
                    <Footer />
                </div>
            )
        }
    }
}
const mapStateToProps = (state) => {
    console.log(state.user)
    return {
      role: state.user.role
    }
  }
export default connect(mapStateToProps, { LogIn })(App)