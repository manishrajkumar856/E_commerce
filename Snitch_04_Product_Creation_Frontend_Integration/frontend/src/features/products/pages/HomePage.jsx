import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";

const HomePage = () => {
    const { handleGetAllProducts } = useProduct();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    const products = useSelector(state => state.product.products);
    console.log(products);

    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default HomePage;