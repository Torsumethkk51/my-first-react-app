import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import Alert from "./components/Alert"

type TodoItem = {
  Title : string | null
  Date  : string | null
}

type Status = {
  addFormError   : string | null
  addFormSuccess : string | null
}

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const [status, setStatus] = useState<Status>({
    addFormError: "",
    addFormSuccess: ""
  });

  const statusDivRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<TodoItem>({
    Title: "",
    Date: ""
  });

  useEffect(() => {
    if (status.addFormError != "" || status.addFormSuccess != "") {
      setTimeout(() => {statusDivRef.current?.classList.remove("scale-[0.8]");}, 10);
      setTimeout(() => {
        setTimeout(() => {statusDivRef.current?.classList.add("scale-[0.8]");}, 10);
        setTimeout(() => {setStatus({ addFormError: "", addFormSuccess: "" })}, 80);
      }, 3000);
    }
  }, [status])

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.Title != "") {
      setFormData(
        {...formData, Date: (new Date().getTime()).toString()}
      )
      setTodos([...todos, formData]);
      setFormData({
        Title: "",
        Date: ""
      })
      setStatus(
        {...status, addFormSuccess: "Add To-Do successfully!"}
      )
    } else {
      setStatus(
        {...status, addFormError: "Please valid input."}
      )
    }
  }

  const onFormValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.name;
    const value: string = e.target.value;

    setStatus({ 
      addFormError: "",
      addFormSuccess: ""
    })

    if (key) {
      setFormData({...formData, [key]: value})
    }
  }

  return (
    <div className="w-full min-h-screen h-auto py-8">
      <h1 className="text-3xl text-center font-bold text-white">
        To-Do List App
      </h1>
      <div className="flex items-start space-x-24">
        <form onSubmit={addTodo} className="w-[600px] mx-auto my-8 py-8 px-4 rounded-2xl bg-[#0c0b0b]">
          {status.addFormError != "" ? 
            <div ref={statusDivRef} className="duration-[0.15s] scale-[0.8]">
              <Alert Mode="error" Msg={status.addFormError} />
            </div>
            : 
            null
          }
          {status.addFormSuccess != "" ? 
            <div ref={statusDivRef} className="duration-[0.15s] scale-[0.8]">
              <Alert Mode="success" Msg={status.addFormSuccess} />
            </div>
            : 
            null
          }
          <h1 className="text-2xl font-bold text-white ml-2 mb-8">Add To-Do</h1>
          <div className="mb-8">
            <input 
              type="text" 
              id="title" 
              name="Title"
              placeholder="To-Do..." 
              className="w-full duration-[0.15s] focus:bg-white focus:text-black text-white focus:border-2 focus:border-solid focus:border-white border-2 border-solid border-white rounded-3xl px-4 py-2" 
              value={formData.Title ?? ""}
              onChange={onFormValueChange}
            />
          </div>
          <div className="w-full flex justify-end">
            <button className="bg-green-600 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2">Add To-Do</button>
          </div>
        </form>
        <div className="max-h-[600px] overflow-y-scroll">
          {todos.map((todo, i) => {
            return (
              <div key={i} className="w-[600px] mx-auto my-8 py-8 px-4 rounded-2xl bg-[#0c0b0b] flex flex-col space-y-4">
                <p className="text-white">Item : {(i + 1).toString().padStart(3, "0")}</p>
                <p className="text-white text-3xl font-semibold">{todo.Title}</p>
                <div className="flex space-x-4">

                  <p className="text-white">{todo.Date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}