type Props = {
  Mode  : string | null
  Msg   : string | null
}

export default function Alert({ Mode, Msg }: Props) {
  return (
    <div className={`w-full px-4 py-4 ${Mode == "error" ? "bg-red-200 border-red-500" : Mode == "success" ? "bg-green-200 border-green-500" : null} origin-center border-3 border-solid rounded-lg mb-8 flex justify-between items-center`}>
      <p className={`${Mode == "error" ? "text-red-500" : Mode == "success" ? "text-green-500" : null} text-xl`}>
        {Msg}
      </p>
      <div>
        <p></p>
      </div>
    </div>
  )
}