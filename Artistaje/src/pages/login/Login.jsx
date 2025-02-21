import React from "react";
import "./login.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { Login } = useAuth();
  const OnSubmit = handleSubmit((values) => {
    Login(values);
  });
  return (
    <div className="login">
      <form onSubmit={OnSubmit}>
        <h1>Acceder </h1>
        <label>
          <span>Nombre de Usuario</span>
          <input
            {...register("username", { required: true })}
            type="text"
            placeholder="Entra tu Nombre de usuario"
          />
          {errors.username && <p>El nombre de Usuario es requerido</p>}
        </label>
        <label>
          <span>Contraseña</span>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Entra tu Contraseña"
          />
          {errors.password && <p>La cantraseña es requerida</p>}
        </label>
        <button>Iniciar sesión</button>
      </form>
    </div>
  );
}
