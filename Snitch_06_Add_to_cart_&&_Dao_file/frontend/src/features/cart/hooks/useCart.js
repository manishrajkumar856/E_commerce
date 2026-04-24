import { useDispatch } from "react-redux";
import { addToCart, getCart, removeFromCart, incrementQuantity, decrementQuantity } from "../service/cart.api"
import { setCartItems } from "../state/cart.slice";
import { toast } from "react-toastify";

const useCart = () => {
    const dispatch = useDispatch();


    const handleAddToCart = async ({ productId, variantId, quantity }) => {
        try {
            const data = await addToCart({ productId, variantId, quantity });
            dispatch(setCartItems(data.cart.items));
            toast.success(`Product added to cart! (${data.cart.items.length} items)`);
            return data;
        } catch (error) {
            console.log(error);
            toast.error("Failed to add product to cart");
        }
    }


    const handleGetCart = async () => {
        try {
            const data = await getCart();
            dispatch(setCartItems(data.cart.items));
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveFromCart = async ({ productId, variantId }) => {
        try {
            const data = await removeFromCart({ productId, variantId });
            dispatch(setCartItems(data.cart.items));
            toast.info("Item removed from cart");
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove item");
        }
    }

    const handleIncrementQuantity = async ({ productId, variantId }) => {
        try {
            const data = await incrementQuantity({ productId, variantId });
            dispatch(setCartItems(data.cart.items));
            toast.success("Quantity increased");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update quantity");
        }
    }

    const handleDecrementQuantity = async ({ productId, variantId }) => {
        try {
            const data = await decrementQuantity({ productId, variantId });
            dispatch(setCartItems(data.cart.items));
            toast.success("Quantity decreased");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update quantity");
        }
    }

    return {
        handleAddToCart,
        handleGetCart,
        handleRemoveFromCart,
        handleIncrementQuantity,
        handleDecrementQuantity,
    }
}

export default useCart