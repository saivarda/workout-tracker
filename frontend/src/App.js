import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8080/api";
const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core"];

export default function App() {
  const [view, setView] = useState("home");
  const [sessions, setSessions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sets, setSets] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newSession, setNewSession] = useState({ name: "", date: new Date().toISOString().split("T")[0], notes: "" });
  const [newExercise, setNewExercise] = useState({ name: "", muscleGroup: "Chest", equipment: "" });
  const [logForm, setLogForm] = useState({ exerciseId: "", reps: "", weight: "", setNumber: 1 });

  useEffect(() => { fetchSessions(); fetchExercises(); }, []);

  const fetchSessions = () => axios.get(`${API}/sessions`).then(r => setSessions(r.data));
  const fetchExercises = () => axios.get(`${API}/exercises`).then(r => setExercises(r.data));
  const fetchSets = (id) => axios.get(`${API}/sessions/${id}/sets`).then(r => setSets(r.data));

  const openSession = (session) => {
    setActiveSession(session);
    fetchSets(session.id);
    setLogForm({ exerciseId: "", reps: "", weight: "", setNumber: 1 });
    setView("session");
  };

  const createSession = () => {
    if (!newSession.name) return;
    axios.post(`${API}/sessions`, newSession).then(() => {
      fetchSessions();
      setShowNewSession(false);
      setNewSession({ name: "", date: new Date().toISOString().split("T")[0], notes: "" });
    });
  };

  const createExercise = () => {
    if (!newExercise.name) return;
    axios.post(`${API}/exercises`, newExercise).then(() => {
      fetchExercises();
      setShowNewExercise(false);
      setNewExercise({ name: "", muscleGroup: "Chest", equipment: "" });
    });
  };

  const deleteExercise = (e, id) => {
    e.stopPropagation();
    axios.delete(`${API}/exercises/${id}`).then(fetchExercises);
  };

  const logSet = () => {
    if (!logForm.exerciseId || !logForm.reps || !logForm.weight) return;
    axios.post(`${API}/sessions/${activeSession.id}/sets?exerciseId=${logForm.exerciseId}`, {
      reps: parseInt(logForm.reps),
      weight: parseFloat(logForm.weight),
      setNumber: parseInt(logForm.setNumber)
    }).then(() => {
      fetchSets(activeSession.id);
      setLogForm(f => ({ ...f, reps: "", weight: "", setNumber: f.setNumber + 1 }));
    });
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    axios.delete(`${API}/sessions/${id}`).then(fetchSessions);
  };

  const filteredExercises = selectedMuscle === "All" ? exercises : exercises.filter(e => e.muscleGroup === selectedMuscle);

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">⚡ Flow</div>
        <div className="nav-links">
          <button className={`nav-btn ${view === "home" || view === "session" ? "active" : ""}`} onClick={() => setView("home")}>Workouts</button>
          <button className={`nav-btn ${view === "exercises" ? "active" : ""}`} onClick={() => setView("exercises")}>Exercises</button>
        </div>
      </nav>

      <main className="main">
        {view === "home" && (
          <div className="fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Workouts</h1>
                <p className="page-sub">{sessions.length} sessions logged</p>
              </div>
              <button className="btn-primary" onClick={() => setShowNewSession(true)}>+ New</button>
            </div>

            {showNewSession && (
              <div className="card form-card">
                <h3 className="form-title">New Session</h3>
                <input className="input" placeholder="Session name (e.g. Push Day)" value={newSession.name} onChange={e => setNewSession({...newSession, name: e.target.value})} />
                <input className="input" type="date" value={newSession.date} onChange={e => setNewSession({...newSession, date: e.target.value})} />
                <input className="input" placeholder="Notes (optional)" value={newSession.notes} onChange={e => setNewSession({...newSession, notes: e.target.value})} />
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setShowNewSession(false)}>Cancel</button>
                  <button className="btn-primary" onClick={createSession}>Create</button>
                </div>
              </div>
            )}

            <div className="sessions-list">
              {sessions.map(session => (
                <div className="session-card" key={session.id} onClick={() => openSession(session)}>
                  <div className="session-info">
                    <div className="session-name">{session.name}</div>
                    <div className="session-date">{new Date(session.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
                    {session.notes && <div className="session-notes">{session.notes}</div>}
                  </div>
                  <div className="session-actions">
                    <span className="chevron">›</span>
                    <button className="delete-btn" onClick={e => deleteSession(e, session.id)}>✕</button>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && <div className="empty">No sessions yet. Hit + New to start!</div>}
            </div>
          </div>
        )}

        {view === "exercises" && (
          <div className="fade-in">
            <div className="page-header">
              <div>
                <h1 className="page-title">Exercises</h1>
                <p className="page-sub">{exercises.length} in library</p>
              </div>
              <button className="btn-primary" onClick={() => setShowNewExercise(true)}>+ Add</button>
            </div>

            {showNewExercise && (
              <div className="card form-card">
                <h3 className="form-title">New Exercise</h3>
                <input className="input" placeholder="Exercise name" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} />
                <select className="input" value={newExercise.muscleGroup} onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})}>
                  {MUSCLE_GROUPS.filter(m => m !== "All").map(m => <option key={m}>{m}</option>)}
                </select>
                <input className="input" placeholder="Equipment (e.g. Barbell, Dumbbell)" value={newExercise.equipment} onChange={e => setNewExercise({...newExercise, equipment: e.target.value})} />
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setShowNewExercise(false)}>Cancel</button>
                  <button className="btn-primary" onClick={createExercise}>Add</button>
                </div>
              </div>
            )}

            <div className="muscle-filter">
              {MUSCLE_GROUPS.map(m => (
                <button key={m} className={`filter-btn ${selectedMuscle === m ? "active" : ""}`} onClick={() => setSelectedMuscle(m)}>{m}</button>
              ))}
            </div>

            <div className="exercise-grid">
              {filteredExercises.map(ex => (
                <div className="exercise-card" key={ex.id}>
                  <div className="exercise-header">
                    <div className="exercise-name">{ex.name}</div>
                    <button className="delete-btn" onClick={e => deleteExercise(e, ex.id)}>✕</button>
                  </div>
                  <div className="exercise-tag">{ex.muscleGroup}</div>
                  {ex.equipment && <div className="exercise-equip">{ex.equipment}</div>}
                </div>
              ))}
              {filteredExercises.length === 0 && <div className="empty">No exercises found.</div>}
            </div>
          </div>
        )}

        {view === "session" && activeSession && (
          <div className="fade-in">
            <div className="page-header">
              <div>
                <button className="back-btn" onClick={() => setView("home")}>← Workouts</button>
                <h1 className="page-title">{activeSession.name}</h1>
                <p className="page-sub">{new Date(activeSession.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              </div>
            </div>

            <div className="card form-card">
              <h3 className="form-title">Log a Set</h3>
              <select className="input" value={logForm.exerciseId} onChange={e => setLogForm({...logForm, exerciseId: e.target.value})}>
                <option value="">Select exercise...</option>
                {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
              </select>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Reps</label>
                  <input className="input" type="number" placeholder="0" value={logForm.reps} onChange={e => setLogForm({...logForm, reps: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Weight (lbs)</label>
                  <input className="input" type="number" placeholder="0" value={logForm.weight} onChange={e => setLogForm({...logForm, weight: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Set #</label>
                  <input className="input" type="number" placeholder="1" value={logForm.setNumber} onChange={e => setLogForm({...logForm, setNumber: e.target.value})} />
                </div>
              </div>
              <button className="btn-primary full-width" onClick={logSet} disabled={!logForm.exerciseId || !logForm.reps || !logForm.weight}>
                Log Set
              </button>
            </div>

            <div className="sets-list">
              <p className="section-label">{sets.length} sets logged</p>
              {sets.map(set => (
                <div className="set-row" key={set.id}>
                  <span className="set-num">#{set.setNumber}</span>
                  <span className="set-exercise">{set.exercise?.name}</span>
                  <span className="set-stats">{set.reps} × {set.weight} lbs</span>
                </div>
              ))}
              {sets.length === 0 && <div className="empty">Select an exercise and log your first set!</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
