export const sliderReducer = (state = [],action) => {
    switch(action.type) {
        case 'GET_SLIDER':
            console.log('slider reducer', action.payload)
            return action.payload
        default:
            return state
    }
    // cara if else
    // if (action.type === 'GET_SLIDER') {
    //     return {state = action.payload}
    // } else {
    //     return state
    // }
}