import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-black text-slate-900 no-underline">
        <ul className="bg-black h-fit w-fit border-2 border-black">
            <li className="no-underline">
            <Link to="/">Home</Link>
            </li>
            <li>
            <Link to="/about">About</Link>
            </li>
        </ul>
        </nav>
    );
    }

    export default Navbar;