import userStore, { Order } from "../../utils/ZustandStore";

const Dispatches = () => {
        const orders = userStore((state) =>
            state.orders,
        );
        return (
            <div>
                <h1>orders</h1>
                <div>
                    {orders.map((order: Order) => (
                        <div key={order.id}>
                            <h2>{order.contractor}</h2>
                            <p>{order.dispatcher}</p>
                            {/* <p>{order.products}</p> */}
                            <p>{order.status}</p>
                            <p>{order.responsible}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
};

    export default Dispatches;