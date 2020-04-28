const init_state = {
    id: 0,
    productName: "iPhone 7 Plus",
    price: "",
    category: "",
    image: "",
    desc: "",
};

export default (state = init_state, action) => {
    switch (action.type) {
        case "ON_LOGIN_SUCCESS":
          const { productName, price, image, id ,category,desc} = action.payload;
          return {
            ...state,
            productName,
            price,
            image,
            id,
            category,
            desc
          };
        case "ON_LOGIN_FAIL":
          return { ...state, errMsg: action.payload }
        case "ON_REGISTER_FAIL":
          return { ...state, errMsg: action.payload }
        case "ON_LOGOUT_SUCCESS":
          return { ...init_state }
        default:
          return { ...state }
      }
    if (action.type === "ON_CHANGE_USERNAME") {
        return { ...state, username: action.payload };
    } else if (action.type === "ON_LOGIN_SUCCESS") {
        const { productName, price, category, id, image} = action.payload
        //value dan properti menggunakan nama yang sama username: username
        return {
            ...state,
            productName,
            price,
            category,
            id,
            image,
        }
    }
    return { ...state };
};
