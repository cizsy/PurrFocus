import React, { useState } from 'react';

function Dashboard({ 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onEditTask, 
  onToggleSubtask, 
  onAddSubtask, 
  onStartFocusing,
  onEditSubtask,
  onDeleteSubtask
}) {

  const [newTasksName, setNewTasksName] = useState("");

  const handleAddTask = () => {
    if (onAddTask(newTasksName)) {
      setNewTasksName("");
    }
  };

  // 🔥 helper progress
  const getProgress = (task) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter(s => s.completed).length;
    const percent = total === 0 ? 0 : (done / total) * 100;
    return { total, done, percent };
  };

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HEADER */}
      <div className="bg-base-200 p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Selamat datang 👋</h2>
          <p className="text-sm opacity-70">{tasks.length} task menunggu</p>
        </div>
      </div>

      {/* 🔥 INPUT */}
      <div className="flex gap-2 justify-center">
        <input
          type="text"
          placeholder="Mau berburu apa hari ini?"
          value={newTasksName}
          onChange={(e) => setNewTasksName(e.target.value)}
          className="input input-bordered w-72"
        />
        <button onClick={handleAddTask} className="btn btn-warning">
          Tambah
        </button>
      </div>

      {/* 🔥 TASK LIST */}
      <div style={{ 
        background: "#eaeaea", 
        padding: "20px", 
        borderRadius: "10px" 
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "15px" 
        }}>
          <h3>Task selesai</h3>
          <button style={{
            padding: "5px 10px",
            borderRadius: "8px",
            border: "1px solid #999",
            background: "transparent",
            cursor: "pointer"
          }}>
            + Tambah task
          </button>
        </div>

        {tasks.map(task => {
          const total = task.subtasks.length;
          const done = task.subtasks.filter(s => s.completed).length;
          const percent = total === 0 ? 0 : (done / total) * 100;

          const isActive = percent > 0 && percent < 100;

          return (
            <div key={task.id} style={{
              background: "white",
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderLeft: isActive ? "5px solid #4a6fa5" : "5px solid transparent",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
          }}>

        {/* LEFT */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "600" }}>
            {task.title}
          </div>

          <div style={{ fontSize: "12px", color: "#666" }}>
            Subtask aktif: {task.subtasks.find(s => !s.completed)?.text || "-"}
          </div>

          <div style={{
            marginTop: "6px",
            height: "4px",
            background: "#ddd",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${percent}%`,
              height: "100%",
              background: "#4a6fa5",
              transition: "0.3s"
            }} />
          </div>
        </div>

        {/* STATUS */}
        <div style={{
          marginRight: "10px",
          padding: "4px 10px",
          borderRadius: "8px",
          background: percent === 0 ? "#dbe3f0" : "#4a6fa5",
          color: percent === 0 ? "#333" : "white",
          fontSize: "12px"
        }}>
          {percent === 0 ? "Waiting" : percent === 100 ? "Done" : "Hunting"}
        </div>

        {/* BUTTON */}
        <button
          onClick={() => onStartFocusing(task)}
          style={{
            background: "#4a6fa5",
            color: "white",
            border: "none",
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Mulai
        </button>

      </div>
    );
  })}
</div>

    </div>
  );
}

export default Dashboard;