export const getSlider = (data) => {
    return{
        type:'GET_SLIDER',
        payload: data //menampung data yg mau dikirim
    }
    // return berupa object makanya pake {}
}