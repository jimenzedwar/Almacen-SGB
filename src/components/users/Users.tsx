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
        <div className="flex space-x-2 mt-5 p-5 justify-center lg:justify-between mx-5">
            <div>
                {Users.map((user: User) => (
                    <div className="bg-white text-text-50 font-Manrope hover:bg-gray-100 p-3 rounded-lg shadow-md mt-4" key={user.id} onClick={()=> navigate(`/user/${user.id}`)}>
                        <h2>{user.full_name}</h2>
                        <p>{user.identification}</p>
                        <p>{user.role}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    )
};

    export default Users;