import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appFirebase from "../src/credentials";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "../src/components/Login";
import Home from "../src/components/HomePage";
import HomeJefeTaller from "../src/components/homejefetaller";
import HomeTecnico from "../src/components/hometecnico";

const auth = getAuth(appFirebase);

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fireUser) => {
      if (fireUser) {
        setUser(fireUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              userRole === "usuario" ? (
                <Home userEmail={user.email} />
              ) : userRole === "jefe" ? (
                <HomeJefeTaller userEmail={user.email} />
              ) : userRole === "tecnico" ? (
                <HomeTecnico userEmail={user.email} />
              ) : (
                <Login setUserRole={setUserRole} />
              )
            ) : (
              <Login setUserRole={setUserRole} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
