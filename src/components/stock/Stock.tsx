import { useState, useMemo, useCallback } from "react";
import userStore, { Product } from "../../utils/ZustandStore";
import { useNavigate } from "react-router-dom";

const Stock = () => {
    const products = userStore((state) => state.products);
    const [searchText, setSearchText] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const navigate = useNavigate();

    const filteredProducts = useMemo(() => {
        const searchLower = searchText.toLowerCase();
        return products.filter(product => 
            product.id.toString().toLowerCase().includes(searchLower) ||
            product.product_name.toLowerCase().includes(searchLower)
        );
    }, [products, searchText]);

    const productsPerPage = 10;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentProducts = useMemo(() => {
        return filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
    }, [filteredProducts, currentPage, productsPerPage]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    return (
        <div className="relative w-full font-Manrope text-text-50">
            <p className="text-2xl text-text-50 border-b p-3">Stock</p>
            <div className="flex space-x-2 mt-5 p-5 justify-between mx-5">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-2 py-1 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
                />
                <button className="bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white rounded-lg p-2 text-lg flex items-center" onClick={() => navigate("/newProduct")}>
                    <span className="icon-[icons8--plus] text-xl mx-1 "></span>
                    <span className="hidden sm:block">Agregar producto</span>
                </button>
            </div>
            <div className="m-5 bg-white rounded-lg grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 text-text-100 grid">
                <p className="p-3 text-sm hidden sm:block">Id</p>
                <p className="p-3 lg:p-0 py-3 text-sm">Producto</p>
                <p className="py-3 text-sm">Cantidad</p>
                <p className="py-3 text-sm hidden lg:block">Medida</p>
                <span className="border-b col-span-5 block mx-4"></span>
                {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white col-span-4 text-text-50 hover:bg-gray-100" onClick={() => navigate(`/product/${product.id}`)}>
                        <div className="justify-between grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 py-3 items-center">
                            <h2 className="text-lg px-3 hidden sm:block">{product.id}</h2>
                            <div className="flex items-center ml-3 lg:ml-0">
                                <img src={product.photo} alt="" className="mr-3 rounded-lg aspect-square w-14 object-center" />
                                <p className="text-sm">
                                    {product.product_name}
                                </p>
                            </div>
                            <p className="text-sm">
                                {product.quantity}
                            </p>
                            <p className="text-sm hidden lg:block">
                                {product.product_measurement}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center p-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"}`}
                >
                    <span className="icon-[solar--round-arrow-left-linear] text-2xl flex items-center"></span>
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"}`}
                >
                  <span className="icon-[solar--round-arrow-right-linear] text-2xl flex items-center"></span>
                </button>
            </div>
        </div>
    );
};

export default Stock;