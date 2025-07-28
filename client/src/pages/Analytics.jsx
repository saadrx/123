import React, { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AnalyticsPage = () => {
  const chartRef = useRef();
  const [filter, setFilter] = useState("last7");

  const allData = {
    last7: {
      timeSpent: [
        { day: "Mon", time: 2 },
        { day: "Tue", time: 4 },
        { day: "Wed", time: 3 },
        { day: "Thu", time: 5 },
        { day: "Fri", time: 1 },
        { day: "Sat", time: 6 },
        { day: "Sun", time: 2 },
      ],
      goalsCompleted: [
        { category: "Study", goals: 5 },
        { category: "Health", goals: 3 },
        { category: "Work", goals: 4 },
      ],
    },
    thisMonth: {
      timeSpent: [
        { day: "Week 1", time: 18 },
        { day: "Week 2", time: 21 },
        { day: "Week 3", time: 19 },
        { day: "Week 4", time: 24 },
      ],
      goalsCompleted: [
        { category: "Study", goals: 12 },
        { category: "Health", goals: 9 },
        { category: "Work", goals: 10 },
      ],
    },
  };

  const previousWeekData = [
    { day: "Mon", time: 1 },
    { day: "Tue", time: 2 },
    { day: "Wed", time: 2 },
    { day: "Thu", time: 3 },
    { day: "Fri", time: 1 },
    { day: "Sat", time: 4 },
    { day: "Sun", time: 1 },
  ];

  const handleExportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("analytics-report.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="last7">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export as PDF
          </button>
        </div>
      </div>

      <div ref={chartRef} className="space-y-10">
        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Time Spent Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allData[filter].timeSpent}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="time" fill="#10b981" name="Current Week" />
              {filter === "last7" && (
                <Bar dataKey="time" data={previousWeekData} fill="#f59e0b" name="Previous Week" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Goals Completed by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allData[filter].goalsCompleted}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="goals" fill="#3b82f6" name="Goals" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage;
