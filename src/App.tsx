import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { IoIosTime } from "react-icons/io";
import Alert from "./components/Alert"
import Popup from "./components/DeletePopup";

type TodoItem = {
  Title : string | null
  Date  : string | null
}

type Status = {
  addFormError   : string | null
  addFormSuccess : string | null
}

type EditLog = {
  isEdit   : boolean | null
  target   : number | null
}

type DeleteLog = {
  isDelete   : boolean | null
  target   : number | null
}

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const [status, setStatus] = useState<Status>({
    addFormError: "",
    addFormSuccess: ""
  });

  const [editLog, setEditLog] = useState<EditLog>({
    isEdit: false,
    target: null,
  });

  const [deleteLog, setDeleteLog] = useState<DeleteLog>({
    isDelete: false,
    target: null
  });

  const statusDivRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<TodoItem>({
    Title: "",
    Date: ""
  });

  const [userSearch, setUserSearch] = useState<string>("");

  const filteredTodo = todos.filter((todo) => {
    return (todo.Title ?? "").includes(userSearch);
  })

  useEffect(() => {
    if (deleteLog.isDelete) {
      document.documentElement.style.overflowY = "hidden";
    }

    return () => {
      document.documentElement.style.overflowY = "auto";
    }
  }, [deleteLog])

  useEffect(() => {
    if (status.addFormError != "" || status.addFormSuccess != "") {
      setTimeout(() => {statusDivRef.current?.classList.remove("scale-[0.8]");}, 10);
      setTimeout(() => {
        setTimeout(() => {statusDivRef.current?.classList.add("scale-[0.8]");}, 10);
        setTimeout(() => {setStatus({ addFormError: "", addFormSuccess: "" })}, 80);
      }, 6000);
    }
  }, [status])

  const formatTime = (time: Date): string => {
    let hours = String(time.getHours());
    let minutes = String(time.getMinutes());
    let seconds = String(time.getSeconds());

    if (time.getHours() < 10) {
      hours = hours.padStart(2, "0");
    } 
    if (time.getMinutes() < 10) {
      minutes = minutes.padStart(2, "0");
    }
    if (time.getSeconds() < 10) {
      seconds = seconds.padStart(2, "0");
    }

    return `${hours}:${minutes}:${seconds}`;
  }

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const same = todos.filter((todo) => todo.Title == formData.Title);
    if (formData.Title != "" && same.length == 0) {
      const date = new Date();
      const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${formatTime(date)}`
      setTodos([...todos, {...formData, Date: currentDate}]);
      setFormData({
        Title: "",
        Date: ""
      })
      setStatus(
        {
          ...status,
          addFormError: "", 
          addFormSuccess: "Add To-Do successfully!",
        }
      )
    } else {
      setStatus(
        {
          ...status, 
          addFormError: "Please valid input or your todo has exist.",
          addFormSuccess: "",
        }
      )
    }
  }

  const deleteTodo = (index: number) => {
    setTodos(todos.filter((todo) => todos.indexOf(todo) != index))
    setEditLog(
        {
          isEdit: false,
          target: null,
        }
    )
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

  const onEditValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.name;
    const value: string = e.target.value;

    setStatus({ 
      addFormError: "",
      addFormSuccess: ""
    })

    const newTodos: TodoItem[] = todos.map((todo, i) => {
      if (i == editLog.target) {
        return {...todo, [key]: value};
      }
      return todo;
    })

    if (newTodos) {
      setTodos(newTodos);
    }
  }

  return (
    <div className="w-full min-h-screen h-auto py-8 relative">
      <h1 className="text-3xl text-center font-bold text-white">
        To-Do List App
      </h1>
      {deleteLog.isDelete ?
        <Popup data={deleteLog} func={deleteTodo} closeFunc={setDeleteLog}/>
        :
        null
      }
      <div className="w-full py-8 flex justify-center items-start space-x-24">
        <div className="space-y-4">
          <form onSubmit={addTodo} className="py-8 px-4 rounded-2xl bg-[#0c0b0b]">
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
                className="w-[350px] duration-[0.15s] focus:bg-white focus:text-black text-white focus:border-2 focus:border-solid focus:border-white border-2 border-solid border-white rounded-3xl px-4 py-2" 
                value={formData.Title ?? ""}
                onChange={onFormValueChange}
              />
            </div>
            <div className="w-full flex justify-end">
              <button className="bg-green-600 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2">Add To-Do</button>
            </div>
          </form>
          {editLog.isEdit ? 
              <form 
                onSubmit={() => setEditLog(
                  {...editLog, isEdit: false, target: null}
                )} 
                className="py-8 px-4 rounded-2xl bg-[#0c0b0b]"
              >
                <h1 className="text-2xl font-bold text-white ml-2 mb-4">Edit To-Do</h1>
                <p className="text-white mb-4">Edit Item : Item : {((editLog.target ?? 0) + 1).toString().padStart(3, "0")}</p>
                <div className="mb-8">
                  <input 
                    type="text" 
                    id="title" 
                    name="Title"
                    placeholder="To-Do..." 
                    className="w-[350px] duration-[0.15s] focus:bg-white focus:text-black text-white focus:border-2 focus:border-solid focus:border-white border-2 border-solid border-white rounded-3xl px-4 py-2" 
                    value={(todos[editLog.target ?? 0].Title) ?? ""}
                    onChange={onEditValueChange}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <button className="bg-pink-900 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2">Close Edit</button>
                </div>
              </form>
            :
              null
          }
        </div>
        {todos.length == 0 ? 
          <div className="w-[500px] max-h-[500px] h-[500px] rounded-2xl bg-[#00000045] px-8 py-8 flex justify-center items-center">
            <p className="text-white text-2xl">Your To-Do is empty now.</p>
          </div>
          :
          <div className="space-y-4">
            <div className="bg-[#00000088] rounded-2xl mb- px-4 py-4 space-y-2">
              <p className="text-2xl text-white">Searching</p>
              <input 
                type="text"
                placeholder="Search..." 
                className="w-full duration-[0.15s] focus:bg-white focus:text-black text-white focus:border-2 focus:border-solid focus:border-white border-2 border-solid border-white rounded-3xl px-4 py-2" 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            {filteredTodo.length == 0 ?
              <div className="bg-[#00000088] max-h-[500px] h-[500px] rounded-2xl px-8 py-4 flex justify-center items-center overflow-x-hidden overflow-y-auto">
                <p className="text-white text-2xl">Not have To-Do which match with your searching</p>
              </div>
              :
              <div className="bg-[#00000088] max-h-[500px] h-[500px] rounded-2xl px-8 py-4 overflow-x-hidden overflow-y-auto">
                {filteredTodo.map((todo, i) => {
                  return (
                    <div key={i} className="w-[500px] bg-[#181818] mx-auto mb-8 py-8 px-4 rounded-2xl flex flex-col space-y-4">
                      <p className="text-white">Item : {(i + 1).toString().padStart(3, "0")}</p>
                      <p className="text-white text-3xl font-semibold">{todo.Title}</p>
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <IoIosTime className="text-white text-xl"/>
                          <p className="text-white">{todo.Date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="bg-yellow-500 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-7 py-2"
                            onClick={() => {
                              setStatus({ 
                                addFormError: "",
                                addFormSuccess: ""
                              })
                              setEditLog({...editLog, isEdit: !editLog.isEdit, target: i})
                            }}
                          >
                              Edit
                          </button>
                          <button 
                            className="bg-red-600 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2"
                            onClick={() => setDeleteLog(
                              {...deleteLog, isDelete: !deleteLog.isDelete, target: i}
                            )}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}