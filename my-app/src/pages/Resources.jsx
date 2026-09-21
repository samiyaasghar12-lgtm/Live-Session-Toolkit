import { useState } from "react";

import {
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

const iconFor = {
  PDF: FileText,
  Video,
  Link: LinkIcon,
};

export default function Resources({ darkMode, setDarkMode }) {
  const { resources, addResource, deleteResource } = useAppData();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "PDF",
    url: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState("");

  const closeModal = () => {
    setError("");
    setOpen(false);
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError("Please enter a resource name.");
      return;
    }

    setError("");
    await addResource(form);

    setJustAdded(form.name.trim());
    window.setTimeout(() => setJustAdded(""), 3000);

    setForm({ name: "", type: "PDF", url: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-area">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="page-content">
          <div className="page-heading with-action">
            <div>
              <span className="eyebrow">LIBRARY</span>
              <h1>Resources</h1>
              <p>Keep useful materials organized for your sessions.</p>
            </div>

            <button className="primary-btn" onClick={() => setOpen(true)}>
              <Plus size={17} />
              Add Resource
            </button>
          </div>

          {justAdded && (
            <p
              style={{
                color: "var(--success)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              "{justAdded}" added to Resources.
            </p>
          )}

          <div className="resource-grid">
            {resources.map((resource) => {
              const Icon = iconFor[resource.type] || LinkIcon;

              return (
                <div className="resource-card" key={resource.id}>
                  <div className="resource-icon">
                    <Icon size={22} />
                  </div>

                  <span>{resource.type}</span>
                  <h3>{resource.name}</h3>

                  {resource.description && <p>{resource.description}</p>}

                  <div className="resource-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => setView(resource)}
                    >
                      View Resource
                    </button>

                    <button
                      className="danger-icon"
                      onClick={() =>
                        void deleteResource(
                          resource.id
                        )
                      }
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Modal open={open} onClose={closeModal} title="Add resource">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Resource name"
            />

            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>PDF</option>
              <option>Video</option>
              <option>Link</option>
            </select>

            <label>URL (optional)</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />

            <label>Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {error && <p className="form-error">{error}</p>}

            <div className="modal-actions">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={save}>
                Add Resource
              </button>
            </div>
          </Modal>

          <Modal
            open={Boolean(view)}
            onClose={() => setView(null)}
            title={view?.name}
          >
            {view && (
              <div>
                <span className="eyebrow">{view.type}</span>
                <p>{view.description || "No description provided."}</p>
                <a className="primary-btn" href={view.url || "#"} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} />
                  Open Resource
                </a>
              </div>
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}