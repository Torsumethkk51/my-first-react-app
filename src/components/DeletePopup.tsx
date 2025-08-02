import type { Dispatch, MouseEvent, SetStateAction } from "react"

type DeleteLog = {
  isDelete   : boolean | null
  target   : number | null
}

type Props = {
  data      : DeleteLog
  func      : (index: number) => void
  closeFunc : Dispatch<SetStateAction<DeleteLog>>
}

export default function DeletePopup({ data, func, closeFunc }: Props) {
  return (
    <div
      className="w-full h-screen bg-[#0000002f] backdrop-blur-[10px] flex justify-center items-center absolute top-0 left-0 right-0"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          closeFunc({...data, isDelete: false})
        }
      }}
    >
      <div className="px-8 py-4 bg-[#2c2c2c98] space-y-8 rounded-2xl">
        <h1 className="text-white text-2xl">Do you want to delete?</h1>
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-red-500 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2"
            onClick={() => closeFunc({...data, isDelete: false})}
          >
            No
          </button>
          <button 
            className="bg-green-500 rounded-xl duration-[0.15s] hover:opacity-[0.9] active:opacity-[0.5] text-white  px-4 py-2" 
            onClick={() => {
              func(data.target ?? 0)
              closeFunc({...data, isDelete: false})
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}