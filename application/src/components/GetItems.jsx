import { useLocation } from "react-router-dom";
function GetItems() {
    const location = useLocation();

    // const fetchTodos = async () => {
    //     const response = await fetch(`http://localhost:3000/todos?userId=${useId}`);
    //     const data = await response.json();
    //     setTodos(data); // שמירה ב-State כדי להציג על המסך
    // };
    return (<>
        <div>this component is {location.state.from} get to server</div>
    </>)
}
export default GetItems;