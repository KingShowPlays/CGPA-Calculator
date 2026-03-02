"use client";
import { toastConfirm } from "@/components/toastConfirm";
import React, { useEffect, useRef, useState } from "react";

export default function Page() {
  // define semester data (course label and credit unit)
  const semesters = [
    [
      { id: "ges100", label: "GES100.1", cu: 3 },
      { id: "ges102", label: "GES102.1", cu: 2 },
      { id: "mth110", label: "MTH110.1", cu: 3 },
      { id: "mth120", label: "MTH120.1", cu: 3 },
      { id: "phy101", label: "PHY101.1", cu: 3 },
      { id: "phy102", label: "PHY102.1", cu: 1 },
      { id: "csc180", label: "CSC180.1", cu: 2 },
      { id: "chem130", label: "CHM130.1", cu: 3 },
      { id: "fsb101", label: "FSB101.1", cu: 3 },
    ],
    [
      { id: "ges101", label: "GES101.2", cu: 2 },
      { id: "csc182", label: "CSC182.2", cu: 2 },
      { id: "csc183", label: "CSC183.2", cu: 2 },
      { id: "mth114", label: "MTH114.2", cu: 3 },
      { id: "mth124", label: "MTH124.2", cu: 3 },
      { id: "ges103", label: "GES103.2", cu: 2 },
      { id: "phy112", label: "PHY112.2", cu: 3 },
      { id: "phy103", label: "PHY103.2", cu: 1 },
      { id: "sta160", label: "STA160.2", cu: 3 },
    ],
    [
      { id: "mth270", label: "MTH270.1", cu: 3 },
      { id: "sta260", label: "STA260.1", cu: 3 },
      { id: "csc280", label: "CSC280.1", cu: 3 },
      { id: "csc281", label: "CSC281.1", cu: 2 },
      { id: "csc283", label: "CSC283.1", cu: 2 },
      { id: "csc284", label: "CSC284.1", cu: 2 },
      { id: "csc288", label: "CSC288.1", cu: 2 },
      { id: "mth210", label: "MTH210.1", cu: 3 },
    ],
    [
      { id: "csc282", label: "CSC282.2", cu: 2 },
      { id: "csc285", label: "CSC285.2", cu: 2 },
      { id: "csc286", label: "CSC286.2", cu: 2 },
      { id: "csc287", label: "CSC287.2", cu: 2 },
      { id: "fsc2c1", label: "FSC2C1.2", cu: 1 },
      { id: "mth224", label: "MTH224.2", cu: 2 },
      { id: "mth250", label: "MTH250.2", cu: 3 },
      { id: "sta262", label: "STA262.2", cu: 3 },
    ],
    [
      { id: "ges300", label: "GES300.1", cu: 2 },
      { id: "csc395", label: "CSC395.1", cu: 3 },
      { id: "csc382", label: "CSC382.1", cu: 2 },
      { id: "csc394", label: "CSC394.1", cu: 3 },
      { id: "csc396", label: "CSC396.1", cu: 3 },
      { id: "csc397", label: "CSC397.1", cu: 2 },
      { id: "sta370", label: "STA370.1", cu: 3 },
    ],
    [{ id: "csc300", label: "Industrial Training / CSC300.2", cu: 9 }],
  ];

  // state: inputs per semester as array of arrays
  const [values, setValues] = useState(() =>
    semesters.map((s) => s.map(() => ""))
  );
  const [gpas, setGpas] = useState(() => Array(7).fill("0.0"));
  const [showTableBox, setShowTableBox] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [finalCgpa, setFinalCgpa] = useState("0.0");
  const [degree, setDegree] = useState("");
  const tableRef = useRef(null);
  const [imageData, setImageData] = useState("");
  // focusRefs will hold refs for every input across all semesters (flattened)
  const focusRefs = useRef([]);
  const totalCU = semesters.flat().reduce((sum, c) => sum + c.cu, 0);
  const cgpaValue = Math.max(0, Math.min(5, parseFloat(finalCgpa) || 0));
  const ringRadius = 86;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - cgpaValue / 5);

  // build a flat array length once when component mounts
  useEffect(() => {
    // initialize refs array with correct length
    const totalInputs = semesters.reduce((sum, s) => sum + s.length, 0);
    focusRefs.current = Array.from({ length: totalInputs }).map(
      (r, i) => focusRefs.current[i] ?? React.createRef()
    );
  }, []);

  // helpers
  function getGradePoint(score) {
    if (score >= 70) return 5;
    if (score >= 60) return 4;
    if (score >= 50) return 3;
    if (score >= 45) return 2;
    if (score >= 40) return 1;
    return 0;
  }
  function getDegree(cgpaVal) {
    if (cgpaVal >= 4.5) return "You are currently on 1st Class";
    if (cgpaVal >= 3.5) return "You are currently on 2nd Class Upper";
    if (cgpaVal >= 2.4) return "You are currently on 2nd Class Lower";
    if (cgpaVal >= 1.5) return "You are currently on 3rd Class";
    if (cgpaVal >= 1.0) return "Pass";
    return "Failed";
  }

  // calculate GPA for a semester
  function calculateGPAForSemester(semesterIndex) {
    const rows = semesters[semesterIndex];
    let totalPoints = 0;
    let totalCredits = 0;
    rows.forEach((r, idx) => {
      const raw = values[semesterIndex][idx];
      const score = parseInt(raw, 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        totalCredits += r.cu;
        totalPoints += getGradePoint(score) * r.cu;
      }
    });
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGpas((prev) => {
      const next = [...prev];
      next[semesterIndex] = gpa.toFixed(2);
      return next;
    });
    return gpa;
  }

  // calculate final CGPA (averaging six semesters)
  function calculateFinal() {
    // ensure GPA values are numbers
    const numericGpas = gpas.slice(0, 6).map((g) => parseFloat(g) || 0);
    // fill in any uncalculated semester by computing it
    numericGpas.forEach((v, i) => {
      if (v === 0) numericGpas[i] = parseFloat(calculateGPAForSemester(i)) || 0;
    });

    const avg = numericGpas.reduce((a, b) => a + b, 0) / 6;
    setFinalCgpa(avg.toFixed(2));
    setDegree(getDegree(avg));

    // also compute per-session (year) GPAs to show in table
    setTableVisible(true);
  }

  // input change handler
  function handleChange(semIdx, inputIdx, val) {
    // only digits
    const cleaned = val.replace(/\D/g, "");
    setValues((prev) => {
      const next = prev.map((arr) => [...arr]);
      next[semIdx][inputIdx] = cleaned;
      return next;
    });
  }

  function clearAll() {
    setValues(semesters.map((s) => s.map(() => "")));
    setGpas(Array(7).fill("0.0"));
    setFinalCgpa("0.0");
    setDegree("");
    setTableVisible(false);
    setImageData("");
  }

  // capture table using html2canvas dynamically (browser only)
  async function captureTable() {
    if (!tableRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const data = canvas.toDataURL("image/png");
    setImageData(data);
  }

  async function shareImage() {
    if (!imageData) return alert("No image to share");
    if (!navigator.share) return alert("Sharing not supported on this browser");
    try {
      const res = await fetch(imageData);
      const blob = await res.blob();
      const file = new File([blob], "table.png", { type: "image/png" });
      await navigator.share({ files: [file], title: "CGPA Table" });
    } catch (e) {
      console.error(e);
      alert("Share failed");
    }
  }
  async function handleTab(e) {
    e.preventDefault();
    const confirm = await toastConfirm(
      "Would you also like to view it in a table format ?"
    );
    if (!confirm) {
      setShowTableBox(false);
      setTableVisible(false);
      return;
    }
    calculateFinal();
    setShowTableBox(true);
  }
  // show/hide tab box helper
  useEffect(() => {
    if (showTableBox) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showTableBox]);

  // scroll button visibility handled with CSS and a simple listener
  useEffect(() => {
    function onScroll() {
      // trigger re-render for potential side-effects; not needed here
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <section className="showcase">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              Smart CGPA Toolkit by <sub> Kingdavid Christian</sub>
            </span>
            <h1>Simple GPA calculator</h1>
            <p className="hero-sub">
              Track each semester, see your trend, and lock your target CGPA
              with clarity.
            </p>
            <code>
              This was created for <mark>Computer Science</mark> U2022, so it
              only contains the courses offered then,{" "}
              <b>none of your data is saved here :)</b>
            </code>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit-card">
              <svg
                className="progress-ring"
                width="220"
                height="220"
                viewBox="0 0 220 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
                <circle
                  cx="110"
                  cy="110"
                  r="86"
                  stroke="#e5e7eb"
                  strokeWidth="14"
                />
                <circle
                  className="ring-value"
                  cx="110"
                  cy="110"
                  r="86"
                  stroke="url(#ringGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: ringCircumference,
                    strokeDashoffset: ringOffset,
                  }}
                />
                <circle cx="110" cy="110" r="60" fill="#ffffff" />
                <text
                  x="110"
                  y="104"
                  textAnchor="middle"
                  className="ring-label"
                >
                  CGPA
                </text>
                <text
                  x="110"
                  y="136"
                  textAnchor="middle"
                  className="ring-value-text"
                >
                  {cgpaValue.toFixed(2)}
                </text>
              </svg>
              <div className="hero-stats">
                <div>
                  <p className="stat-title">Semesters</p>
                  <p className="stat-value">6</p>
                </div>
                <div>
                  <p className="stat-title">Total CU</p>
                  <p className="stat-value">{totalCU}</p>
                </div>
                <div>
                  <p className="stat-title">Target</p>
                  <p className="stat-value">4.50</p>
                </div>
              </div>
            </div>
            <div className="orbit-ring"></div>
            <div className="orbit-dot"></div>
          </div>
        </div>
      </section>

      <div className="container">
        {semesters.map((sem, semIdx) => (
          <div key={semIdx} className="semester-card">
            <div
              className="point"
              onClick={(e) => {
                const formEl = document.querySelector(`.form-${semIdx + 1}`);
                formEl?.classList.toggle("form-show");
                const card = e.currentTarget.closest(".semester-card");
                card?.classList.toggle("semester-open");
              }}
            >
              <p
                className="head"
                id={`form${
                  ["one", "two", "three", "four", "five", "six"][semIdx]
                }`}
              >
                Year {Math.floor(semIdx / 2) + 1} -{" "}
                {semIdx % 2 === 0 ? "1st" : "2nd"} semester
              </p>
              <span className="mypointer" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <form
              className={`form-${semIdx + 1}`}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="title">
                <p className="course">COURSE CODE</p>
                <p className="score">SCORE</p>
                <p className="cu">CU</p>
              </div>

              {sem.map((course, idx) => (
                <div className="row" key={course.id}>
                  <label htmlFor={course.id} className="course">
                    {course.label}
                  </label>
                  <input
                    id={course.id}
                    ref={(el) => {
                      // compute flattened index for this semester/input
                      const flatIndex =
                        semesters
                          .slice(0, semIdx)
                          .reduce((a, b) => a + b.length, 0) + idx;
                      // assign element to ref current (works with function refs)
                      focusRefs.current[flatIndex] = el;
                    }}
                    type="number"
                    className="score"
                    max={100}
                    min={0}
                    placeholder="Enter Score"
                    value={values[semIdx][idx]}
                    onChange={(e) => handleChange(semIdx, idx, e.target.value)}
                    onInput={(e) => {
                      // ensure digits only
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /\D/g,
                        ""
                      );
                      // auto-advance if length === 2
                      const flatIndex =
                        semesters
                          .slice(0, semIdx)
                          .reduce((a, b) => a + b.length, 0) + idx;
                      if (
                        e.currentTarget.value.length === 2 &&
                        flatIndex < focusRefs.current.length - 1
                      ) {
                        const nextEl = focusRefs.current[flatIndex + 1];
                        nextEl?.focus?.();
                      }
                    }}
                    onKeyDown={(e) => {
                      const flatIndex =
                        semesters
                          .slice(0, semIdx)
                          .reduce((a, b) => a + b.length, 0) + idx;
                      if (
                        e.key === "Backspace" &&
                        e.currentTarget.value.length === 0 &&
                        flatIndex > 0
                      ) {
                        const prevEl = focusRefs.current[flatIndex - 1];
                        prevEl?.focus?.();
                      } else if (
                        e.key === "Enter" &&
                        e.currentTarget.value.length > 0 &&
                        flatIndex < focusRefs.current.length - 1
                      ) {
                        const nextEl = focusRefs.current[flatIndex + 1];
                        nextEl?.focus?.();
                      }
                    }}
                  />

                  <p className="cu">{course.cu}</p>
                </div>
              ))}

              <div className="row result">
                <button
                  id={
                    ["first", "second", "third", "fourth", "fifth", "sixth"][
                      semIdx
                    ]
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    calculateGPAForSemester(semIdx);
                  }}
                >
                  Calculate
                </button>
                <p id={`gpa${semIdx + 1}`}>
                  Your GPA for {semIdx % 2 === 0 ? "1st" : "2nd"} semester is :{" "}
                  <span className={`gpa-${semIdx + 1}`}>{gpas[semIdx]}</span>
                </p>
              </div>
            </form>
          </div>
        ))}
      </div>

      <p className="cgpa">
        Your <mark>CGPA</mark> is the summation of your GPA of both 1st and 2nd
        semester divided by 2.
      </p>

      <div className="result">
        <button
          id="final"
          onClick={(e) => {
            handleTab(e);
          }}
        >
          {"Calculate CGPA"}
        </button>

        <p id="gpa">
          Your CGPA is : <span className="gpa-final">{finalCgpa}</span>
        </p>
      </div>

      <div className="deg">
        <p id="degree">{degree}</p>
        <button
          id="clear"
          onClick={(e) => {
            e.preventDefault();
            clearAll();
          }}
        >
          Clear All
        </button>
      </div>

      <table
        className={`cgpa-table ${tableVisible ? "show-table" : ""}`}
        ref={tableRef}
      >
        <thead>
          <tr>
            <th colSpan={6} className="table-title">
              Cumulative GPA Table
              <span
                className="close-table"
                onClick={() => setTableVisible(false)}
                title="Close Table"
              >
                &times;
              </span>
            </th>
          </tr>
          <tr>
            <th colSpan={2}>Year 1</th>
            <th colSpan={2}>Year 2</th>
            <th colSpan={2}>Year 3</th>
          </tr>
          <tr className="semesters">
            <th>1st Sem</th>
            <th>2nd Sem</th>
            <th>1st Sem</th>
            <th>2nd Sem</th>
            <th>1st Sem</th>
            <th>2nd Sem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{gpas[0]}</td>
            <td>{gpas[1]}</td>
            <td>{gpas[2]}</td>
            <td>{gpas[3]}</td>
            <td>{gpas[4]}</td>
            <td>{gpas[5]}</td>
          </tr>

          <tr className="section-head">
            <th colSpan={6}>CGPA Per Session</th>
          </tr>
          <tr>
            <td colSpan={2}>
              {((parseFloat(gpas[0]) + parseFloat(gpas[1]) || 0) / 2).toFixed(
                3
              )}
            </td>
            <td colSpan={2}>
              {((parseFloat(gpas[2]) + parseFloat(gpas[3]) || 0) / 2).toFixed(
                3
              )}
            </td>
            <td colSpan={2}>
              {((parseFloat(gpas[4]) + parseFloat(gpas[5]) || 0) / 2).toFixed(
                3
              )}
            </td>
          </tr>

          <tr className="section-head">
            <th colSpan={6}>Final CGPA</th>
          </tr>
          <tr>
            <td className="final-cgpa" colSpan={6}>
              {finalCgpa}
            </td>
          </tr>

          <tr>
            <td colSpan={6}>
              <div className="convert">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    captureTable();
                  }}
                >
                  Convert to Image
                </button>
                &nbsp;
                <button
                  id="shareButton"
                  style={{ display: imageData ? "inline-block" : "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    shareImage();
                  }}
                >
                  Share Image
                </button>
                <br />
                {imageData && (
                  <img
                    id="tableImage"
                    width={300}
                    height={300}
                    style={{ marginTop: 10 }}
                    src={imageData}
                    alt="table"
                  />
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <section className="classification">
        <div className="classification-head">
          <span>Classification Guide</span>
          <p>Know where your CGPA places you.</p>
        </div>
        <div className="classification-grid">
          <div className="classification-row">
            <span className="classification-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 2l2.2 4.5 5 .7-3.6 3.4.9 4.9L10 13.7 5.5 15.5l.9-4.9L2.8 7.2l5-.7L10 2z" />
              </svg>
            </span>
            <span className="classification-label">First Class Honour</span>
            <span className="classification-range">4.50 – 5.00</span>
          </div>
          <div className="classification-row">
            <span className="classification-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 2l2.2 4.5 5 .7-3.6 3.4.9 4.9L10 13.7 5.5 15.5l.9-4.9L2.8 7.2l5-.7L10 2z" />
              </svg>
            </span>
            <span className="classification-label">Second Class Upper</span>
            <span className="classification-range">3.50 – 4.49</span>
          </div>
          <div className="classification-row">
            <span className="classification-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 2l2.2 4.5 5 .7-3.6 3.4.9 4.9L10 13.7 5.5 15.5l.9-4.9L2.8 7.2l5-.7L10 2z" />
              </svg>
            </span>
            <span className="classification-label">Second Class Lower</span>
            <span className="classification-range">2.40 – 3.49</span>
          </div>
          <div className="classification-row">
            <span className="classification-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M3 7h14v9H3zM6 4h8v3H6z" />
              </svg>
            </span>
            <span className="classification-label">Third Class</span>
            <span className="classification-range">1.50 – 2.39</span>
          </div>
          <div className="classification-row">
            <span className="classification-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M8 13.5L4.5 10l1.4-1.4L8 10.7l6.1-6.1L15.5 6z" />
              </svg>
            </span>
            <span className="classification-label">Pass</span>
            <span className="classification-range">1.00 – 1.49</span>
          </div>
        </div>
      </section>

      <div className="btn">
        <button
          className="up"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          &uarr;
        </button>
      </div>
    </main>
  );
}
