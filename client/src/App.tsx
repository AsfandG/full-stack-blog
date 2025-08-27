import { useState } from "react";

const App = () => {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <div className="container">
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

export default App;
