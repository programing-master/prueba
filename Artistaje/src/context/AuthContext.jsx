import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar si existe el usuario
  const checkUserExists = async (email) => {
    try {
      const { data } = await supabase
        .from("usuarios")
        .select("username")
        .eq("username", email)
        .single();

      return data !== null;
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      return false;
    }
  };

  // Función para iniciar sesión con OTP
  const Login = async (values) => {
    try {
      setLoading(true);
      setError(null);

      // Primero verificar si existe el usuario
      const userExists = await checkUserExists(values.username);
      if (!userExists) {
        alert("Usuario no encontrado. Por favor, regístrate primero.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: values.username,
        options: {
          redirectTo: window.location.origin + "/verify-otp",
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) {
        throw error;
      }

      alert("¡Correo enviado! Revisa tu bandeja de entrada");
      return true;
    } catch (error) {
      setError(error.error_description || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar el OTP
  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.verifyOtp({
        type: "email",
        email,
        token: otp,
        options: {
          redirectTo: window.location.origin + "/task-page",
        },
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        setUser(data.session.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      setError(error.error_description || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      setError(error.error_description || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Primero obtener la sesión actual
        const { data } = await supabase.auth.getSession();

        // Verificar si hay una sesión activa
        if (data?.session) {
          setUser(data.session.user);
          setIsAuthenticated(true);
        } else {
          // Si no hay sesión, intentar obtener el usuario actual
          const { data: currentUser } = await supabase.auth.getUser();
          if (currentUser?.user) {
            setUser(currentUser.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Error al inicializar la sesión:", error);
        setError(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Suscribirse a cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        Login,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
