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
    <div>
      <div className="Header items-center border-b justify-between flex px-6 py-4">
        <h2 className="text-lg font-semibold">Pricelist</h2>
      </div>   
      <div className="container px-8 py-8">
        <div className="overflow-x-auto border overflow-hidden rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th className="htable">Package Name</th>
                <th className="htable">Price</th>
                <th className="htable">Date Update</th>
                <th className="htable">Category</th>
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
    </div>
  );
}

export default Home;
