"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Todo {
  id: string;
  desc: string;
  completed?: boolean;
}

export default function Todos() {
  const [inputText, setInputText] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    axios
      .get("/api/todos")
      .then((resp) => {
        console.log(resp);
        // Ensure todos have unique ids and match the Todo type
        const fetchedTodos: Todo[] = resp.data.todos.map(
          (todo: Todo, index: number) => ({ ...todo, id: `todo-${index}` })
        );
        setTodos(fetchedTodos);
      })
      .catch((error) => console.error("Failed to fetch todos:", error));
  }, []);

  async function addTodos() {
    if (!inputText) return;
    const data = { desc: inputText };

    try {
      const resp = await axios.post("/api/todos", data);
      console.log(resp);
      setInputText("");
      setTodos((prevTodos) => [
        ...prevTodos,
        { ...resp.data.savedTodo, id: `todo-${prevTodos.length}` },
      ]);
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  }

  const clearTodos = () => setInputText("");

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const newTodos = Array.from(todos);
    const [reorderedItem] = newTodos.splice(source.index, 1);
    newTodos.splice(destination.index, 0, reorderedItem);

    setTodos(newTodos);
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
          {todos.length > 0 && (
            <Droppable droppableId="todos" key={todos.length}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {todos.map((todo: Todo, index: number) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
