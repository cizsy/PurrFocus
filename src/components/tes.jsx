// TaskList.jsx - tambahin tombol hapus subtask
{t.subtasks.map((sub) => (
  <li key={sub.id} style={{ padding: '5px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
    <input 
      type="checkbox" 
      checked={sub.completed} 
      onChange={() => toggleSubtask(t.id, sub.id)} 
    /> 
    <span 
      style={{ 
        textDecoration: sub.completed ? 'line-through' : 'none', 
        marginLeft: '8px',
        cursor: 'pointer',
        flex: 1
      }}
      onClick={() => editSubtask(t.id, sub.id)}
    >
      {sub.text}
    </span>
    
    {/* Tombol edit */}
    <button 
      onClick={() => editSubtask(t.id, sub.id)}
      style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      ✏️
    </button>
    
    {/* Tombol hapus - TAMBAHKAN INI */}
    <button 
      onClick={() => deleteSubtask(t.id, sub.id)}
      style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
    >
      🗑️
    </button>
  </li>
))}