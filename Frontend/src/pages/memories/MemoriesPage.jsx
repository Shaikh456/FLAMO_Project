import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMemories, deleteMemory } from "../../services/memory.service";
import MemoryCard from "./MemoryCard";
import "./Memories.css";

const MemoriesPage = () => {
  const { user } = useContext(AuthContext);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    try {
      const res = await getMemories({ page: 1, limit: 20 });
      if (res.success) {
        setMemories(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteMemory(id);
    fetchMemories();
  };

  useEffect(() => {
    if (user) fetchMemories();
  }, [user]);

  if (loading) return <div className="loading">Loading memories...</div>;

  return (
    <div className="memories-container">
      <div className="memories-header">
        <h2>Family Memories</h2>
      </div>

      {memories.length === 0 ? (
        <div className="empty-state">
          <p>No memories yet. Start by adding one!</p>
        </div>
      ) : (
        <div className="memories-grid">
          {memories.map((memory) => (
            <MemoryCard
              key={memory._id}
              memory={memory}
              currentUser={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoriesPage;
