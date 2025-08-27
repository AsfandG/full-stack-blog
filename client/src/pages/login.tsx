import { useState } from "react";
import api from "../axios";
import { useAuth } from "../context/auth-context";

const Login = () => {
  const { setUser } = useAuth();
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
    console.log(response.data.user);
    setUser(response.data.user);
  }
  return (
    <div className="login">
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
    </div>
  );
};

export default Login;
