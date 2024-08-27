import { useLocation } from "react-router-dom"

interface PlaceData {
    name:string,
    _id:string
}

const SuggestEdit = () => {
    const location = useLocation();
    const data = location.state?.data as PlaceData
    console.log(data)

  return (
    <>
    <div>Suggest Edit</div>
    <div>{data.name}</div>
    </>
  )
}

export default SuggestEdit