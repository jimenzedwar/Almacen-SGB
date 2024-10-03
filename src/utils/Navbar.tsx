import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-primary-50 fixed bottom-0 p-3 w-full lg:top-0 lg:h-full lg:w-fit text-xl ssm:p-5 2xl:p-6 text-text-100 font-Manrope shadow-md">
        <ul className="relative flex justify-around lg:grid ">
            <li className="no-underline grid lg:flex lg:space-x-3 justify-items-center text-sm ssm:text-lg lg:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
            <span className= "top-0.5 lg:text-xl ssm:text-2xl relative icon-[icon-park-outline--transaction-order]"></span>
            <Link to="/orders">Ordenes</Link>
            </li>
            <li className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
            <span className= "top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--box-linear]"></span>
            <Link to="/stock">Stock</Link>
            </li>
            <li className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
            <span className= "top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--users-group-rounded-line-duotone]"></span>
            <Link to="/users">Usuarios</Link>
            </li>
            <li className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
            <span className= "top-0.5 lg:text-xl ssm:text-2xl relative icon-[hugeicons--truck-delivery]"></span>
            <Link to="/dispatches">Despachos</Link>
            </li>
        </ul>
        </nav>
    );
    }

    export default Navbar;
