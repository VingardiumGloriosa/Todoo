"use client"; // Import React and necessary hooks
import React, { useState, useEffect } from "react";
// Axios for making HTTP requests
import axios from "axios";

// Define a TypeScript interface for the todo items
interface Todo {
  id: string;
  desc: string;
  completed?: boolean;
}

export default function Todos() {
  // State for the input text
  const [inputText, setInputText] = useState<string>("");
  // State for the todos list, typed according to the Todo interface
  const [todos, setTodos] = useState<Todo[]>([]);

  // Effect hook to load todos on component mount
  useEffect(() => {
    axios
      .get("/api/todos")
      .then((resp) => {
        console.log(resp);
        setTodos(resp.data.todos);
      })
      .catch((error) => console.error("Failed to fetch todos:", error));
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Function to add a new todo
  async function addTodos() {
    if (!inputText) return; // Prevent adding empty todos
    const data = {
      desc: inputText,
    };

    try {
      const resp = await axios.post("/api/todos", data);
      console.log(resp);
      setInputText(""); // Clear input after adding
      setTodos((prevTodos) => [...prevTodos, resp.data.savedTodo]); // Update the todos state
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  // Function to clear the input field
  const clearTodos = () => setInputText("");

  // JSX for the component
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <div className="p-8 bg-white rounded-lg shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">Todo List 💖</h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter To Do"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border rounded border-gray-300"
          />
          <button
            onClick={addTodos}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Add
          </button>
          <button
            onClick={clearTodos}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Clear
          </button>
        </div>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded"
            >
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-800">{todo.desc}</span>
              </div>
              <div className="flex gap-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-200">
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
