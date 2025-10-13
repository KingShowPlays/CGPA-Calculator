"use client";
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
      <style jsx global>{`
        /* pasted globals.css (converted) */
        :root {
          --Grey: hsl(0, 0%, 20%);
          --Dark-Grey: hsl(0, 0%, 12%);
        }
        html {
          scroll-behavior: smooth;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Franklin Gothic Medium", "Arial Narrow", Arial,
            sans-serif;
          background-color: rgb(246, 243, 243);
          width: 90%;
          margin: auto;
        }
        p.logo {
          font-size: 20px;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          min-height: 70px;
        }
        .star {
          height: 30px;
          width: 30px;
        }
        .showcase {
          text-align: center;
          margin: 30px 0px;
          margin-top: 10px;
        }
        .form-1,
        .form-2,
        .form-3,
        .form-4,
        .form-5,
        .form-6 {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin: auto;
          margin-bottom: 40px;
        }
        .head {
          text-align: center;
          font-weight: bolder;
          font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
            sans-serif;
          text-decoration: underline;
        }
        .title {
          margin: 20px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title p {
          background-color: var(--Dark-Grey);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-weight: normal;
          font-size: 16px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .result {
          position: relative;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
        }
        .score {
          padding: 10px;
          font-size: 20px;
        }
        input {
          width: 70%;
          border-radius: 10px;
        }
        button {
          padding: 10px;
          background-color: black;
          color: white;
          text-align: center;
          border-radius: 7px;
          font-size: 18px;
          border: none;
          transition: 0.3s;
          cursor: pointer;
        }
        button:hover,
        button:active {
          transform: scale(1.1);
        }
        .cgpa {
          text-align: center;
          margin: 20px 0px;
        }
        #final {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          width: 25%;
        }
        .tabViewBox {
          position: absolute;
          left: 50%;
          background-color: white;
          width: 350px;
          padding: 20px;
          border-radius: 20px;
          border: 2px solid red;
          transform: translateX(-50%);
          margin: auto;
          display: flex;
          gap: 1em;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          transition: 0.3s;
        }
        .show-tabBox {
          opacity: 1;
          pointer-events: visible;
          visibility: visible;
        }
        .tabViewBox > p {
          text-align: center;
        }
        .tabViewBox div {
          display: flex;
          align-items: center;
          gap: 1em;
        }
        .tabViewBox button {
          width: 50px;
        }
        #gpa {
          background-color: black;
          color: white;
          width: 70%;
          padding: 10px;
          border-top-right-radius: 10px;
        }
        .deg {
          margin: 20px 0px 0px 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        #degree {
          font-size: 20px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-weight: bold;
          background-color: yellow;
          border-radius: 10px;
          text-transform: uppercase;
        }
        #clear {
          background-color: rgb(255, 0, 0, 0.9);
        }
        .table-view {
          margin: auto;
          margin-top: 2em;
          display: none;
          justify-content: center;
          width: 100%;
          opacity: 0;
          padding: 10px;
          transition: 0.3s;
        }
        .show-table {
          display: flex;
          opacity: 1;
        }
        .table-head > td:not(:nth-child(2)) {
          font-size: 2em;
        }
        .close-table {
          font-size: 2.5em;
          cursor: pointer;
          transition: 0.3s;
        }
        .close-table:hover {
          background-color: yellow;
          color: red;
        }
        th,
        td {
          text-align: center;
          padding: 10px;
        }
        th {
          background-color: yellow;
          font-size: 1.5em;
        }
        td {
          font-size: 1.1em;
        }
        .semesters > td {
          background-color: red;
          color: white;
        }
        th,
        td {
          border: 2px solid black;
        }
        pre {
          background-color: rgb(255, 249, 241);
          margin: 20px 0px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          padding: 10px;
        }
        footer a:hover {
          transform: scale(1.1);
        }
        a .address {
          width: 30px;
          height: 30px;
        }
        #formone,
        #formtwo,
        #formthree,
        #formfour,
        #formfive,
        #formsix {
          display: flex;
          font-size: 1.3em;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: 0.3s;
        }
        :is(
            #formone,
            #formtwo,
            #formthree,
            #formfour,
            #formfive,
            #formsix
          ):hover {
          transform: scale(1.05);
        }
        :is(
            #formone,
            #formtwo,
            #formthree,
            #formfour,
            #formfive,
            #formsix
          ):hover
          + .mypointer {
          padding-left: 5px;
        }
        .point {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.3em;
        }
        .mypointer {
          cursor: pointer;
          font-size: 2em;
          transform: rotate(270deg);
          color: black;
          transition: 0.3s;
        }
        .mypointer:hover {
          transform: rotate(360deg);
          color: rgb(15, 13, 13);
        }
        .current-pointer {
          transform: rotate(90deg);
          color: rgb(71, 71, 71);
        }
        .form-1,
        .form-2,
        .form-3,
        .form-4,
        .form-5,
        .form-6 {
          height: 0;
          opacity: 0;
          pointer-events: none;
          transition: 0.3s;
        }
        .form-show {
          height: auto;
          opacity: 1;
          pointer-events: visible;
        }
        .btn {
          position: fixed;
          bottom: 50px;
          left: 20px;
          background: conic-gradient(rgb(19, 177, 239) 0%, transparent 0%);
          border-radius: 50%;
          width: 70px;
          height: 70px;
          z-index: 22;
          visibility: hidden;
          opacity: 0;
          transition: 0.5s;
        }
        .up {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          color: black;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          border: none;
          font-size: 2.8em;
          text-align: center;
          cursor: pointer;
          visibility: hidden;
          opacity: 0;
          transition: 0.5s;
        }
        .show {
          display: block;
          visibility: visible;
          opacity: 1;
        }
        footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70px;
          color: black;
          margin-top: 50px;
          text-align: center;
        }
        footer a {
          color: black;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: 0.3s;
        }
        footer p {
          display: flex;
          gap: 0.3em;
        }
        @media (max-width: 680px) {
          #final {
            width: 50%;
          }
          #gpa {
            width: 50%;
          }
        }
        @media (max-width: 400px) {
          input {
            width: 60%;
          }
          #gpa {
            background: white;
            color: black;
          }
        }
        @media (max-width: 300px) {
          .title p {
            padding: 10px;
            font-size: 14px;
          }
          .course,
          .cu,
          .score {
            font-size: 14px;
          }
          input.score {
            width: 50%;
          }
          #degree,
          #clear,
          #first,
          #second,
          #third,
          #fourth,
          #fifth,
          #sixth,
          #final {
            font-size: 14px;
          }
        }
        @media (max-width: 250px) {
          .title p {
            padding: 8px;
            font-size: 10px;
          }
          .course,
          .cu,
          .score {
            font-size: 10px;
          }
          #degree,
          #clear,
          #clear,
          #first,
          #second,
          #third,
          #fourth,
          #fifth,
          #sixth,
          p,
          #final {
            font-size: 12px;
          }
        }
        @media (max-width: 200px) {
          pre,
          p,
          #degree,
          #clear,
          #first,
          #second,
          #third,
          #fourth,
          #fifth,
          #sixth,
          #final {
            font-size: 10px;
          }
          .title > p {
            background-color: transparent;
            color: black;
          }
        }
        @media (max-width: 150px) {
          .deg {
            flex-direction: column;
          }
          .head {
            margin-bottom: 20px;
          }
          .row {
            width: 110%;
          }
          pre,
          .course {
            font-size: 6px;
          }
          input.score {
            width: 100%;
          }
          header {
            justify-content: space-between;
            gap: 0px;
          }
          .star {
            height: 20px;
            width: 20px;
          }
          .result {
            flex-direction: column;
          }
        }
        @media (max-width: 100px) {
          .row {
            flex-direction: column;
            gap: 10px;
          }
          .title {
            display: none;
          }
          h1,
          p.logo {
            font-size: 15px;
          }
          .course,
          .cu,
          .score,
          .head {
            font-size: 18px;
          }
        }
      `}</style>

      <header id="header">
        <img
          src="/fontawesome/svgs/regular/star.svg"
          alt="star"
          className="star"
        />
        <p className="logo">KingShow</p>
      </header>

      <section className="showcase">
        <h1>Simple GPA calculator</h1>
        <code>
          This was created for <mark>Computer Science</mark> U2022, so it only
          contains the courses offered then,{" "}
          <b>none of your data is saved here :)</b>
        </code>
      </section>

      <div className="container">
        {semesters.map((sem, semIdx) => (
          <React.Fragment key={semIdx}>
            <div className="point">
              <p
                className="head"
                id={`form${
                  ["one", "two", "three", "four", "five", "six"][semIdx]
                }`}
                onClick={() => {
                  const formEl = document.querySelector(`.form-${semIdx + 1}`);
                  formEl?.classList.toggle("form-show");
                }}
              >
                Year {Math.floor(semIdx / 2) + 1} -{" "}
                {semIdx % 2 === 0 ? "1st" : "2nd"} semester
              </p>
              <span className="mypointer">&gt;</span>
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
          </React.Fragment>
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
            e.preventDefault();
            setShowTableBox(true);
          }}
        >
          {"Calculate CGPA"}
        </button>
        <div className={`tabViewBox ${showTableBox ? "show-tabBox" : ""}`}>
          <p>Would you also like to view it in a table format ?</p>
          <div>
            <button
              className="noView"
              onClick={(e) => {
                e.preventDefault();
                setShowTableBox(false);
                setTableVisible(false);
              }}
            >
              No
            </button>
            <button
              className="yesView"
              onClick={(e) => {
                e.preventDefault();
                calculateFinal();
                setShowTableBox(false);
              }}
            >
              Yes
            </button>
          </div>
        </div>
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
        className={`table-view ${tableVisible ? "show-table" : ""}`}
        ref={tableRef}
      >
        <tbody>
          <tr className="table-head">
            <td colSpan={5}>Table View</td>
            <td
              className="close-table"
              colSpan={1}
              onClick={() => setTableVisible(false)}
            >
              &times;
            </td>
          </tr>
          <tr className="head-row">
            <th colSpan={2}>Year 1</th>
            <th colSpan={2}>Year 2</th>
            <th colSpan={2}>Year 3</th>
          </tr>
          <tr className="semesters">
            <td>1st Sem..</td>
            <td>2nd Sem..</td>
            <td>1st Sem..</td>
            <td>2nd Sem..</td>
            <td>1st Sem..</td>
            <td>2nd Sem..</td>
          </tr>
          <tr>
            <td className="fory11">{gpas[0]}</td>
            <td className="fory12">{gpas[1]}</td>
            <td className="fory21">{gpas[2]}</td>
            <td className="fory22">{gpas[3]}</td>
            <td className="fory31">{gpas[4]}</td>
            <td className="fory32">{gpas[5]}</td>
          </tr>
          <tr>
            <th colSpan={6}>CGPA Per Session</th>
          </tr>
          <tr>
            <td className="cgfory1" colSpan={2}>
              {(
                (parseFloat(gpas[0]) || 0 + parseFloat(gpas[1]) || 0) / 2
              ).toFixed(3)}
            </td>
            <td className="cgfory2" colSpan={2}>
              {(
                (parseFloat(gpas[2]) || 0 + parseFloat(gpas[3]) || 0) / 2
              ).toFixed(3)}
            </td>
            <td className="cgfory3" colSpan={2}>
              {(
                (parseFloat(gpas[4]) || 0 + parseFloat(gpas[5]) || 0) / 2
              ).toFixed(3)}
            </td>
          </tr>
          <tr>
            <th colSpan={6}>Final CGPA</th>
          </tr>
          <tr>
            <td className="myCgpa" colSpan={6}>
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

      <code>
        <pre>
          {`Classification Guide:
──────────────────────────────
🏅 First Class Honour   →  4.50  –  5.00
🎖️ Second Class Upper  →  3.50  –  4.49
🎓 Second Class Lower  →  2.40  –  3.49
📘 Third Class         →  1.50  –  2.39
✅ Pass                →  1.00  –  1.49`}
        </pre>
      </code>

      <div className="btn">
        <button
          className="up"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          &uarr;
        </button>
      </div>

      <footer>
        <p>
          &copy; Created by{" "}
          <a href="https://kingsworks.vercel.app">KingShowPlays</a>, 2025
        </p>
        <a href="mailto:davinateee@gmail.com">
          <img
            src="/fontawesome/svgs/regular/address-card.svg"
            alt="address-card"
            className="address"
          />
          Inbox Me
        </a>
      </footer>
    </main>
  );
}
