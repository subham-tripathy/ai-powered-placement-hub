import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "./functions";

export default function RankJob() {
  const { id: jobId } = useParams();
  const [rankedStudents, setRankedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchRankedStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API}/jobs/${jobId}/rank`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: jobId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ranked students");
        }

        const data = await response.json();

        if (data.status === "success") {
          setRankedStudents(data.rankedStudents);
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankedStudents();
  }, [jobId]);

  if (loading) return <p>Loading ranked students...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Ranked Students for Job {jobId}</h2>
      {rankedStudents.length === 0 ? (
        <p>No students eligible for this job.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rankedStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
