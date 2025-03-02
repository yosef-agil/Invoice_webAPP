import React, {useEffect, useState} from "react";

function Home() {
  // Show package list from MySQL
  const [data, setData] = useState([])

  useEffect(()=> {
    fetch('http://localhost:8081/paketan')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

  return (
    <div className="h-screen p-6 bg-white">
      <div className="overflow-x-auto">

        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Package Name</th>
              <th>Price</th>
              <th>Date Update</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.package}</td>
              <td>Rp {d.price.toLocaleString('id-ID')}</td>
              <td>{d.date}</td>
              <td>{d.category}</td>
            </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}

export default Home;
