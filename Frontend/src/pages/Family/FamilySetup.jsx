import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createFamily, joinFamily } from "../../services/family.service";
import { AuthContext } from "../../context/AuthContext";
import "./Family.css";

const FamilySetup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [familyName, setFamilyName] = useState("");
  const [joinId, setJoinId] = useState("");

  const handleCreate = async () => {
    try {
      const res = await createFamily({ name: familyName });

      updateUser({ ...user, family: res.data._id });

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await joinFamily({ familyId: joinId });

      updateUser({ ...user, family: res.data._id });

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="family-setup">
      <h1>Welcome to FLAMO</h1>
      <p>Choose how you'd like to proceed</p>

      <div className="family-options">

        <div className="family-card">
          <h3>Create New Family</h3>
          <input
            type="text"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
        </div>

        <div className="family-card">
          <h3>Join Existing Family</h3>
          <input
            type="text"
            placeholder="Enter Family ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>

        <div className="family-card">
          <h3>Skip For Now</h3>
          <button onClick={handleSkip}>Skip</button>
        </div>

      </div>
    </div>
  );
};

export default FamilySetup;
