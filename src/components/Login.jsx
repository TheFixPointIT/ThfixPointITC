import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/Login.css"; // Archivo CSS
import appFirebase from "../credentials"; // Configuración de Firebase
import fixpointLogo from "../assets/fixpointLogo.png";
import { useNavigate } from "react-router-dom";

const auth = getAuth(appFirebase);

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuario autenticado:", user);

        // Asignar roles según el correo electrónico
        if (email === "mmirandac@fixpoint.tecnm.mx") {
          setUserRole("usuario");
        } else if (email === "jefetaller@fixpoint.tecnm.mx") {
          setUserRole("jefe");
          navigate("/homejefetaller");
        } else if (email === "tecnico1@fixpoint.tecnm.mx") {
          setUserRole("tecnico");
          navigate("/hometecnico");
        } else {
          setUserRole("invitado");
        }
      })
      .catch((error) => {
        setError("Error al iniciar sesión: " + error.message);
      });
  };

  return (
    <section className="background-radial-gradient">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="description-container">
              <img
                src={fixpointLogo}
                alt="Fixpoint Logo"
                className="fixpoint-logo"
              />
              <h1 className="display-5 fw-bold">
                Bienvenido a<br />
                <span>TheFixPointIT</span>
              </h1>
              <p>
                Gestor de incidencias para el Tecnológico Nacional de Culiacán.
                Gestiona, sigue y resuelve incidencias de manera eficiente y
                eficaz.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card bg-glass">
              <div className="card-body">
                <h2 className="text-center">Iniciar Sesión</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="login-button">
                    Iniciar Sesión
                  </button>
                </form>
                <p className="forgot-password">¿Olvidaste tu contraseña?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
