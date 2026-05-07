import { useMemo } from 'react';

function useStats(tasks = []) {
  const stats = useMemo(() => {
    // Pastikan tasks selalu array untuk menghindari error .filter
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    // 1. Task Selesai
    const completedTasks = safeTasks.filter(task => {
      if (!task.subtasks || task.subtasks.length === 0) return false;
      return task.subtasks.every(sub => sub.completed);
    }).length;

    // 2. Hitung total subtasks dan yang selesai
    const totalSubtasks = safeTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
    const doneSubtasks = safeTasks.reduce((acc, t) => 
      acc + (t.subtasks?.filter(s => s.completed).length || 0), 0
    );

    // 3. Skor Fokus
    const focusScore = totalSubtasks === 0 ? 0 : Math.round((doneSubtasks / totalSubtasks) * 100);

    // 4. Data Dummy
    const focusTimeToday = "4j 37m"; 
    const currentStreak = 5;
    const sessionCount = 4;
    const weeklyDistribution = [30, 45, 60, 20, 90, 55, 10]; 

    // PERBAIKAN: Gunakan safeTasks.length secara langsung
    const totalCount = safeTasks.length;

    return {
      totalTasks: totalCount,
      completedTasks,
      focusScore,
      focusTimeToday,
      currentStreak,
      sessionCount,
      weeklyDistribution,
      progressPercentage: totalCount === 0 ? 0 : Math.round((completedTasks / totalCount) * 100)
    };
  }, [tasks]);

  return stats;
}

export default useStats;