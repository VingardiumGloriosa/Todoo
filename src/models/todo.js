import mongoose, { Mongoose } from "mongoose";

const TodoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
  },
});

const Todo = mongoose.models.todos || mongoose.model("todos", TodoSchema);

export default Todo;
