"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdvocateRow, buildAdvocateFilter } from "@/features/advocates/search";
import styles from "./AdvocatesTable.module.css";

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
        if (!cancelled) setAdvocates(json.data as AdvocateRow[]);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Failed to load advocates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(
    () => advocates.filter(buildAdvocateFilter(search)),
    [advocates, search]
  );

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="sr-only">Solace Advocates</h1>
      <div className={styles.tableUsers}>
        <div className={styles.header}>Advocates</div>

        <section aria-labelledby="search-heading" style={{ padding: "10px" }}>
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
          <p style={{ marginTop: 8 }}>
            Searching for: <span>{search}</span>
          </p>
        </section>

        {loading && <p style={{ padding: "10px" }}>Loading…</p>}
        {error && !loading && (
          <p role="alert" style={{ padding: "10px" }}>Error: {error}</p>
        )}

        {!loading && !error && (
          <div>
            <table className={styles.table}>
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
                    <td data-label="First Name">{a.firstName}</td>
                    <td data-label="Last Name">{a.lastName}</td>
                    <td data-label="City">{a.city}</td>
                    <td data-label="Degree">{a.degree}</td>
                    <td data-label="Specialties">
                      {Array.isArray(a.specialties)
                        ? a.specialties.map((s) => <div key={s}>{s}</div>)
                        : a.specialties ?? "—"}
                    </td>
                    <td data-label="Years of Experience">{a.yearsOfExperience}</td>
                    <td data-label="Phone Number">{a.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdvocatesPage;
