import { useNavigate } from "react-router-dom";
import SignUpForm from "../../utils/SignUpForm";
import userStore, { User } from "../../utils/ZustandStore";

const Users = () => {
    const Users = userStore((state) =>
        state.users,
    );

    const navigate = useNavigate();
    return (
        <div className="relative w-full font-Manrope text-text-50">
        <p className="text-2xl text-text-50 border-b p-3">Usuarios</p>
        <div className="grid mt-5 lg:p-5 mx-5 sm:grid-cols-2 xl:grid-cols-3 justify-center">
        <button className="lg:hidden flex bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white font-Manrope items-center justify-center w-fit p-10 rounded-lg shadow-md m-4 ">
                <span className="icon-[icons8--plus] text-xl mx-1 "></span>
                Agregar usuario
                </button>
                {Users.map((user: User) => (
                    <div className="bg-white text-text-50 font-Manrope hover:bg-gray-100 p-3 rounded-lg shadow-md m-4 w-56" key={user.id} onClick={()=> navigate(`/user/${user.id}`)}>
                        <p className="text-lg">{user.full_name}</p>
                        <p className="text-text-100 text-sm">{user.identification}</p>
                        <p className=" text-xs text-text-100 text-end">{user.role === "user" ? "Despachador" : "Administrador"}</p>
                    </div>
                ))}
        <button onClick={()=>navigate("/newUser")} className="hidden lg:flex bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white font-Manrope items-center justify-center w-fit p-10 rounded-lg shadow-md m-4 ">
                <span className="icon-[icons8--plus] text-xl mx-1 "></span>
                Agregar usuario
                </button>
        </div>
        </div>
    )
};

    export default Users;