import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const UtilityList = () => {
  const [utilities, setUtilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUtilities();
  }, []);

  const fetchUtilities = async () => {
    try {
      const response = await api.get("/utility");
      setUtilities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching utilities:", error);
      setError("Failed to fetch utilities. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="utility-list">
      <h2>Utilities</h2>
      <Link to="/utilities/new">Add New Utility Reading</Link>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Reading</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {utilities.map((utility) => (
            <tr key={utility._id}>
              <td>{utility.type}</td>
              <td>{utility.reading}</td>
              <td>${utility.amount.toFixed(2)}</td>
              <td>{new Date(utility.date).toLocaleDateString()}</td>
              <td>{utility.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UtilityList;



// import React, { useState, useEffect } from "react";
// import { getUtilities } from "../../utils/api";

// const UtilityList = () => {
//   const [utilities, setUtilities] = useState([]);

//   useEffect(() => {
//     getUtilities().then(setUtilities);
//   }, []);

//   return (
//     <div>
//       <h2>Utilities</h2>
//       <ul>
//         {utilities.map((utility) => (
//           <li key={utility._id}>
//             {utility.type} - Reading: {utility.reading} - Amount: $
//             {utility.amount} - Status: {utility.status}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UtilityList;
