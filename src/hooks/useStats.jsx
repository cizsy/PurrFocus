import { useMemo } from 'react';

function useStats(tasks = []) {
  const stats = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    // 1. Task Selesai (Semua subtask beres)
    const completedTasks = safeTasks.filter(task => {
      if (!task.subtasks || task.subtasks.length === 0) return false;
      return task.subtasks.every(sub => sub.completed);
    }).length;

    // 2. Progres Subtasks
    const totalSubtasks = safeTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
    const doneSubtasks = safeTasks.reduce((acc, t) => 
      acc + (t.subtasks?.filter(s => s.completed).length || 0), 0
    );

    // 3. Skor Fokus & Progres Global
    const focusScore = totalSubtasks === 0 ? 0 : Math.round((doneSubtasks / totalSubtasks) * 100);
    const totalCount = safeTasks.length;

    // 4. LOGIKA DINAMIS: Distribusi Kategori
    // Menghitung berapa persen tiap kategori dari total task
    const categories = ["Umum", "Kerja", "Belajar", "Hobby"];
    const categoryDistribution = categories.map(cat => {
      const count = safeTasks.filter(t => t.category === cat).length;
      const percentage = totalCount === 0 ? 0 : Math.round((count / totalCount) * 100);
      
      // Tentukan warna manual biar konsisten dengan UI
      const colors = {
        Umum: "bg-slate-400",
        Kerja: "bg-purple-500",
        Belajar: "bg-blue-500",
        Hobby: "bg-orange-500"
      };

      return { label: cat, value: percentage, color: colors[cat] };
    });

    // 5. Data Dummy (Sambil nunggu fitur log Pomodoro)
    const focusTimeToday = "2j 15m"; 
    const weeklyDistribution = [40, 25, 80, 45, 90, 30, 15]; 

    return {
      totalTasks: totalCount,
      completedTasks,
      focusScore,
      focusTimeToday,
      weeklyDistribution,
      categoryDistribution, // Data hasil olahan dinamis
      progressPercentage: totalCount === 0 ? 0 : Math.round((completedTasks / totalCount) * 100)
    };
  }, [tasks]);

  return stats;
}

export default useStats;