import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";  // Import cartSlice

export const store = configureStore({
  reducer: {
    cart: cartReducer,  // Ensure cart is registered
  },
});

export default store;
