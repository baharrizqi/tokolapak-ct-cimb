const init_state = {
    id: 0,
    qty: "",
};

export default (state = init_state, action) => {
    switch (action.type) {
        case ON_LOGIN_SUCCESS:
            const { quantity, userId, productId } = action.payload;
            return {
                ...state,
                quantity,
                userId,
                productId,
            };
        default:
            return { ...state }
    }
}
