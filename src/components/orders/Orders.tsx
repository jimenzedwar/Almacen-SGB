import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import userStore from "../../utils/ZustandStore";


enum OrdersStatusFilter {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Completed = 'Completed',
    All = 'All',
}

const Orders = () => {
    const [status, setStatus] = useState<OrdersStatusFilter>(OrdersStatusFilter.All);
    
    const orders = userStore((state) =>
        state.orders,
      );

     
    return (
        <div className="relative">
            <h1 className="text-2xl font-semibold">Órdenes</h1>
            <div className="flex space-x-2 mt-5">
                <button
                    onClick={() => setStatus(OrdersStatusFilter.All)}
                    className={`px-2 py-1 rounded-lg ${
                        status === OrdersStatusFilter.All
                            ? "bg-primary-100 text-primary-50"
                            : "bg-primary-50 text-primary-100"
                    }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.Pending)}
                    className={`px-2 py-1 rounded-lg ${
                        status === OrdersStatusFilter.Pending
                            ? "bg-primary-100 text-primary-50"
                            : "bg-primary-50 text-primary-100"
                    }`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.InProgress)}
                    className={`px-2 py-1 rounded-lg ${
                        status === OrdersStatusFilter.InProgress
                            ? "bg-primary-100 text-primary-50"
                            : "bg-primary-50 text-primary-100"
                    }`}
                >
                    En progreso
                </button>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.Completed)}
                    className={`px-2 py-1 rounded-lg ${
                        status === OrdersStatusFilter.Completed
                            ? "bg-primary-100 text-primary-50"
                            : "bg-primary-50 text-primary-100"
                    }`}
                >
                    Completadas
                </button>
            </div>
            <div className="mt-5">
            {orders?.map((order) => ( 
                <div key={order.id} className="bg-white p-3 rounded-lg shadow-md">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-semibold">Orden #{order.id}</h2>
                        <p className="text-sm font-semibold">
                            {order.status}
                        </p>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-lg font-semibold">Productos</h3>
                        {/* <ul>
                            {order.products.map((product: any) => (
                                <li key={product.id} className="flex justify-between">
                                    <p>{product.name}</p>
                                    <p>{product.quantity}</p>
                                </li>
                            ))}
                        </ul> */}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
};

    export default Orders;