import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const UtilityForm = () => {
  const [formData, setFormData] = useState({
    type: "electricity",
    reading: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/utility", formData);
      navigate("/utilities");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add utility reading"
      );
    }
  };

  return (
    <div className="utility-form">
      <h2>Add Utility Reading</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Utility Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="gas">Gas</option>
          </select>
        </div>
        <div>
          <label htmlFor="reading">Reading:</label>
          <input
            type="number"
            id="reading"
            name="reading"
            value={formData.reading}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UtilityForm;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { addUtilityReading } from "../../utils/api";

// const UtilityForm = () => {
//   const [formData, setFormData] = useState({
//     type: "electricity",
//     reading: "",
//     amount: "",
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addUtilityReading(formData);
//       navigate("/utilities");
//     } catch (error) {
//       console.error("Error adding utility reading:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <select name="type" value={formData.type} onChange={handleChange}>
//         <option value="electricity">Electricity</option>
//         <option value="water">Water</option>
//         <option value="gas">Gas</option>
//       </select>
//       <input
//         type="number"
//         name="reading"
//         value={formData.reading}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="number"
//         name="amount"
//         value={formData.amount}
//         onChange={handleChange}
//         required
//       />
//       <button type="submit">Add Reading</button>
//     </form>
//   );
// };

// export default UtilityForm;
