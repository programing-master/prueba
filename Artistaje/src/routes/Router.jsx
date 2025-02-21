import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "../layouts/Layout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import AdminLayout from "../layouts/AdminLayout";
import TaskPage from "../pages/TaskPage/TaskPage";
import AddTaskPage from "../pages/AddTaskPage/AddTaskPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas Privadas */}
          <Route element={<AdminLayout />}>
            <Route path="task-page" element={<TaskPage />} />
            <Route path="add-task" element={<AddTaskPage />} />
            <Route path="add-task/:id" element={<AddTaskPage />} />
          </Route>
       
      </Routes>
    </BrowserRouter>
  );
}
