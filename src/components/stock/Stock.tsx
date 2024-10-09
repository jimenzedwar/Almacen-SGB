import { useState } from "react";
import userStore, { Product } from "../../utils/ZustandStore";
import { useNavigate } from "react-router-dom";

const Stock = () => {
    const products = userStore((state) =>
        state.products,
)
    const [searchText, setSearchText] = useState<string>("");
    
    const Navigate = useNavigate();

    const filteredProducts = products.filter(order => {
        const searchLower = searchText.toLowerCase();
        return (
            (order.id.toString().toLowerCase().includes(searchLower) ||
            order.product_name.toLowerCase().includes(searchLower)
        ));
    });


    return (
        <div className="relative w-full font-Manrope text-text-50">
            <p className="text-2xl text-text-50 border-b p-3">Stock</p>
            <div className="flex space-x-2 mt-5 p-5 justify-center lg:justify-between mx-5">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-2 py-1 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
                />
            </div>
            <div className="m-5 bg-white rounded-lg grid-cols-4 text-text-100 hidden lg:grid ">
                <p className="p-3 text-sm">Id</p>
                <p className="py-3 text-sm">Producto</p>
                <p className="py-3 text-sm">Cantidad</p>
                <p className="py-3 text-sm">Medida</p>
                <span className=" border-b col-span-5 block mx-4"></span>
            {filteredProducts.map((product) => ( 
                <div key={product.id} className="bg-white col-span-4 text-text-50 hover:bg-gray-100" onClick={()=> Navigate(`/product/${product.id}`)}>
                    <div className=" justify-between grid grid-cols-4 py-3">
                        <h2 className="text-lg px-3">{product.id}</h2>
                        <div>
                        <p className="text-sm">
                            {product.photo}
                        </p>
                        <p className="text-sm ">
                            {product.product_name}
                        </p>
                        </div>
                        <p className="text-sm">
                            {product.quantity}
                        </p>
                        <p className="text-sm">
                            {product.product_measurement}
                        </p>
                    </div>
                </div>
            ))}
            </div>
            {/* <div className="lg:hidden p-4">{pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div key={order.id} className="bg-white text-text-50 font-Manrope hover:bg-gray-100 p-3 rounded-lg shadow-md mt-4" onClick={() => Navigate(`/order/${order.id}`)}>
              <div className="grid">
                <p className="text-sm text-text-100">Orden #{order.id}</p>
                <p className="text-sm mt-3">
                  {order.contractor}
                </p>
                <p className={`justify-self-end w-fit rounded-full px-2 py-1 ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>No hay ordenes pendientes</p>
          </div>
        )}
            </div> */}
        </div>
    )
};


    export default Stock;