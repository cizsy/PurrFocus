import { useMemo } from 'react';

function useStats(tasks = [], focusLogs = []) {
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();

    // 1. Hitung Sesi & Fokus Hari Ini
    const todayLogs = focusLogs.filter(log => new Date(log.date).toDateString() === todayStr);
    const sessionCount = todayLogs.length;

    const totalMinutesToday = todayLogs.reduce((acc, curr) => acc + curr.duration, 0);
    const hours = Math.floor(totalMinutesToday / 60);
    const mins = totalMinutesToday % 60;
    const focusTimeToday = `${hours}j ${mins}m`;

    // 2. Logika Streak
    const calculateStreak = () => {
      if (focusLogs.length === 0) return 0;
      const dates = [...new Set(focusLogs.map(l => new Date(l.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => b - a);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (dates[0].toDateString() !== todayStr && dates[0].toDateString() !== yesterday.toDateString()) {
        return 0;
      }

      let streak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const diff = (dates[i] - dates[i+1]) / (1000 * 60 * 60 * 24);
        if (diff <= 1.1) streak++;
        else break;
      }
      return streak;
    };

    // 3. Grafik Mingguan 
    const weeklyDistribution = Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toDateString();
      return focusLogs
        .filter(log => new Date(log.date).toDateString() === dateStr)
        .reduce((acc, curr) => acc + curr.duration, 0);
    });

    // 4. Distribusi Kategori
    const categories = ["Umum", "Kerja", "Belajar", "Hobby"];
    const categoryDistribution = categories.map(cat => {
      const count = tasks.filter(t => t.category === cat).length;
      const val = tasks.length === 0 ? 0 : Math.round((count / tasks.length) * 100);
      return { label: cat, value: val, color: getCatColor(cat) };
    });

    // 5. SISTEM SKOR BARU (TOTAL XP / IKAN) 🐟
    const calculateTotalXP = () => {
      
      // DIUBAH: 1 Menit Fokus = 2 XP (Jadi kalau 25 menit Pomodoro = 50 XP, 1 menit Stopwatch = 2 XP)
      const sessionPoints = focusLogs.reduce((acc, log) => acc + (log.duration * 2), 0); 
      
      const history = JSON.parse(localStorage.getItem("purrfocus_history") || "[]");
      const allTasks = [...tasks, ...history];
      const subtaskPoints = allTasks.reduce((acc, t) => 
        acc + (t.subtasks?.filter(s => s.completed).length || 0) * 10
      , 0);
      const taskCompletedBonus = allTasks.filter(t => 
        t.subtasks?.length > 0 && t.subtasks.every(s => s.completed)
      ).length * 100;
      
      return sessionPoints + subtaskPoints + taskCompletedBonus;
    };
    // 6. SISTEM SKOR PERSENTASE (Dikembalikan lagi!) 🎯
    const calculateScore = () => {
      // 1. Ambil pengaturan yang disave user
      const savedSettings = JSON.parse(localStorage.getItem('purrfocus_settings') || '{}');
      // 2. Gunakan target user, kalau belum pernah disave, defaultnya 120 menit
      const dailyTargetMinutes = savedSettings.dailyTarget || 120; 

      if (totalMinutesToday === 0) return 0;
      if (totalMinutesToday >= dailyTargetMinutes) return 100; // Maksimal 100%
      
      return Math.round((totalMinutesToday / dailyTargetMinutes) * 100);
    }

    return {
      focusTimeToday,
      sessionCount,
      currentStreak: calculateStreak(),
      weeklyDistribution,
      categoryDistribution,
      completedTasks: tasks.filter(t => t.subtasks?.every(s => s.completed) && t.subtasks.length > 0).length,
      
      // KEDUANYA DIKIRIMKAN DI SINI:
      totalXP: calculateTotalXP(),
      focusScore: calculateScore() 
    };
  }, [tasks, focusLogs]);

  return stats;
}

const getCatColor = (cat) => {
  const colors = { Belajar: "bg-blue-500", Kerja: "bg-purple-500", Hobby: "bg-orange-500" };
  return colors[cat] || "bg-slate-400";
};

export default useStats;