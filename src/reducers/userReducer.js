const INITIAL_STATE = {
    id: null,
    username: null,
    email: null,
    role: null,
    cart: []
    //password ga dimasukin krn hanya dipake untuk verifikasi awal
}
// initial state dibuat untuk jaga2 kalo datanya banyak dan datanya berubah2
export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                id: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                role: action.payload.role,
                cart: action.payload.cart
            }
        case 'UPDATE_CART':
            return {
                ...state, cart: action.payload
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        default:
            return state
    }
}