import userStore, { Product } from "../../utils/ZustandStore";

const Stock = () => {
    const products = userStore((state) =>
        state.products,
    );
    return (
        <div>
            <h1>products</h1>
            <div>
                {products.map((product: Product) => (
                    <div key={product.id}>
                        <h2>{product.product_name}</h2>
                        <p>{product.product_measurement}</p>
                        <p>{product.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

    export default Stock;