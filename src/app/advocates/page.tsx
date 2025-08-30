"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdvocateRow, buildAdvocateFilter } from "@/features/advocates/search";
import styles from "./AdvocatesTable.module.css";

const PAGE_SIZE = 25;

const AdvocatesPage = () => {
  const [items, setItems] = useState<AdvocateRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/advocates", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setItems(json.data as AdvocateRow[]);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  
  useEffect(() => {
    setPage(1);
  }, [search]);
  
  const filtered = useMemo(
    () => items.filter(buildAdvocateFilter(search)),
    [items, search]
  );

  const visible = useMemo(
    () => filtered.slice(0, PAGE_SIZE * page),
    [filtered, page]
  );

  const canLoadMore = visible.length < filtered.length;
  const loadMore = () => setPage((p) => p + 1);

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
            Showing {visible.length} of {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>
        </section>

        {loading && <p style={{ padding: "10px" }}>Loading…</p>}
        {error && !loading && (
          <p role="alert" style={{ padding: "10px" }}>Error: {error}</p>
        )}

        {!loading && !error && (
          <>
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
                          ? a.specialties.map((s, idx) => (
                              <div key={`${s}-${idx}`}>{s}</div>
                            ))
                          : a.specialties ?? "—"}
                      </td>
                      <td data-label="Years of Experience">{a.yearsOfExperience}</td>
                      <td data-label="Phone Number">{a.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {canLoadMore && (
              <button type="button" onClick={loadMore} disabled={!canLoadMore}>
                Load more
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default AdvocatesPage;
