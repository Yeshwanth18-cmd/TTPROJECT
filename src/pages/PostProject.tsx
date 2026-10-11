import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import api, { getApiErrorMessage } from "../services/api";

function PostProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!budgetMin || !budgetMax) {
      setError("Please enter both budget values.");
      return;
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      setError("Minimum budget cannot be greater than maximum budget.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/projects", {
        title,
        description,
        category,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("Only clients can post projects.");
      } else {
        setError(getApiErrorMessage(err, "Unable to create project. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="page-header">
            <h1>Post a Project</h1>
            <p>
              Tell talented professionals what you need and find the right
              person to build it.
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Project Title</label>

                <input
                  type="text"
                  placeholder="e.g. Build an AI-powered portfolio website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  placeholder="Describe your project, requirements, expected outcome, technologies, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={7}
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="Web Development">
                    Web Development
                  </option>
                  <option value="App Development">
                    App Development
                  </option>
                  <option value="AI & Machine Learning">
                    AI & Machine Learning
                  </option>
                  <option value="Data Science">
                    Data Science
                  </option>
                  <option value="UI/UX Design">
                    UI/UX Design
                  </option>
                  <option value="Graphic Design">
                    Graphic Design
                  </option>
                  <option value="Video Editing">
                    Video Editing
                  </option>
                  <option value="Content Writing">
                    Content Writing
                  </option>
                  <option value="Digital Marketing">
                    Digital Marketing
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="budget-grid">

                <div className="form-group">
                  <label>Minimum Budget (₹)</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Budget (₹)</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>

              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Project"}
                </button>

              </div>

            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default PostProject;