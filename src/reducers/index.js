// Tempat penyimpan data/state global storage
import {combineReducers} from 'redux'
import {userReducer} from './userReducer'
import {sliderReducer} from './sliderReducer'
import {productReducer} from './productReducer'

const Reducers = combineReducers({
    user : userReducer,
    slide : sliderReducer,
    product : productReducer,
})
// combineReducer menghasilkan objek

export default Reducers