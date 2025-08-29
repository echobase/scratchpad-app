"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdvocateRow, buildAdvocateFilter } from "@/features/advocates/search";

const AdvocatesPage = () => {
  const [advocates, setAdvocates] = useState<AdvocateRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/advocates", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        console.log("json.data ---> ", json.data)
        if (!cancelled) setAdvocates(json.data as AdvocateRow[]);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Failed to load advocates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
   () => advocates.filter(buildAdvocateFilter(search)),
   [advocates, search]
 );

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>

      <section aria-labelledby="search-heading">
        <h2 id="search-heading" className="sr-only">Search</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>
            <span style={{ display: "block" }}>Search</span>
            <input
              style={{ border: "1px solid black", padding: "4px 8px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search advocates"
              placeholder="name, city, specialty…"
            />
          </label>
          <button type="button" onClick={() => setSearch("")}>Reset</button>
        </div>
        <p style={{ marginTop: 8 }}>Searching for: <span>{search}</span></p>
      </section>

      {loading && <p>Loading…</p>}
      {error && !loading && <p role="alert">Error: {error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table>
            <caption className="sr-only">Advocates directory</caption>
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">City</th>
                <th scope="col">Degree</th>
                <th scope="col">Specialties</th>
                <th scope="col">Years of Experience</th>
                <th scope="col">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id}>
                  <td>{a.firstName}</td>
                  <td>{a.lastName}</td>
                  <td>{a.city}</td>
                  <td>{a.degree}</td>
                  <td>
                    {Array.isArray(a.specialties)
                      ? a.specialties.map((s) => <div key={s}>{s}</div>)
                      : a.specialties ?? "—"}
                  </td>
                  <td>{a.yearsOfExperience}</td>
                  <td>{a.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdvocatesPage;
