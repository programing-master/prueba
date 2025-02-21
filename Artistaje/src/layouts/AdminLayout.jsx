import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./admin.css";
export default function AdminLayout() {
  const links = [
    {
      name: "Agregar Producto",
      link: "/add-task",
    },
    {
      name: "Mis Productos",
      link: "/task-page",
    },
    {
      name: "Salir",
      link: "/",
    },
  ];

  return (
    <div className="container">
      <header className="nav">
        <ul>
          {links.map((item, index) => (
            <Link className="link" key={index} to={item.link}>
              {item.name}
            </Link>
          ))}
        </ul>
        
      </header>
      <Outlet />
    </div>
  );
}
