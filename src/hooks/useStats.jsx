import { useMemo } from "react";

const getLocalDateKey = (dateInput) => {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayKey = () => {
  return getLocalDateKey(new Date());
};

const getStartOfWeekMonday = () => {
  const today = new Date();
  const day = today.getDay();

  // getDay(): Minggu = 0, Senin = 1, dst.
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diffToMonday);

  return monday;
};

const formatFocusTime = (totalMinutes) => {
  const minutes = Number(totalMinutes) || 0;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}j`;

  return `${hours}j ${mins}m`;
};

const safeReadJSON = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function useStats(tasks = [], focusLogs = []) {
  const stats = useMemo(() => {
    const todayKey = getTodayKey();

    // 1. Fokus hari ini
    const todayLogs = focusLogs.filter((log) => {
      if (!log.date) return false;
      return getLocalDateKey(log.date) === todayKey;
    });

    const sessionCount = todayLogs.length;

    const totalMinutesToday = todayLogs.reduce((total, log) => {
      return total + (Number(log.duration) || 0);
    }, 0);

    const focusTimeToday = formatFocusTime(totalMinutesToday);

    // 2. Weekly distribution: Senin - Minggu minggu ini
    const startOfWeek = getStartOfWeekMonday();

    const weeklyDistribution = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const dateKey = getLocalDateKey(date);

      return focusLogs
        .filter((log) => {
          if (!log.date) return false;
          return getLocalDateKey(log.date) === dateKey;
        })
        .reduce((total, log) => {
          return total + (Number(log.duration) || 0);
        }, 0);
    });

    // 3. Streak
    const focusDateKeys = [
      ...new Set(
        focusLogs
          .filter((log) => log.date)
          .map((log) => getLocalDateKey(log.date))
          .filter(Boolean)
      ),
    ];

    const calculateStreak = () => {
      if (focusDateKeys.length === 0) return 0;

      let streak = 0;

      const checker = new Date();
      checker.setHours(0, 0, 0, 0);

      while (true) {
        const key = getLocalDateKey(checker);

        if (!focusDateKeys.includes(key)) break;

        streak += 1;
        checker.setDate(checker.getDate() - 1);
      }

      return streak;
    };

    // 4. Completed tasks
    const completedTasks = tasks.filter((task) => {
      const subtasks = task.subtasks || [];

      if (subtasks.length > 0) {
        return subtasks.every((subtask) => subtask.completed);
      }

      return task.status === "done" || task.status === "completed";
    }).length;

    // 5. Category distribution
    const categoryCounts = tasks.reduce((result, task) => {
      const category = task.category || "Umum";
      result[category] = (result[category] || 0) + 1;
      return result;
    }, {});

    const totalCategoryCount = Object.values(categoryCounts).reduce(
      (total, value) => total + value,
      0
    );

    const categoryDistribution =
      totalCategoryCount === 0
        ? []
        : Object.entries(categoryCounts)
            .map(([label, count]) => ({
              label,
              value: Math.round((count / totalCategoryCount) * 100),
            }))
            .filter((category) => category.value > 0)
            .sort((a, b) => b.value - a.value);

    // 6. Total XP
    const calculateTotalXP = () => {
      const sessionPoints = focusLogs.reduce((total, log) => {
        return total + (Number(log.duration) || 0) * 2;
      }, 0);

      const history = safeReadJSON("purrfocus_history", []);
      const allTasks = [...tasks, ...history];

      const subtaskPoints = allTasks.reduce((total, task) => {
        const completedSubtasks =
          task.subtasks?.filter((subtask) => subtask.completed).length || 0;

        return total + completedSubtasks * 10;
      }, 0);

      const taskCompletedBonus =
        allTasks.filter((task) => {
          const subtasks = task.subtasks || [];
          return subtasks.length > 0 && subtasks.every((subtask) => subtask.completed);
        }).length * 100;

      return sessionPoints + subtaskPoints + taskCompletedBonus;
    };

    // 7. Focus score
    const calculateScore = () => {
      const savedSettings = safeReadJSON("purrfocus_settings", {});
      const dailyTargetMinutes = Number(savedSettings.dailyTarget) || 120;

      if (totalMinutesToday <= 0) return 0;

      return Math.min(
        100,
        Math.round((totalMinutesToday / dailyTargetMinutes) * 100)
      );
    };

    return {
      focusTimeToday,
      sessionCount,
      currentStreak: calculateStreak(),
      weeklyDistribution,
      categoryDistribution,
      completedTasks,
      totalXP: calculateTotalXP(),
      focusScore: calculateScore(),
    };
  }, [tasks, focusLogs]);

  return stats;
}

export default useStats;