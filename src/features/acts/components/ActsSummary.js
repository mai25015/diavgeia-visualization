import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import Pagination from "../../../components/Pagination";

const ORGS = [
  { id: "99206919", name: "ΠΑΝΕΠΙΣΤΗΜΙΟ ΜΑΚΕΔΟΝΙΑΣ" },
  { id: "99206917", name: "ΠΑΝΕΠΙΣΤΗΜΙΟ ΚΡΗΤΗΣ" },
  { id: "99206912", name: "ΕΘΝΙΚΟ ΜΕΤΣΟΒΙΟ ΠΟΛΥΤΕΧΝΕΙΟ" },
];

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

const ActsSummary = () => {
  const [selectedOrg, setSelectedOrg] = useState(ORGS[0].id);
  const [fromYear, setFromYear] = useState(YEARS[0]);
  const [toYear, setToYear] = useState(YEARS[YEARS.length - 1]);
  const [unitsData, setUnitsData] = useState([]);
  const [totals, setTotals] = useState({ published: 0, revoked: 0, revokedPrivate: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orgInfo, setOrgInfo] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");

  const filteredUnits = unitsData.filter((unit) =>
    unit.label.toLowerCase().includes(unitSearchTerm.toLowerCase()) ||
    unit.uid.toLowerCase().includes(unitSearchTerm.toLowerCase())
  );

  const generate180DayChunks = (startDateStr, endDateStr) => {
    const chunks = [];
    let startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    while (startDate < endDate) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 179);
      if (nextDate > endDate) nextDate.setTime(endDate.getTime());
      chunks.push({
        from: startDate.toISOString().split("T")[0],
        to: nextDate.toISOString().split("T")[0],
      });
      startDate = new Date(nextDate);
      startDate.setDate(startDate.getDate() + 1);
    }

    return chunks;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [unitSearchTerm, selectedOrg, fromYear, toYear]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredUnits.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const fetchOrganizationTotals = useCallback(async () => {
    setCalculating(true);

    try {
      const dateChunks = generate180DayChunks(
        `${fromYear}-01-01`,
        `${toYear}-12-31`
      );

      let totalPublished = 0;
      let totalRevoked = 0;
      let revokedPrivateCount = 0;

      for (const chunk of dateChunks) {
        const url = `https://diavgeia.gov.gr/luminapi/opendata/search.json?org=${selectedOrg}&status=published&from_issue_date=${chunk.from}&to_issue_date=${chunk.to}&page=0&size=1`;
        const response = await fetch(`http://localhost:8080/proxy?url=${encodeURIComponent(url)}`).then((r) => r.json());
        totalPublished += response.info?.total || 0;
      }

      const orgResponse = await fetch(
        `http://localhost:8080/proxy?url=${encodeURIComponent(`https://diavgeia.gov.gr/luminapi/api/organizations/${selectedOrg}`)}`
      );
      const orgData = await orgResponse.json();
      const uid = orgData.organization?.uid || selectedOrg;

      for (const chunk of dateChunks) {
        const revokedUrl = `https://diavgeia.gov.gr/luminapi/opendata/search.json?uid=${uid}&status=revoked&from_issue_date=${chunk.from}&to_issue_date=${chunk.to}&page=0&size=1000`;
        const revokedResponse = await fetch(
          `http://localhost:8080/proxy?url=${encodeURIComponent(revokedUrl)}`
        ).then((r) => r.json());
        const revokedActs = revokedResponse.decisions || [];
        totalRevoked += revokedResponse.info?.total || 0;
        revokedPrivateCount += revokedActs.filter((act) => act.privateData === true).length;
      }

      setTotals({
        published: totalPublished,
        revoked: totalRevoked,
        revokedPrivate: revokedPrivateCount,
      });
    } catch (error) {
      console.error("Σφάλμα κατά την ανάκτηση:", error);
      setTotals({ published: 0, revoked: 0, revokedPrivate: 0 });
    } finally {
      setCalculating(false);
    }
  }, [selectedOrg, fromYear, toYear]);

  const fetchUnitsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const unitsResponse = await fetch(
        `http://localhost:8080/proxy?url=https://diavgeia.gov.gr/opendata/organizations/${selectedOrg}/units.json&status=all`
      );
      const orgResponse = await fetch(
        `http://localhost:8080/proxy?url=https://diavgeia.gov.gr/luminapi/api/organizations/${selectedOrg}`
      );

      if (!unitsResponse.ok || !orgResponse.ok) {
        throw new Error("Αποτυχία ανάκτησης δεδομένων");
      }

      const unitsJson = await unitsResponse.json();
      const orgJson = await orgResponse.json();

      setUnitsData(unitsJson.units || []);
      setOrgInfo(orgJson.organization || null);
    } catch (error) {
      console.error("Σφάλμα:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedOrg, fromYear, toYear]);

  useEffect(() => {
    fetchOrganizationTotals();
    fetchUnitsData();
  }, [fetchOrganizationTotals, fetchUnitsData]);

  const chartData = [
    { 
      name: "Δημοσιευμένες", 
      count: totals.published,
      color: "#0084c6" // blue
    },
    { 
      name: "Ανακληθείσες", 
      count: totals.revoked,
      color: "#ab0613" // red
    },
    { 
      name: "Ανακληθείσες Ιδιωτικές", 
      count: totals.revokedPrivate,
      color: "#f59e0b" // yellow
    },
  ];

  return (
    <div className="p-4 max-w-screen mx-auto bg-light text" role="main" aria-label="Στοιχεία Πράξεων">
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center" id="acts-summary-title">Στοιχεία Πράξεων</h1>

        <div 
          className="mb-12 flex flex-wrap gap-4 justify-center" 
          role="toolbar" 
          aria-label="Φίλτρα αναζήτησης"
          aria-controls="acts-table acts-chart"
        >
          <select
            className="border rounded px-3 py-2"
            value={selectedOrg}
            onChange={(e) => {
              setSelectedOrg(e.target.value);
              setFromYear(YEARS[0]);
              setToYear(YEARS[YEARS.length - 1]);
            }}
            aria-label="Επιλογή φορέα"
            aria-describedby="org-select-description"
          >
            {ORGS.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <span id="org-select-description" className="sr-only">Επιλέξτε τον φορέα για τον οποίο θέλετε να δείτε τα στοιχεία</span>

          <select 
            className="border rounded px-3 py-2" 
            value={fromYear} 
            onChange={(e) => setFromYear(Number(e.target.value))}
            aria-label="Έτος έναρξης"
            aria-describedby="from-year-description"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>Από {year}</option>
            ))}
          </select>
          <span id="from-year-description" className="sr-only">Επιλέξτε το έτος έναρξης της περιόδου</span>

          <select 
            className="border rounded px-3 py-2" 
            value={toYear} 
            onChange={(e) => setToYear(Number(e.target.value))}
            aria-label="Έτος λήξης"
            aria-describedby="to-year-description"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>Έως {year}</option>
            ))}
          </select>
          <span id="to-year-description" className="sr-only">Επιλέξτε το έτος λήξης της περιόδου</span>

          <input
            type="text"
            className="border rounded px-3 py-2 w-full max-w-xs"
            placeholder="Αναζήτηση μονάδας με όνομα ή UID..."
            value={unitSearchTerm}
            onChange={(e) => setUnitSearchTerm(e.target.value)}
            aria-label="Αναζήτηση μονάδας"
            aria-describedby="unit-search-description"
          />
          <span id="unit-search-description" className="sr-only">Πληκτρολογήστε για αναζήτηση μονάδας με όνομα ή UID</span>
        </div>

        {orgInfo && (
          <div 
            className="mb-6 p-4 bg-gray-100 rounded shadow text-center" 
            role="complementary" 
            aria-label="Πληροφορίες φορέα"
            aria-labelledby="org-info-title"
          >
            <h2 className="text-xl font-semibold" id="org-info-title">{orgInfo.label}</h2>
            {orgInfo.latinName && (
              <p className="text-sm text-gray-600 italic" aria-label={`Λατινικό όνομα: ${orgInfo.latinName}`}>
                {orgInfo.latinName}
              </p>
            )}
            <p className="text-xs text-gray-500" aria-label={`Μοναδικός αναγνωριστικός κωδικός: ${orgInfo.uid}`}>
              UID: {orgInfo.uid}
            </p>
          </div>
        )}

        <div 
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12" 
          role="list" 
          aria-label="Συνολικά στοιχεία"
        >
          <div className="bg-primary text-white p-4 rounded shadow text-center" role="listitem">
            <h3 className="font-bold text-lg" id="total-units-title">Σύνολο Μονάδων</h3>
            <p className="text-xl" aria-live="polite" aria-labelledby="total-units-title">
              {loading ? 'Φόρτωση...' : unitsData.length}
            </p>
          </div>
          <div className="bg-main text-white p-4 rounded shadow text-center" role="listitem">
            <h3 className="font-bold text-lg" id="published-title">Δημοσιευμένες</h3>
            <p className="text-xl" aria-live="polite" aria-labelledby="published-title">
              {calculating ? 'Υπολογισμός...' : totals.published}
            </p>
          </div>
          <div className="bg-error text-white p-4 rounded shadow text-center" role="listitem">
            <h3 className="font-bold text-lg" id="revoked-title">Ανακληθείσες</h3>
            <p className="text-xl" aria-live="polite" aria-labelledby="revoked-title">
              {calculating ? 'Υπολογισμός...' : totals.revoked}
            </p>
          </div>
          <div className="bg-errorfaded text-white p-4 rounded shadow text-center" role="listitem">
            <h3 className="font-bold text-lg" id="revoked-private-title">Ανακληθείσες Ιδιωτικές</h3>
            <p className="text-xl" aria-live="polite" aria-labelledby="revoked-private-title">
              {calculating ? 'Υπολογισμός...' : totals.revokedPrivate}
            </p>
          </div>
        </div>

        <div 
          className="mb-12 p-4 bg-white rounded shadow" 
          role="region" 
          aria-label="Γράφημα περίληψης"
          aria-labelledby="chart-title"
        >
          <h3 className="text-lg font-semibold text-center mb-4" id="chart-title">Γράφημα Περίληψης</h3>
          <div role="img" aria-label="Γράφημα με τις συνολικές πράξεις ανά κατηγορία">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend
                  formatter={(value) => value === "count" ? "Αριθμός Πράξεων" : value}
                />
                {chartData.map((entry, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="count"
                    fill={entry.color}
                    name={entry.name}
                    data={[entry]}
                    aria-label={`${entry.name}: ${entry.count} πράξεις`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {loading ? (
          <p role="status" aria-live="polite">Φόρτωση δεδομένων...</p>
        ) : (
          <div 
            className="overflow-x-auto bg-white rounded-lg shadow"
            role="region"
            aria-label="Λίστα μονάδων"
            id="acts-table"
          >
            <table 
              className="min-w-full table-fixed divide-y divide-gray-200"
              role="grid"
              aria-label="Λίστα μονάδων"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-1/7 px-4 py-2 text-left text-xs font-medium tracking-wider">UID Μονάδας</th>
                  <th scope="col" className="w-4/7 px-4 py-2 text-left text-xs font-medium tracking-wider">Όνομα Μονάδας</th>
                  <th scope="col" className="w-1/7 px-4 py-2 text-left text-xs font-medium tracking-wider">Κατάσταση</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((unit) => (
                  <tr key={unit.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-mono text truncate" aria-label={`UID μονάδας: ${unit.uid}`}>
                      {unit.uid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text truncate" aria-label={`Όνομα μονάδας: ${unit.label}`}>
                      {unit.label}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                      <div className="text-[10px] text-gray-500">Κατάσταση:</div>
                      <div 
                        className="flex items-center gap-1" 
                        role="status"
                        aria-label={`Η μονάδα είναι ${unit.active ? 'ενεργή' : 'ανενεργή'}`}
                      >
                        <span 
                          className={`w-2 h-2 rounded-full ${unit.active ? 'bg-green-400' : 'bg-red-400'}`}
                          aria-hidden="true"
                        />
                        <span>{unit.active ? 'Ενεργό' : 'Ανενεργό'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error && (
          <div 
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
            aria-live="assertive"
            aria-label="Μήνυμα σφάλματος"
          >
            Σφάλμα: {error}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
          aria-label="Πλοήγηση σελίδων"
        />
      </div>
    </div>
  );
};

export default ActsSummary;
