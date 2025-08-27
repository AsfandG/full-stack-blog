import { useEffect, useState } from "react";
import api from "./axios";

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

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await api.post("/auth/login", formData);
    setUser(response.data.user);
    localStorage.setItem("token", response.data.accessToken);
  }

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
    <div className="container">
      <div className="login">
        {user ? (
          <div className="user">
            <span>
              Welcom to the <b> {user.role === "admin" ? "Admin" : "User"}</b>{" "}
              dashboard{" "}
            </span>

            <div>{user.name}</div>

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
                <span className="success">
                  User has been deleted successfully
                </span>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={formData.email}
              placeholder="Email"
              className="input"
              name="email"
              onChange={handleChange}
            />
            <br />
            <input
              type="text"
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              className="input"
            />
            <br />
            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
