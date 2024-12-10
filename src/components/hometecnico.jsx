import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../credentials";
import fixpointLogo from "../assets/fixpointLogo.png";

const auth = getAuth(appFirebase);

const HomeTecnico = ({ userEmail }) => {
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      descripcion: "Falla en el servidor principal",
      estado: "asignada",
      tiempoEstimado: "3",
      solucion: "",
      solucionAceptada: false,
    },
    {
      id: 2,
      descripcion: "Error en el sistema de red",
      estado: "asignada",
      tiempoEstimado: "2",
      solucion: "",
      solucionAceptada: false,
    },
  ]);

  const handleAgregarSolucion = (id, solucion) => {
    if (!solucion) {
      alert("Por favor, ingresa una solución antes de enviarla.");
      return;
    }

    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id ? { ...incidencia, solucion } : incidencia
      )
    );

    alert("Solución agregada correctamente.");
  };

  const handleAceptarSolucion = (id) => {
    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id
          ? { ...incidencia, solucionAceptada: true, estado: "completada" }
          : incidencia
      )
    );

    alert("Solución aceptada y trabajo marcado como completado.");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesión exitoso.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src={fixpointLogo} alt="Logo" style={styles.logo} />
        </div>
        <ul style={styles.navList}>
          <button style={styles.menuButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </ul>
      </nav>

      <header style={styles.header}>
        <h1>Bienvenido, Técnico</h1>
        <p>Usuario: {userEmail}</p>
      </header>

      <section style={styles.section}>
        <h2>Incidencias Asignadas</h2>
        {incidencias.filter((incidencia) => incidencia.estado === "asignada")
          .length === 0 ? (
          <p style={styles.noIncidencias}>No tienes incidencias asignadas</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Tiempo Estimado (Horas)</th>
                <th>Solución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias
                .filter((incidencia) => incidencia.estado === "asignada")
                .map((incidencia) => (
                  <tr key={incidencia.id}>
                    <td>{incidencia.id}</td>
                    <td>{incidencia.descripcion}</td>
                    <td>{incidencia.tiempoEstimado}</td>
                    <td>
                      <textarea
                        placeholder="Escribe la solución aquí"
                        value={incidencia.solucion}
                        onChange={(e) =>
                          setIncidencias((prev) =>
                            prev.map((item) =>
                              item.id === incidencia.id
                                ? { ...item, solucion: e.target.value }
                                : item
                            )
                          )
                        }
                        style={styles.textarea}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleAgregarSolucion(
                            incidencia.id,
                            incidencia.solucion
                          )
                        }
                        style={styles.addButton}
                      >
                        Agregar Solución
                      </button>
                      {incidencia.solucion && (
                        <button
                          onClick={() => handleAceptarSolucion(incidencia.id)}
                          style={styles.acceptButton}
                        >
                          Aceptar Trabajo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={styles.section}>
        <h2>Incidencias Completadas</h2>
        {incidencias.filter((incidencia) => incidencia.estado === "completada")
          .length === 0 ? (
          <p style={styles.noIncidencias}>No hay incidencias completadas</p>
        ) : (
          <ul style={styles.list}>
            {incidencias
              .filter((incidencia) => incidencia.estado === "completada")
              .map((incidencia) => (
                <li key={incidencia.id} style={styles.listItem}>
                  <p>
                    <strong>ID:</strong> {incidencia.id}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {incidencia.descripcion}
                  </p>
                  <p>
                    <strong>Solución:</strong> {incidencia.solucion}
                  </p>
                  <p>
                    <strong>Estado:</strong> Completada
                  </p>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
    background: "#f4f6f8",
    color: "#000000",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "px",
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
  },
  navTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "20px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  header: {
    textAlign: "center",
    padding: "20px",
  },
  section: {
    background: "#fff",
    margin: "20px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  textarea: {
    width: "100%",
    height: "60px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "none",
  },
  addButton: {
    background: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  acceptButton: {
    background: "#28a745",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
  noIncidencias: {
    textAlign: "center",
    color: "#777",
  },
  list: {
    listStyle: "none",
    padding: "0",
  },
  listItem: {
    background: "#f5f5f5",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  menuButton: {
    backgroundColor: "#ff0000",
    color: "#fff",
    border: "none",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "16px",
  },
};

export default HomeTecnico;
