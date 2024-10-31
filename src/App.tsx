import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabase/client";

// Define la interfaz del usuario según la estructura de tu tabla "users"
interface User {
  id: number;
  created_at: string;
  name: string;
  age: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    if (data) {
      setUsers(data);
    }
  };

  const addUser = async () => {
    if (!name || !age) return;
    const { data } = await supabase.from("users").insert([{ name, age }]);
    if (data) {
      setUsers([...users, ...data]);
      setName("");
      setAge("");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen flex items-start justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-4 md:gap-8">
        {/* Formulario de agregar usuario */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Agregar Usuario</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Edad</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la edad"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Agregar Usuario
            </button>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-semibold text-white text-center mb-6">Usuarios</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="text-white uppercase text-sm tracking-wider">
                  <th className="py-3 px-2 md:px-4 border-b border-gray-200">ID</th>
                  <th className="py-3 px-2 md:px-4 border-b border-gray-200">Name</th>
                  <th className="py-3 px-2 md:px-4 border-b border-gray-200">Age</th>
                  <th className="py-3 px-2 md:px-4 border-b border-gray-200">Created At</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 transition-colors`}
                  >
                    <td className="py-3 px-2 md:px-4 border-b border-gray-200">{user.id}</td>
                    <td className="py-3 px-2 md:px-4 border-b border-gray-200">{user.name}</td>
                    <td className="py-3 px-2 md:px-4 border-b border-gray-200">{user.age}</td>
                    <td className="py-3 px-2 md:px-4 border-b border-gray-200">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
