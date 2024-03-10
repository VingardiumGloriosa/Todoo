import { connect } from "@/dbConfig/db";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

connect();
export async function GET(request: NextRequest) {
  try {
    const todos = await Todo.find({});
    console.log(todos);

    return NextResponse.json({ msg: "Found all todos", success: true, todos });
  } catch (error) {
    return NextResponse.json({ msg: "Issue Getting" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { desc } = reqBody;
    console.log(desc);

    const newTodo = new Todo({
      id: uuidv4(),
      desc,
      completed: false,
    });

    const savedTodo = await newTodo.save();
    return NextResponse.json({ msg: "Todo added", success: true, savedTodo });
  } catch (error) {
    return NextResponse.json(
      { msg: "Issue Posting", error: error.message },
      { status: 500 }
    );
  }
}
