import { useEffect, useState } from "react";
import api from "../axios";
import { useAuth } from "../context/auth-context";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

const Home = () => {
  const { user } = useAuth();
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleDelete(id: string) {
    try {
      await api.delete(`/users/${id}`);
      setSuccess(true);
    } catch (error) {
      setError(true);
      console.log("error >>>", error);
    }
  }

  useEffect(() => {
    fetchUsers();

    async function fetchUsers() {
      try {
        const response = await api.get<UsersResponse>("/users");
        setUserList(response.data.users);
      } catch (error) {
        console.log("error >>>", error);
      }
    }
  }, [userList]);
  return (
    <div>
      <div className="user">
        <span>
          Welcom to the <b> {user?.role === "admin" ? "Admin" : "User"}</b>{" "}
          dashboard{" "}
        </span>

        <div>{user?.name}</div>

        <div>
          {userList.map((user) => (
            <button key={user._id} onClick={() => handleDelete(user._id)}>
              Delete {user.name}
            </button>
          ))}
        </div>

        <div>
          {error && (
            <span className="error">
              You are not allowed to delete the user!
            </span>
          )}
        </div>
        <div>
          {success && (
            <span className="success">User has been deleted successfully</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
