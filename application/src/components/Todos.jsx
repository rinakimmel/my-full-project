
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import useApi from '../useApi';

// function Todos() {
//     const { userId } = useParams();
//     const [sortBy, setSortBy] = useState('id');
//     const responseData = useApi(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}`);

//     return (
//         <>
//             <h2>Todos Component</h2>
//             <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//                 <option value="id">מיון לפי ID</option>
//                 <option value="title">מיון לפי כותרת</option>
//                 <option value="completed">מיון לפי ביצוע</option>
//             </select>
//             {responseData && responseData.map(todo => (
//                 <div key={todo.id}>
//                     <p>ID: {todo.id}</p>
//                     <h3>{todo.title}</h3>
//                     <label>
//                         <input type="checkbox" checked={todo.completed} readOnly />
//                         {todo.completed ? 'הושלם' : 'לא הושלם'}
//                     </label>
//                 </div>
//             ))}
//         </>
//     )
// }   

// export default Todos;

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useApi from '../useApi';

function Todos() {
    const { userId } = useParams();
    const [sortBy, setSortBy] = useState('id');
    const [searchBy, setSearchBy] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [url, setUrl] = useState(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);
    const [method, setMethod] = useState("get");
    //const {responseData, getData, deleteData } = useApi(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);

    const responseData = useApi(method, url);
    const deleteData = (id) => {
        setUrl(`http://localhost:3000/todos/${id}`);
        setMethod("delete");
        setTimeout(() => {
            setUrl(`http://localhost:3000/todos?userId=${userId}&_sort=${sortBy}&${searchBy}=${searchValue}`);
            setMethod("get");
        }, 100);
    };

    return (
        <>
            <h2>Todos Component</h2>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">מיון לפי ID</option>
                <option value="title">מיון לפי כותרת</option>
                <option value="completed">מיון לפי ביצוע</option>
            </select>

            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="">בחר קריטריון חיפוש</option>
                <option value="id">חיפוש לפי ID</option>
                <option value="title">חיפוש לפי כותרת</option>
                <option value="completed">חיפוש לפי מצב ביצוע</option>
            </select>

            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="הכנס ערך לחיפוש"
            />

            {responseData && responseData.map(todo => (
                <div key={todo.id}>
                    <p>ID: {todo.id}</p>
                    <h3>{todo.title}</h3>
                    <label>
                        <input type="checkbox" checked={todo.completed} readOnly />
                        {todo.completed ? 'הושלם' : 'לא הושלם'}
                    </label>
                    <button onClick={() => { deleteData(todo.id) }}>delete todo</button>
                </div>
            ))}
        </>
    )
}

export default Todos;
