import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#f4f4f4" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Home
        </Link>
        <Link to="/login">Login</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
