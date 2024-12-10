import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth"; // Importación correcta
import fixpointLogo from "../assets/fixpointLogo.png";

const auth = getAuth(); // Inicialización correcta

const HomeJefeTaller = ({ userEmail }) => {
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      descripcion: "Falla en el servidor principal",
      estado: "abierta",
      tecnicoAsignado: "",
      tiempoEstimado: "",
      servicio: "",
    },
    {
      id: 2,
      descripcion: "Error en el sistema de red",
      estado: "abierta",
      tecnicoAsignado: "",
      tiempoEstimado: "",
      servicio: "",
    },
  ]);

  const [menuOption, setMenuOption] = useState("incidencias");
  const [catalogoServicios] = useState([
    { id: 1, nombre: "Mantenimiento", duracion: "2 horas" },
    { id: 2, nombre: "Reparación", duracion: "3 horas" },
    { id: 3, nombre: "Diagnóstico", duracion: "1 hora" },
  ]);

  const handleAsignarTecnico = (id, tecnico, servicio, tiempoEstimado) => {
    if (!tecnico || !servicio || !tiempoEstimado) {
      alert("Por favor, completa todos los campos antes de asignar.");
      return;
    }

    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id
          ? {
              ...incidencia,
              tecnicoAsignado: tecnico,
              servicio,
              tiempoEstimado,
              estado: "asignada",
            }
          : incidencia
      )
    );

    alert("Técnico asignado y servicio configurado correctamente.");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesión exitoso.");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div style={styles.container}>
      <nav style={styles.menu}>
        <div style={styles.logoContainer}>
          <img src={fixpointLogo} alt="Logo" style={styles.logo} />
        </div>
        <div style={styles.menuHeader}>
          <h2 style={styles.welcomeText}>Bienvenido, Jefe de Taller</h2>
          <p style={styles.userEmail}>{userEmail}</p>
        </div>
        <button
          style={styles.menuButton}
          onClick={() => setMenuOption("incidencias")}
        >
          Incidencias
        </button>
        <button
          style={styles.menuButton}
          onClick={() => setMenuOption("catalogoServicios")}
        >
          Catálogo de Servicios
        </button>
        <button style={styles.menuButtonOut} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </nav>

      <main style={styles.content}>
        {menuOption === "incidencias" && (
          <div>
            <h2 style={styles.sectionTitle}>Gestión de Incidencias</h2>
            {incidencias.map((incidencia) => (
              <div key={incidencia.id} style={styles.incidenciaCard}>
                <p>
                  <strong>Descripción:</strong> {incidencia.descripcion}
                </p>
                <p>
                  <strong>Estado:</strong> {incidencia.estado}
                </p>
                {incidencia.tecnicoAsignado && (
                  <p>
                    <strong>Técnico Asignado:</strong>{" "}
                    {incidencia.tecnicoAsignado}
                  </p>
                )}
                <label style={styles.label}>Asignar Técnico:</label>
                <input
                  type="text"
                  placeholder="Nombre del técnico"
                  onChange={(e) =>
                    setIncidencias((prev) =>
                      prev.map((item) =>
                        item.id === incidencia.id
                          ? { ...item, tecnicoAsignado: e.target.value }
                          : item
                      )
                    )
                  }
                  style={styles.input}
                />
                <label style={styles.label}>Servicio:</label>
                <select
                  onChange={(e) =>
                    setIncidencias((prev) =>
                      prev.map((item) =>
                        item.id === incidencia.id
                          ? { ...item, servicio: e.target.value }
                          : item
                      )
                    )
                  }
                  style={styles.select}
                >
                  <option value="">Selecciona un servicio</option>
                  {catalogoServicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.nombre}>
                      {servicio.nombre} - {servicio.duracion}
                    </option>
                  ))}
                </select>
                <label style={styles.label}>Tiempo Estimado:</label>
                <input
                  type="text"
                  placeholder="Tiempo estimado (ej. 2 horas)"
                  onChange={(e) =>
                    setIncidencias((prev) =>
                      prev.map((item) =>
                        item.id === incidencia.id
                          ? { ...item, tiempoEstimado: e.target.value }
                          : item
                      )
                    )
                  }
                  style={styles.input}
                />
                <button
                  style={styles.assignButton}
                  onClick={() =>
                    handleAsignarTecnico(
                      incidencia.id,
                      incidencia.tecnicoAsignado,
                      incidencia.servicio,
                      incidencia.tiempoEstimado
                    )
                  }
                >
                  Asignar Técnico
                </button>
              </div>
            ))}
          </div>
        )}

        {menuOption === "catalogoServicios" && (
          <div>
            <h2 style={styles.sectionTitle}>Catálogo de Servicios</h2>
            {catalogoServicios.map((servicio) => (
              <div key={servicio.id} style={styles.servicioCard}>
                <p>
                  <strong>Servicio:</strong> {servicio.nombre}
                </p>
                <p>
                  <strong>Duración Estimada:</strong> {servicio.duracion}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f0f4f8",
    color: "#000000",
  },
  menu: {
    width: "300px",
    backgroundColor: "#007bff",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
  },
  menuHeader: {
    marginBottom: "20px",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  userEmail: {
    fontSize: "14px",
  },
  menuButtonOut: {
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
  menuButton: {
    backgroundColor: "#0056b3",
    color: "#fff",
    border: "none",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "16px",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "120px",
    marginBottom: "20px",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  incidenciaCard: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  label: {
    fontWeight: "bold",
    margin: "10px 0 5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  assignButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    marginTop: "10px",
    fontSize: "16px",
  },
  servicioCard: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default HomeJefeTaller;
