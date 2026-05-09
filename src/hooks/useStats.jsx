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

    // 2. Logika Streak (Berurutan Berapa Hari)
    const calculateStreak = () => {
      if (focusLogs.length === 0) return 0;

      // Ambil tanggal unik, urutkan dari yang terbaru
      const dates = [...new Set(focusLogs.map(l => new Date(l.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => b - a);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Jika log terakhir bukan hari ini ATAU kemarin, streak putus
      if (dates[0].toDateString() !== todayStr && dates[0].toDateString() !== yesterday.toDateString()) {
        return 0;
      }

      let streak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const diff = (dates[i] - dates[i+1]) / (1000 * 60 * 60 * 24);
        if (diff <= 1.1) { // Selisih 1 hari (dikasih toleransi dikit)
          streak++;
        } else {
          break;
        }
      }
      return streak;
    };

    // 3. Grafik Mingguan (7 Hari Terakhir)
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

    return {
      focusTimeToday,
      sessionCount, // Sekarang dikirim!
      currentStreak: calculateStreak(), // Sekarang dikirim!
      weeklyDistribution,
      categoryDistribution,
      completedTasks: tasks.filter(t => t.subtasks?.every(s => s.completed) && t.subtasks.length > 0).length,
      focusScore: calculateScore(tasks)
    };
  }, [tasks, focusLogs]);

  return stats;
}

// Helper (Warna & Score) tetap sama
const getCatColor = (cat) => {
  const colors = { Belajar: "bg-blue-500", Kerja: "bg-purple-500", Hobby: "bg-orange-500" };
  return colors[cat] || "bg-slate-400";
};

const calculateScore = (tasks) => {
  const total = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
  const done = tasks.reduce((acc, t) => acc + (t.subtasks?.filter(s => s.completed).length || 0), 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
};

export default useStats;