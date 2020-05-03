const init_state = {
    productName: "",
    price: 0,
    category: "",
    image: "",
    desc: "",
    id: 0,
}

export default (state = init_state, action) => {
    if (action.type === "ON_CHANGE_USERNAME") {
        return { ...state, productName: action.payload };
    }
    return { ...state }
}
