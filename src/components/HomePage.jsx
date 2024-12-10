import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../credentials";
import fixpointLogo from "../assets/fixpointLogo.png";

const auth = getAuth(appFirebase);

const HomePage = ({ userEmail, userRole }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEdificio, setSelectedEdificio] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);

  const [nuevoElemento, setNuevoElemento] = useState({
    nombre: "",
    tipo: "",
    caracteristicas: {},
  });
  const [feedback, setFeedback] = useState("");

  // Validación de permisos según el rol
  const isAdmin = userRole === "admin";
  const isTechnician = userRole === "tecnico";
  const isUser = userRole === "usuario";

  const handleAsignarIncidencia = (id, tecnico) => {
    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id
          ? { ...incidencia, tecnico, estado: "asignada" }
          : incidencia
      )
    );
  };

  const handleActualizarEstado = (id, estado, diagnostico) => {
    setIncidencias((prev) =>
      prev.map((incidencia) =>
        incidencia.id === id
          ? { ...incidencia, estado, diagnostico }
          : incidencia
      )
    );
  };

  const handleEnviarFeedback = (id, feedback) => {
    console.log(`Feedback para incidencia ${id}: ${feedback}`);
    setFeedback(""); // Limpia el feedback
  };
  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => {
    setModalVisible(false);
    setNuevoElemento({
      nombre: "",
      tipo: "",
      caracteristicas: {},
    });
  };
  // Gestión de problemas
  const [problemas, setProblemas] = useState([]);
  const [errorConocido, setErrorConocido] = useState({
    incidenciaId: null,
    causaRaiz: "",
    errorConocido: "",
    solucion: "",
    rfcRequerido: false,
    fechaIngreso: "",
    fechaResolucion: "",
    tecnicoAsignado: "",
  });

  // Funciones para la gestión de problemas
  const registrarProblema = () => {
    if (
      !errorConocido.incidenciaId ||
      !errorConocido.causaRaiz ||
      !errorConocido.errorConocido
    ) {
      alert("Completa todos los campos requeridos");
      return;
    }

    const incidenciaSeleccionada = incidencias.find(
      (incidencia) => incidencia.id === errorConocido.incidenciaId
    );

    setProblemas((prev) => [
      ...prev,
      {
        ...errorConocido,
        fechaIngreso: incidenciaSeleccionada
          ? incidenciaSeleccionada.fechaIngreso
          : "",
        fechaResolucion: new Date().toISOString().split("T")[0],
      },
    ]);

    setErrorConocido({
      incidenciaId: null,
      causaRaiz: "",
      errorConocido: "",
      solucion: "",
      rfcRequerido: false,
      fechaIngreso: "",
      fechaResolucion: "",
      tecnicoAsignado: "",
    });
    alert("Problema registrado correctamente");
  };

  const handleAgregarElemento = () => {
    agregarElemento(selectedEdificio, selectedSalon);
    cerrarModal();
  };

  const renderCaracteristicasCampos = () => {
    const tipo = nuevoElemento.tipo;

    switch (tipo) {
      case "Equipo informático":
        return (
          <>
            <input
              type="text"
              placeholder="Marca"
              value={nuevoElemento.caracteristicas.marca || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    marca: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Modelo"
              value={nuevoElemento.caracteristicas.modelo || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    modelo: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Procesador"
              value={nuevoElemento.caracteristicas.procesador || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    procesador: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="RAM"
              value={nuevoElemento.caracteristicas.ram || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    ram: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Sistema Operativo"
              value={nuevoElemento.caracteristicas.sistemaOperativo || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    sistemaOperativo: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
          </>
        );
      case "Mobiliario":
        return (
          <>
            <input
              type="text"
              placeholder="Material"
              value={nuevoElemento.caracteristicas.material || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    material: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Color"
              value={nuevoElemento.caracteristicas.color || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    color: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Dimensiones"
              value={nuevoElemento.caracteristicas.dimensiones || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    dimensiones: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
          </>
        );
      case "Audiovisual":
        return (
          <>
            <input
              type="text"
              placeholder="Marca"
              value={nuevoElemento.caracteristicas.marca || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    marca: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Modelo"
              value={nuevoElemento.caracteristicas.modelo || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    modelo: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Resolución"
              value={nuevoElemento.caracteristicas.resolucion || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    resolucion: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Luminosidad"
              value={nuevoElemento.caracteristicas.luminosidad || ""}
              onChange={(e) =>
                setNuevoElemento((prev) => ({
                  ...prev,
                  caracteristicas: {
                    ...prev.caracteristicas,
                    luminosidad: e.target.value,
                  },
                }))
              }
              style={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Módulo de Localidades
  const [currentSection, setCurrentSection] = useState("localidades");
  // Módulo de Localidades

  const eliminarSolicitud = (folio) => {
    setSolicitudes(
      solicitudes.filter((solicitud) => solicitud.folio !== folio)
    );
  };
  const [edificios, setEdificios] = useState([
    {
      id: 1,
      nombre: "Edificio A",
      descripcion: "Ubicación: Centro del campus",
      salones: [
        {
          id: 1,
          nombre: "A1 - Aula de Clases",
          elementos_configuracion: [
            {
              id: 1,
              nombre: "Computadora A",
              tipo: "PC",
              caracteristicas: { procesador: "Intel i5", ram: "8GB" },
              estado: "activo",
            },
          ],
        },
      ],
    },
  ]);

  const [solicitudes, setSolicitudes] = useState([]);
  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    descripcion: "",
    salon: null,
    elementosAfectados: [],
    estado: "abierta",
    tecnico: "",
  });

  // Estado de localidades
  const [nuevoEdificio, setNuevoEdificio] = useState({
    nombre: "",
    descripcion: "",
  });
  const [nuevoSalon, setNuevoSalon] = useState("");

  // Almacenamiento de órdenes de trabajo
  const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [orderVisible, setOrderVisible] = useState(false);

  // Manejo de secciones
  const cambiarSeccion = (seccion) => {
    setCurrentSection(seccion);
  };

  // Módulo de Localidades
  const agregarEdificio = () => {
    if (nuevoEdificio.nombre && nuevoEdificio.descripcion) {
      setEdificios([
        ...edificios,
        {
          id: edificios.length + 1,
          nombre: nuevoEdificio.nombre,
          descripcion: nuevoEdificio.descripcion,
          salones: [],
        },
      ]);
      setNuevoEdificio({ nombre: "", descripcion: "" });
    }
  };

  const agregarSalon = (idEdificio) => {
    const nuevosEdificios = edificios.map((edificio) => {
      if (edificio.id === idEdificio && nuevoSalon) {
        return {
          ...edificio,
          salones: [
            ...edificio.salones,
            {
              id: edificio.salones.length + 1,
              nombre: nuevoSalon,
              elementos_configuracion: [],
            },
          ],
        };
      }
      return edificio;
    });
    setEdificios(nuevosEdificios);
    setNuevoSalon("");
  };

  const agregarElemento = (idEdificio, idSalon) => {
    const nuevosEdificios = edificios.map((edificio) => {
      if (edificio.id === idEdificio) {
        return {
          ...edificio,
          salones: edificio.salones.map((salon) => {
            if (salon.id === idSalon) {
              return {
                ...salon,
                elementos_configuracion: [
                  ...salon.elementos_configuracion,
                  {
                    id: salon.elementos_configuracion.length + 1,
                    nombre: nuevoElemento.nombre,
                    tipo: nuevoElemento.tipo,
                    caracteristicas: { ...nuevoElemento.caracteristicas },
                    estado: "activo",
                  },
                ],
              };
            }
            return salon;
          }),
        };
      }
      return edificio;
    });

    setEdificios(nuevosEdificios);

    setNuevoElemento({
      nombre: "",
      tipo: "",
      caracteristicas: {},
    });
  };
  const toggleElementosSalon = (idEdificio, idSalon) => {
    const nuevosEdificios = edificios.map((edificio) => {
      if (edificio.id === idEdificio) {
        return {
          ...edificio,
          salones: edificio.salones.map((salon) => {
            if (salon.id === idSalon) {
              return {
                ...salon,
                mostrarElementos: !salon.mostrarElementos,
              };
            }
            return salon;
          }),
        };
      }
      return edificio;
    });
    setEdificios(nuevosEdificios);
  };
  const handleOrderClick = (solicitud) => {
    setSelectedIncidencia(solicitud);
    setOrderVisible(true);
  };

  const enviarOrden = () => {
    const nuevaOrden = {
      folio: selectedIncidencia.folio,
      tipoMantenimiento: nuevaIncidencia.descripcion,
      asignarPersona: nuevaIncidencia.tecnico,
    };
    setOrdenesTrabajo([...ordenesTrabajo, nuevaOrden]);
    setOrderVisible(false);
  };

  // Módulo de Incidencias y Solicitudes
  const crearIncidencia = () => {
    if (
      nuevaIncidencia.salon &&
      nuevaIncidencia.elementosAfectados.length > 0 &&
      nuevaIncidencia.descripcion
    ) {
      const nuevaSolicitud = {
        folio: solicitudes.length + 1,
        salon: nuevaIncidencia.salon,
        elementos: nuevaIncidencia.elementosAfectados,
        descripcion: nuevaIncidencia.descripcion,
      };
      setSolicitudes([...solicitudes, nuevaSolicitud]);

      setIncidencias([
        ...incidencias,
        { ...nuevaIncidencia, id: incidencias.length + 1 },
      ]);
      setNuevaIncidencia({
        descripcion: "",
        salon: null,
        elementosAfectados: [],
        estado: "abierta",
        tecnico: "",
      });
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuario desconectado");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      descripcion: "Falla en el servidor",
      estado: "abierta",
      tecnico: "",
    },
    {
      id: 2,
      descripcion: "Problema de red",
      estado: "terminada",
      tecnico: "tecnico1",
    },
    {
      id: 3,
      descripcion: "Error en la aplicación",
      estado: "asignada",
      tecnico: "tecnico2",
    },
  ]);

  //Modulos
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logoContainer}>
          <img src={fixpointLogo} alt="Logo" style={styles.logo} />
        </div>
        <button
          style={{
            ...styles.navButton,
            ...(currentSection === "localidades" ? styles.navButtonActive : {}),
          }}
          onClick={() => cambiarSeccion("localidades")}
        >
          Localidades
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(currentSection === "incidencias" ? styles.navButtonActive : {}),
          }}
          onClick={() => cambiarSeccion("incidencias")}
        >
          Incidencias
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(currentSection === "solicitudes" ? styles.navButtonActive : {}),
          }}
          onClick={() => cambiarSeccion("solicitudes")}
        >
          Solicitudes
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(currentSection === "problemas" ? styles.navButtonActive : {}),
          }}
          onClick={() => setCurrentSection("problemas")}
        >
          Problemas
        </button>
        <button
          style={styles.navButton}
          onClick={() => setCurrentSection("gestion")}
        >
          Gestión
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(currentSection === "tecnico" ? styles.navButtonActive : {}),
          }}
          onClick={() => setCurrentSection("tecnico")}
        >
          Tareas
        </button>
        <button
          style={styles.navButton}
          onClick={() => setCurrentSection("evaluaciones")}
        >
          Evaluaciones
        </button>

        <button style={styles.navButton} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </nav>
      {currentSection === "gestion" && isAdmin && (
        <div>
          <h2>Gestión de Incidencias</h2>
          {incidencias.length > 0 ? (
            incidencias.map((incidencia) => (
              <div key={incidencia.id}>
                <p>{incidencia.descripcion}</p>
                <button
                  onClick={() =>
                    handleAsignarIncidencia(incidencia.id, "tecnico1")
                  }
                >
                  Asignar a Técnico
                </button>
              </div>
            ))
          ) : (
            <p>No hay incidencias para gestionar.</p>
          )}
        </div>
      )}

      {currentSection === "tecnico" && (
        <div>
          <h2
            style={{
              textAlign: "center",
              color: "#004aad",
              marginBottom: "20px",
            }}
          >
            Mis Tareas
          </h2>
          <div style={styles.tareasContainer}>
            {incidencias.length > 0 ? (
              incidencias.map((incidencia) => (
                <div key={incidencia.id} style={styles.tareaContainer}>
                  <p>
                    <strong>Descripción:</strong> {incidencia.descripcion}
                  </p>
                  <p>
                    <strong>Estado:</strong> {incidencia.estado}
                  </p>
                  <label>Prioridad:</label>
                  <select
                    value={incidencia.prioridad || ""}
                    onChange={(e) =>
                      handleActualizarEstado(incidencia.id, incidencia.estado, {
                        prioridad: e.target.value,
                      })
                    }
                    style={styles.select}
                  >
                    <option value="">Seleccione prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>

                  <label>Catálogo de Servicios:</label>
                  <select
                    value={incidencia.servicio || ""}
                    onChange={(e) =>
                      handleActualizarEstado(incidencia.id, incidencia.estado, {
                        servicio: e.target.value,
                      })
                    }
                    style={styles.select}
                  >
                    <option value="">Seleccione un servicio</option>
                    <option value="Diagnóstico">Diagnóstico - 1 hora</option>
                    <option value="Reparación">Reparación - 3 horas</option>
                    <option value="Mantenimiento">
                      Mantenimiento - 2 horas
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      handleActualizarEstado(
                        incidencia.id,
                        "en proceso",
                        `Prioridad: ${
                          incidencia.prioridad || "Sin asignar"
                        }, Servicio: ${incidencia.servicio || "No definido"}`
                      )
                    }
                    style={styles.actionButton}
                  >
                    Actualizar Estado
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#888" }}>No hay incidencias registradas.</p>
            )}
          </div>
        </div>
      )}

      <div style={styles.content}>
        {currentSection === "localidades" && (
          <div style={styles.tableContainer}>
            <h3>Agregar Edificio</h3>
            <input
              type="text"
              placeholder="Nombre del edificio"
              value={nuevoEdificio.nombre}
              onChange={(e) =>
                setNuevoEdificio({ ...nuevoEdificio, nombre: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Descripción del edificio"
              value={nuevoEdificio.descripcion}
              onChange={(e) =>
                setNuevoEdificio({
                  ...nuevoEdificio,
                  descripcion: e.target.value,
                })
              }
              style={styles.input}
            />
            <button onClick={agregarEdificio} style={styles.addButton}>
              Agregar Edificio
            </button>

            {edificios.map((edificio) => (
              <div key={edificio.id} style={styles.edificioContainer}>
                <h4>{edificio.nombre}</h4>
                <p>{edificio.descripcion}</p>

                <h4>Agregar Salón</h4>
                <input
                  type="text"
                  placeholder="Nombre del salón"
                  value={nuevoSalon}
                  onChange={(e) => setNuevoSalon(e.target.value)}
                  style={styles.input}
                />
                <button
                  onClick={() => agregarSalon(edificio.id)}
                  style={styles.addButton}
                >
                  Agregar Salón
                </button>

                {edificio.salones.map((salon) => (
                  <div key={salon.id} style={styles.salonContainer}>
                    <h5
                      onClick={() =>
                        toggleElementosSalon(edificio.id, salon.id)
                      }
                    >
                      {salon.nombre} (Haga clic para ver/ocultar elementos)
                    </h5>

                    {salon.mostrarElementos && (
                      <>
                        <button
                          onClick={() => abrirModal(edificio.id, salon.id)}
                          style={styles.addButton}
                        >
                          Agregar Elemento de Configuración
                        </button>

                        <h5>Elementos de Configuración</h5>
                        {salon.elementos_configuracion.map((elemento) => (
                          <div key={elemento.id}>
                            <p>
                              <strong>{elemento.nombre}</strong> (
                              {elemento.tipo}) - Estado: {elemento.estado}
                            </p>
                            <p>
                              Procesador: {elemento.caracteristicas.procesador}
                            </p>
                            <p>RAM: {elemento.caracteristicas.ram}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {modalVisible && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Agregar Elemento de Configuración</h3>
              <input
                type="text"
                placeholder="Nombre del elemento"
                value={nuevoElemento.nombre}
                onChange={(e) =>
                  setNuevoElemento({ ...nuevoElemento, nombre: e.target.value })
                }
                style={styles.input}
              />
              <select
                value={nuevoElemento.tipo}
                onChange={(e) =>
                  setNuevoElemento({ ...nuevoElemento, tipo: e.target.value })
                }
                style={styles.select}
              >
                <option value="">Seleccione un tipo</option>
                <option value="Equipo informático">Equipo informático</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Audiovisual">Audiovisual</option>
              </select>

              {renderCaracteristicasCampos()}

              <button
                onClick={handleAgregarElemento}
                style={styles.submitButton}
              >
                Agregar Elemento
              </button>
              <button onClick={cerrarModal} style={styles.closeButton}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {currentSection === "incidencias" && (
          <div style={styles.tableContainer}>
            <h3>Crear Incidencia</h3>
            <select
              value={nuevaIncidencia.salon}
              onChange={(e) =>
                setNuevaIncidencia({
                  ...nuevaIncidencia,
                  salon: e.target.value,
                })
              }
              style={styles.select}
            >
              <option value="">Seleccione un salón</option>
              {edificios.map((edificio) =>
                edificio.salones.map((salon) => (
                  <option key={salon.id} value={salon.id}>
                    {salon.nombre} ({edificio.nombre})
                  </option>
                ))
              )}
            </select>

            <h5>Selecciona los elementos afectados:</h5>
            {nuevaIncidencia.salon && (
              <>
                {edificios
                  .find((edificio) =>
                    edificio.salones.some(
                      (salon) => salon.id === parseInt(nuevaIncidencia.salon)
                    )
                  )
                  ?.salones.find(
                    (salon) => salon.id === parseInt(nuevaIncidencia.salon)
                  )
                  .elementos_configuracion.map((elemento) => (
                    <div key={elemento.id}>
                      <label>
                        <input
                          type="checkbox"
                          value={elemento.id}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setNuevaIncidencia((prev) => ({
                              ...prev,
                              elementosAfectados: checked
                                ? [...prev.elementosAfectados, parseInt(value)]
                                : prev.elementosAfectados.filter(
                                    (id) => id !== parseInt(value)
                                  ),
                            }));
                          }}
                        />
                        {elemento.nombre} ({elemento.tipo})
                      </label>
                    </div>
                  ))}
              </>
            )}

            <textarea
              placeholder="Descripción de la incidencia"
              value={nuevaIncidencia.descripcion}
              onChange={(e) =>
                setNuevaIncidencia({
                  ...nuevaIncidencia,
                  descripcion: e.target.value,
                })
              }
              style={styles.textarea}
            />
            <button onClick={crearIncidencia} style={styles.addButton}>
              Crear Incidencia
            </button>

            <h3>Lista de Incidencias</h3>
            <div>
              <h2>Incidencias</h2>
              {incidencias.map((incidencia) => (
                <div key={incidencia.id}>
                  <p>{incidencia.descripcion}</p>
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleAsignarIncidencia(incidencia.id, "tecnico1")
                      }
                    >
                      Asignar a Técnico
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === "evaluaciones" && (
          <div>
            <h2>Evaluaciones</h2>
            {incidencias.filter(
              (incidencia) => incidencia.estado === "terminada"
            ).length > 0 ? (
              incidencias
                .filter((incidencia) => incidencia.estado === "terminada")
                .map((incidencia) => (
                  <div key={incidencia.id}>
                    <p>{incidencia.descripcion}</p>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Deja tu evaluación"
                    />
                    <button
                      onClick={() =>
                        handleEnviarFeedback(incidencia.id, feedback)
                      }
                    >
                      Enviar Evaluación
                    </button>
                  </div>
                ))
            ) : (
              <p>No hay incidencias terminadas para evaluar.</p>
            )}
          </div>
        )}

        {currentSection === "solicitudes" && (
          <div style={styles.solicitudesContainer}>
            <h3>Solicitudes</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Salón</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud, index) => (
                  <tr key={index}>
                    <td>{solicitud.folio}</td>
                    <td>{solicitud.salon}</td>
                    <td>{solicitud.descripcion}</td>
                    <td>
                      <button
                        style={styles.actionButton}
                        onClick={() => handleOrderClick(solicitud)}
                      >
                        Orden de Trabajo
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => eliminarSolicitud(solicitud.folio)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orderVisible && selectedIncidencia && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3>
                    Orden de Trabajo para: {selectedIncidencia.descripcion}
                  </h3>
                  <p>
                    <strong>Salón:</strong> {selectedIncidencia.salon}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {selectedIncidencia.descripcion}
                  </p>

                  <label>Tipo de Trabajo:</label>
                  <select
                    value={nuevaIncidencia.tipoTrabajo}
                    onChange={(e) =>
                      setNuevaIncidencia({
                        ...nuevaIncidencia,
                        tipoTrabajo: e.target.value,
                      })
                    }
                    style={styles.select}
                  >
                    <option value="">Seleccione un tipo de trabajo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Limpieza">Limpieza</option>
                  </select>

                  <label>Asignar a:</label>
                  <select
                    value={nuevaIncidencia.encargado}
                    onChange={(e) =>
                      setNuevaIncidencia({
                        ...nuevaIncidencia,
                        encargado: e.target.value,
                      })
                    }
                    style={styles.select}
                  >
                    <option value="">Seleccione un encargado</option>
                    <option value="Martin Nevarez">Martin Nevarez</option>
                    <option value="Luis Felix">Luis Felix</option>
                    <option value="Carlos Camacho">Carlos Camacho</option>
                  </select>

                  <button style={styles.submitButton} onClick={enviarOrden}>
                    Enviar Orden
                  </button>
                  <button style={styles.closeButton} onClick={cerrarModal}>
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Gestión de Problemas */}
      {currentSection === "problemas" && (
        <div style={styles.tableContainer}>
          <h3>Problemas</h3>
          <select
            value={errorConocido.incidenciaId || ""}
            onChange={(e) =>
              setErrorConocido({
                ...errorConocido,
                incidenciaId: Number(e.target.value),
              })
            }
            style={styles.select}
          >
            <option value="">Selecciona una incidencia</option>
            {incidencias.map((incidencia) => (
              <option key={incidencia.id} value={incidencia.id}>
                {incidencia.descripcion}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Causa raíz"
            value={errorConocido.causaRaiz}
            onChange={(e) =>
              setErrorConocido({ ...errorConocido, causaRaiz: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Error conocido"
            value={errorConocido.errorConocido}
            onChange={(e) =>
              setErrorConocido({
                ...errorConocido,
                errorConocido: e.target.value,
              })
            }
            style={styles.input}
          />
          <textarea
            placeholder="Solución"
            value={errorConocido.solucion}
            onChange={(e) =>
              setErrorConocido({ ...errorConocido, solucion: e.target.value })
            }
            style={styles.textarea}
          />
          <label>
            <input
              type="checkbox"
              checked={errorConocido.rfcRequerido}
              onChange={(e) =>
                setErrorConocido({
                  ...errorConocido,
                  rfcRequerido: e.target.checked,
                })
              }
            />
            ¿Requiere RFC?
          </label>
          <button onClick={registrarProblema} style={styles.addButton}>
            Registrar Problema
          </button>

          <h3>Errores Conocidos</h3>
          {problemas.map((problema, index) => (
            <div key={index} style={styles.problemaContainer}>
              <p>
                <strong>Incidencia:</strong> {problema.incidenciaId}
              </p>
              <p>
                <strong>Causa raíz:</strong> {problema.causaRaiz}
              </p>
              <p>
                <strong>Error conocido:</strong> {problema.errorConocido}
              </p>
              <p>
                <strong>Solución:</strong> {problema.solucion}
              </p>
              <p>
                <strong>RFC Requerido:</strong>{" "}
                {problema.rfcRequerido ? "Sí" : "No"}
              </p>
              <p>
                <strong>Fecha Resolución:</strong> {problema.fechaResolucion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    background: " linear-gradient(135deg, #007bff, #1e99eb, #021b79)",
    backgroundSize: "cover",
    justifyContent: "flex-start",
  },
  nav: {
    width: "250px",
    background: "linear-gradient(90deg, #007bff, #004aad)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
    borderRight: "2px solid rgba(255, 255, 255, 0.1)",
    transition: "background 0.5s ease-in-out",
  },
  navHover: {
    background: "linear-gradient(90deg, #004aad, #007bff,)",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "120px",
    marginBottom: "20px",
  },
  navButton: {
    padding: "12px 20px",
    backgroundColor: "#00509e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "15px",
    width: "100%",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  },
  navButtonActive: {
    backgroundColor: "#007bff",
    boxShadow: "0px 0px 10px rgba(0, 123, 255, 0.6)",
  },
  navButtonHover: {
    backgroundColor: "#003d73",
  },
  content: {
    flexGrow: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
    width: "calc(100% - 250px)",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-40%, -50%)",
    color: "#333",
    textAlign: "left",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    width: "450px",
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.3s ease",
  },
  solicitudesContainer: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
    width: "95%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#333",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#f0f4fa",
    color: "#333",
    fontWeight: "bold",
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  actionButton: {
    padding: "8px 16px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  deleteButton: {
    padding: "8px 16px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#dc3545",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#888",
    marginTop: "20px",
  },
  textarea: {
    backgroundColor: "#f9f9f9",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "2px solid #ccc",
    width: "100%",
    height: "150px",
    fontSize: "16px",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  addButton: {
    padding: "8px 16px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  submitButton: {
    padding: "8px 16px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  closeButton: {
    padding: "8px 16px",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#dc3545",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  tareaContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "700px",
    color: "#333",
    width: "80%",
    textAlign: "left",
  },

  tareasContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "1400px",
    paddingTop: "20px",
  },
};

export default HomePage;
