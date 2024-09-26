import React, { useEffect, useState } from "react";
import api  from "../../utils/api";

const ReportView = () => {
  const [report, setReport] = useState({
    utility: [],
    service: [],
    payment: [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      const utilityReport = await api.get("/report/utility");
      const serviceReport = await api.get("/report/service");
      const paymentReport = await api.get("/report/payment");

      setReport({
        utility: utilityReport.data,
        service: serviceReport.data,
        payment: paymentReport.data,
      });
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      <h3>Utility Report</h3>
      <ul>
        {report.utility.map((item) => (
          <li key={item._id}>
            {item._id}: {item.totalUsage} usage, ${item.totalAmount}
          </li>
        ))}
      </ul>

      <h3>Service Report</h3>
      <ul>
        {report.service.map((item) => (
          <li key={item._id}>
            {item._id}: {item.totalServices} services, Avg Rating:{" "}
            {item.averageRating}
          </li>
        ))}
      </ul>

      <h3>Payment Report</h3>
      <ul>
        {report.payment.map((item) => (
          <li key={item._id}>
            {item._id}: ${item.totalAmount}, {item.count} payments
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportView;




// import React, { useState } from "react";
// import {
//   getUtilityReport,
//   getServiceReport,
//   getPaymentReport,
// } from "../../utils/api";

// const ReportView = () => {
//   const [reportType, setReportType] = useState("utility");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reportData, setReportData] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let data;
//       switch (reportType) {
//         case "utility":
//           data = await getUtilityReport(startDate, endDate);
//           break;
//         case "service":
//           data = await getServiceReport(startDate, endDate);
//           break;
//         case "payment":
//           data = await getPaymentReport(startDate, endDate);
//           break;
//         default:
//           throw new Error("Invalid report type");
//       }
//       setReportData(data);
//     } catch (error) {
//       console.error("Error fetching report:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Generate Report</h2>
//       <form onSubmit={handleSubmit}>
//         <select
//           value={reportType}
//           onChange={(e) => setReportType(e.target.value)}
//         >
//           <option value="utility">Utility Report</option>
//           <option value="service">Service Report</option>
//           <option value="payment">Payment Report</option>
//         </select>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           required
//         />
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           required
//         />
//         <button type="submit">Generate Report</button>
//       </form>

//       {reportData && (
//         <div>
//           <h3>Report Results</h3>
//           <pre>{JSON.stringify(reportData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportView;