// 'use client'
// import { useEffect, useState } from 'react';

const Tables = async () => {
  const getAllTables = async () => {
    const data = await fetch("http://localhost:3000/data", {
        method: 'GET'
    })
    const tables = await data.json()
    console.log(tables)
    return tables
  }
  const tables = await getAllTables()
  return (
    <div>
      TABLES:
      {tables.map((entry) => (
        <div>{entry.id}</div>
      ))}
    </div>
  )
// const [tables, setTables] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch('http://localhost:3000/data')
//       const data = await response.json();
//       setTables(data.tables);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Database Tables</h1>
//       {tables.map((table, index) => (
//         <div key={index}>
//           {table.id}
//         </div>
//       ))}
//     </div>
//   );
}

export default Tables
