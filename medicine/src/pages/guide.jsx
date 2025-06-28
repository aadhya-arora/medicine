import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "../styling/guide.css";

const Guide = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}&limit=1`
      );
      const data = await response.json();
      const drug = data.results[0];

      if (!drug) {
        setError("No information found.");
        setResult(null);
        return;
      }

      setResult({
        brand: drug.openfda.brand_name?.[0] || query,
        generic: drug.openfda.generic_name?.[0] || "N/A",
        manufacturer: drug.openfda.manufacturer_name?.[0] || "N/A",
        purpose: drug.purpose?.[0] || "Not specified",
        usage: drug.indications_and_usage?.[0] || "Usage info not available",
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        "The medicine not in our database. Sorry for the Inconvenience!"
      );
      setResult(null);
    }
  };

  return (
    <div>
      <div className="guide-container">
        <div className="question">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Know your medicine"
              className="typing"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="ask" onClick={handleSearch}>
              Search <FaSearch />
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="results">
            <div className="result-item">
              <h3>{result.brand}</h3>
              <p>
                <strong>Generic Name:</strong> {result.generic}
              </p>
              <p>
                <strong>Manufacturer:</strong> {result.manufacturer}
              </p>
              <p>
                <strong>Purpose:</strong> {result.purpose}
              </p>
              <div>
                <strong>Usage:</strong>
                <ul className="usage-list">
                  {result.usage
                    .split(/\n|•|-/)
                    .map(
                      (line, index) =>
                        line.trim() && <li key={index}>{line.trim()}</li>
                    )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="trending">
        <span>Trending:</span>
        <button>Aspirin</button>
        <button>Azithromycin</button>
        <button>Ibuprofen</button>
      </div>

      <div className="info-boxes">
        <h2 className="info-heading">Before you take any Medicine know </h2>
        <div className="info-card">
          <span className="emoji">💊</span>
          <h3>How to Read Medicine Labels</h3>
          <p>
            Understand what the label means — like dosage, ingredients, and
            expiry — so you take your medicine safely.
          </p>
        </div>
        <div className="info-card">
          <span className="emoji">🧪</span>
          <h3>Understand Generic vs Brand</h3>
          <p>
            Generic medicines work the same as branded ones. Learn why they're
            safe and often more affordable.
          </p>
        </div>
        <div className="info-card">
          <span className="emoji">📋</span>
          <h3>When to See a Doctor</h3>
          <p>
            Some symptoms need a doctor’s advice. Don’t self-medicate if you’re
            unsure or symptoms don’t improve.
          </p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-section">
            <h3>MediTrack</h3>
            <p>
              Helping you stay consistent, aware, and on track with your health
              every day.
            </p>
          </div>
          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Med Guide</a>
              </li>
              <li>
                <a href="#">Reminders</a>
              </li>
              <li>
                <a href="#">Search</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@medtrack.com</p>
            <p>Phone: +91-12345-67890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MediTrack | Designed with care.</p>
        </div>
      </footer>
    </div>
  );
};

export default Guide;
