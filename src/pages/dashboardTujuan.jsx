import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Timer,
  CalendarDays,
  Check,
  Target,
  X,
} from "lucide-react";

import { catAssets } from "../components/catAssets";
import { purrThemes, DEFAULT_THEME } from "../components/purrThemes";

const getSavedThemeName = () => {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );

    return savedSettings.theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

function Tujuan({
  tasks = [],
  onAddTask,
  updateTaskDetail,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onEditSubtask,
  onStartFocusing,
}) {
  const [newTasksName, setNewTasksName] = useState("");
  const [newSubtexts, setNewSubtexts] = useState({});
  const [editingSub, setEditingSub] = useState({ taskId: null, subId: null });
  const [tempText, setTempText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState({
    taskId: null,
    subId: null,
  });

  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  const catColor = theme.isDark ? "white" : "black";
  const catSad = catAssets?.[catColor]?.sad || catAssets?.black?.sad;
  const catAngry = catAssets?.[catColor]?.angry || catAssets?.black?.angry;

  const handleAddMainTask = () => {
    if (!newTasksName.trim()) return;

    const success = onAddTask(newTasksName.trim());

    if (success !== false) {
      setNewTasksName("");
    }
  };

  const handleAddSub = (taskId) => {
    const text = newSubtexts[taskId];

    if (text && text.trim() !== "") {
      onAddSubtask(taskId, text.trim());
      setNewSubtexts((prev) => ({ ...prev, [taskId]: "" }));
    }
  };

  const saveEdit = (taskId, subId) => {
    if (tempText.trim() !== "") {
      onEditSubtask(taskId, subId, tempText.trim());
    }

    setEditingSub({ taskId: null, subId: null });
    setTempText("");
  };

  return (
    <div
      className={`min-h-full flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 space-y-5 transition-colors duration-300 ${theme.mainBg} ${theme.text}`}
    >
      {/* HERO */}
      <section
        className={`relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.panelBg} p-6 shadow-sm backdrop-blur-md`}
      >
        <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p
              className={`mb-2 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
            >
              Tujuan Saya
            </p>

            <h1 className={`text-3xl font-black tracking-tight ${theme.text}`}>
              Pecah target jadi langkah kecil.
            </h1>

            <p
              className={`mt-2 max-w-xl text-sm font-medium leading-relaxed ${theme.muted}`}
            >
              Biar nggak cuma numpuk di kepala, yuk tulis targetmu lalu pecah jadi subtask yang lebih gampang dikerjakan.
            </p>
          </div>

          {catSad && (
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/35 md:h-36 md:w-36">
              <img
                src={catSad}
                alt="Kucing PurrFocus"
                className="h-24 w-24 object-contain md:h-32 md:w-32"
              />
            </div>
          )}
        </div>
      </section>

      {/* INPUT TARGET */}
      <section
        className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-4 shadow-sm backdrop-blur-md`}
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className={`flex-1 rounded-2xl border border-black/5 bg-white/50 px-4 py-3 text-sm font-bold outline-none transition-all placeholder:opacity-50 focus:bg-white/70 ${theme.text}`}
            placeholder="Tambahkan target baru..."
            value={newTasksName}
            onChange={(event) => setNewTasksName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleAddMainTask();
            }}
          />

          <button
            onClick={handleAddMainTask}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all active:scale-95 ${theme.button}`}
          >
            <Plus size={17} strokeWidth={3} />
            Tambah Target
          </button>
        </div>
      </section>

      {/* LIST TASK */}
      <section className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyTasks theme={theme} cat={catSad} />
        ) : (
          tasks.map((task) => {
            const total = task.subtasks?.length || 0;
            const done =
              task.subtasks?.filter((subtask) => subtask.completed).length || 0;
            const percent = total === 0 ? 0 : Math.round((done / total) * 100);

            return (
              <article
                key={task.id}
                className={`relative overflow-hidden rounded-[1.7rem] border ${theme.border} ${theme.panelBg} p-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div
                  className="absolute left-0 top-0 h-1 bg-current opacity-60 transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />

                {/* HEADER TASK */}
                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/45 px-2.5 py-1 text-[10px] font-black">
                        {percent}%
                      </span>

                      <select
                        className={`rounded-full bg-white/35 px-2.5 py-1 text-[10px] font-black uppercase outline-none cursor-pointer ${theme.muted}`}
                        value={task.category || "Umum"}
                        onChange={(event) =>
                          updateTaskDetail(task.id, {
                            category: event.target.value,
                          })
                        }
                      >
                        <option value="Umum">Umum</option>
                        <option value="Kerja">Kerja</option>
                        <option value="Belajar">Belajar</option>
                        <option value="Hobby">Hobby</option>
                      </select>

                      <span className={`text-[10px] font-bold ${theme.muted}`}>
                        {done}/{total} langkah selesai
                      </span>
                    </div>

                    <input
                      className={`w-full bg-transparent text-lg font-black outline-none transition-all focus:opacity-80 ${theme.text}`}
                      value={task.title}
                      onChange={(event) =>
                        updateTaskDetail(task.id, { title: event.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <label className="inline-flex items-center gap-2 rounded-2xl bg-white/35 px-3 py-2">
                      <CalendarDays size={14} strokeWidth={2.5} />
                      <input
                        type="date"
                        className={`bg-transparent text-[11px] font-bold outline-none ${theme.muted}`}
                        value={task.deadline || ""}
                        onChange={(event) =>
                          updateTaskDetail(task.id, {
                            deadline: event.target.value,
                          })
                        }
                      />
                    </label>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/35 text-red-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95"
                      title="Hapus target"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>

                    <button
                      onClick={() => onStartFocusing(task)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition-all active:scale-95 ${theme.button}`}
                    >
                      <Timer size={15} strokeWidth={2.7} />
                      Fokus
                    </button>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-current opacity-70 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* SUBTASKS */}
                <div className="rounded-[1.4rem] border border-black/5 bg-white/30 p-3">
                  <div className="mb-3 space-y-2">
                    {task.subtasks?.length === 0 ? (
                      <p
                        className={`rounded-xl bg-white/30 px-3 py-3 text-xs font-bold ${theme.muted}`}
                      >
                        Belum ada langkah kecil. Tambahkan satu biar target ini
                        nggak cuma jadi pajangan.
                      </p>
                    ) : (
                      task.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="group/item flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-white/45 px-3 py-2"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleSubtask(task.id, subtask.id)}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                subtask.completed
                                  ? "bg-black/70 text-white border-transparent"
                                  : "border-black/20 bg-white/30"
                              }`}
                            >
                              {subtask.completed && (
                                <Check size={13} strokeWidth={3} />
                              )}
                            </button>

                            {editingSub.taskId === task.id &&
                            editingSub.subId === subtask.id ? (
                              <input
                                autoFocus
                                className={`flex-1 rounded-lg bg-white/60 px-2 py-1 text-[12px] font-bold outline-none ${theme.text}`}
                                value={tempText}
                                onChange={(event) =>
                                  setTempText(event.target.value)
                                }
                                onBlur={() => saveEdit(task.id, subtask.id)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    saveEdit(task.id, subtask.id);
                                  }

                                  if (event.key === "Escape") {
                                    setEditingSub({
                                      taskId: null,
                                      subId: null,
                                    });
                                    setTempText("");
                                  }
                                }}
                              />
                            ) : (
                              <span
                                onClick={() => {
                                  setEditingSub({
                                    taskId: task.id,
                                    subId: subtask.id,
                                  });
                                  setTempText(subtask.text);
                                }}
                                className={`min-w-0 flex-1 cursor-text truncate text-[12px] font-bold ${
                                  subtask.completed
                                    ? `line-through opacity-40 ${theme.muted}`
                                    : theme.text
                                }`}
                              >
                                {subtask.text}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              setDeleteTarget({
                                taskId: task.id,
                                subId: subtask.id,
                              })
                            }
                            className="opacity-0 transition-all group-hover/item:opacity-100 text-red-400 hover:text-red-600"
                            title="Hapus subtask"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* INPUT SUBTASK */}
                  <div className="flex items-center gap-2 rounded-xl bg-white/35 px-2 py-2">
                    <input
                      className={`min-w-0 flex-1 bg-transparent px-2 text-[12px] font-bold outline-none placeholder:opacity-50 ${theme.text}`}
                      placeholder="Tambah langkah kecil..."
                      value={newSubtexts[task.id] || ""}
                      onChange={(event) =>
                        setNewSubtexts((prev) => ({
                          ...prev,
                          [task.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleAddSub(task.id);
                      }}
                    />

                    <button
                      onClick={() => handleAddSub(task.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-black transition-all active:scale-95 ${theme.button}`}
                      title="Tambah subtask"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* DELETE MODAL */}
      {deleteTarget.taskId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-xs rounded-[2rem] border ${theme.border} ${theme.mainBg} p-6 text-center shadow-2xl`}
          >
            {catAngry ? (
              <img
                src={catAngry}
                alt=""
                className="mx-auto mb-3 h-24 w-24 object-contain"
              />
            ) : (
              <div className="mb-3 text-5xl">🙀</div>
            )}

            <h3 className={`mb-1 text-lg font-black ${theme.text}`}>
              Hapus Subtask?
            </h3>

            <p
              className={`mb-6 text-xs font-medium leading-relaxed ${theme.muted}`}
            >
              Subtask yang sudah dihapus tidak bisa dikembalikan lagi.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget({ taskId: null, subId: null })}
                className="flex-1 rounded-xl bg-black/10 py-3 text-[11px] font-black uppercase tracking-wider transition-all hover:bg-black/15 active:scale-95"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  onDeleteSubtask(deleteTarget.taskId, deleteTarget.subId);
                  setDeleteTarget({ taskId: null, subId: null });
                }}
                className="flex-1 rounded-xl bg-red-500 py-3 text-[11px] font-black uppercase tracking-wider text-white shadow-[0_5px_15px_rgba(239,68,68,0.25)] transition-all hover:bg-red-600 active:scale-95"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyTasks({ theme, cat }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[2rem] border ${theme.border} ${theme.panelBg} px-6 py-16 text-center shadow-sm backdrop-blur-md`}
    >
      {cat && (
        <img
          src={cat}
          alt=""
          className="mb-4 h-28 w-28 object-contain opacity-90"
        />
      )}

      <h2 className={`text-lg font-black ${theme.text}`}>
        Belum ada target
      </h2>

      <p className={`mt-2 max-w-sm text-xs font-bold leading-relaxed ${theme.muted}`}>
        Tulis satu target kecil dulu. Supaya lebih mudah untuk berburu
      </p>
    </div>
  );
}

export default Tujuan;