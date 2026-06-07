import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [month, setMonth] = useState("");

  const [existingWorkbook, setExistingWorkbook] = useState(null);

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert("Select files first");
      return;
    }

    const formData = new FormData();

    for (let file of files) {
      formData.append("files", file);
    }

    // Additional fields
    formData.append("business_name", businessName);
    formData.append("gst_number", gstNumber);
    formData.append("uid", uid);
    formData.append("password", password);
    formData.append("month", month);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const updateType = (index, value) => {
    const updated = [...results];
    updated[index].invoice_type = value;
    setResults(updated);
  };

  const generateExcel = async () => {

  const formData = new FormData();

  formData.append(
    "business_name",
    businessName
  );

  formData.append(
    "gstin",
    gstNumber
  );

  formData.append(
    "uid",
    uid
  );

  formData.append(
    "password",
    password
  );

  formData.append(
    "month",
    month
  );

  formData.append(
    "invoices",
    JSON.stringify(results)
  );

  if (existingWorkbook) {

    formData.append(
      "workbook",
      existingWorkbook
    );

  }

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/generate-excel",
      formData,
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `${businessName.replace(/\s+/g, "_")}_2026.xlsx`;

    document.body.appendChild(link);

    link.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(error);

    alert("Excel generation failed");

  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>Invoice AI</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="GSTIN"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
>
  <option value="">Select Month</option>
  <option value="January">January</option>
  <option value="February">February</option>
  <option value="March">March</option>
  <option value="April">April</option>
  <option value="May">May</option>
  <option value="June">June</option>
  <option value="July">July</option>
  <option value="August">August</option>
  <option value="September">September</option>
  <option value="October">October</option>
  <option value="November">November</option>
  <option value="December">December</option>
</select>
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />
      <div style={{ marginTop: "15px" }}>
  <label>
    Existing Workbook (Optional)
  </label>

  <br />

  <input
    type="file"
    accept=".xlsx"
    onChange={(e) =>
      setExistingWorkbook(
        e.target.files[0]
      )
    }
  />
</div>
      <button
        onClick={uploadFiles}
        style={{
          marginLeft: "10px",
        }}
      >
        Upload Invoices
      </button>

      {loading && <p>Processing...</p>}

      {results.length > 0 && (
        <>
          <table
            border="1"
            cellPadding="8"
            style={{
              marginTop: "20px",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>Party Name</th>
                <th>Place</th>
                <th>GSTIN</th>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Tax Rate</th>
                <th>HSN</th>
                <th>Net Amount</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total GST</th>
                <th>Gross Amount</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {results.map((invoice, index) => (
                <tr key={index}>
                  <td>
  <input
    value={invoice.party_name || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].party_name = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    value={invoice.place || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].place = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    value={invoice.gstin || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].gstin = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    value={invoice.invoice_no || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].invoice_no = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    value={invoice.invoice_date || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].invoice_date = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    type="number"
    value={invoice.tax_rate || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].tax_rate = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    value={invoice.hsn_code || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].hsn_code = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    type="number"
    value={invoice.net_amount || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].net_amount = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    type="number"
    value={invoice.cgst || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].cgst = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    type="number"
    value={invoice.sgst || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].sgst = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>
  <input
    type="number"
    value={invoice.igst || ""}
    onChange={(e) => {
      const updated = [...results];
      updated[index].igst = e.target.value;
      setResults(updated);
    }}
  />
</td>

<td>{invoice.total_gst}</td>

<td>{invoice.gross_amount}</td>

                  <td>
                    <select
                      value={invoice.invoice_type}
                      onChange={(e) =>
                        updateType(index, e.target.value)
                      }
                    >
                      <option>Purchase</option>
                      <option>Sales</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={generateExcel}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
            }}
          >
            Generate Excel
          </button>
        </>
      )}
    </div>
  );
}

export default App;