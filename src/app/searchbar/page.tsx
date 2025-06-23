"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";

export default function Dashboard() {
  const [project, setProject] = useState("");
  const [assetId, setAssetId] = useState("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project, asset_id: assetId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch data");

      setTableData(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [project, assetId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [project, assetId, fetchData]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Device Dashboard
        </h1>

        <div className="search-filters" style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Project Name"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="search-input"
            style={{ marginRight: "1rem", padding: "0.5rem" }}
          />
          <input
            placeholder="Asset ID"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="search-input"
            style={{ padding: "0.5rem" }}
          />
        </div>

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {tableData.length > 0 && (
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th
                      key={key}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        background: "#f8f8f8",
                        textAlign: "left",
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td
                        key={j}
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                        }}
                      >
                        {value?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tableData.length === 0 && (
          <p>No matching results found.</p>
        )}
      </div>
    </>
  );
}
