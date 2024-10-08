import SignUpForm from "../../utils/SignUpForm";
import userStore, { User } from "../../utils/ZustandStore";

const Users = () => {
    const Users = userStore((state) =>
        state.users,
    );
    return (
        <div>
            <h1>Usuarios</h1>
            <div>
                {Users.map((user: User) => (
                    <div key={user.id}>
                        <h2>{user.full_name}</h2>
                        <p>{user.identification}</p>
                        <p>{user.role}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

    export default Users;