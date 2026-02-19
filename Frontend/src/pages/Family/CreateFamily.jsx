import { useState } from "react";
import { createFamily } from "../../services/family.service";

const CreateFamily = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createFamily({ name });
      alert("Family created successfully!");
      console.log(data);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Your Family</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Family Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateFamily;
