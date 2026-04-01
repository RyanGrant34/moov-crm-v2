'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Flag, Calendar, Building2, X } from 'lucide-react';
import { defaultTasks, PRIORITY_CONFIG, TYPE_CONFIG, type Task, type TaskPriority, type TaskType } from '@/lib/tasks-data';
import { districts } from '@/lib/data';

const REF = '2025-11-25';

function dueDateLabel(date: string): { label: string; color: string } {
  const diff = Math.floor((new Date(date).getTime() - new Date(REF).getTime()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: '#ef4444' };
  if (diff === 0) return { label: 'Due today', color: '#f59e0b' };
  if (diff === 1) return { label: 'Tomorrow', color: '#f59e0b' };
  if (diff <= 7) return { label: `In ${diff}d`, color: '#a1a1aa' };
  return { label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: '#71717a' };
}

type FilterView = 'all' | 'today' | 'upcoming' | 'overdue' | 'done';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [view, setView] = useState<FilterView>('all');
  const [showAdd, setShowAdd] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newDue, setNewDue] = useState('2025-11-26');
  const [newPriority, setNewPriority] = useState<TaskPriority>('normal');
  const [newType, setNewType] = useState<TaskType>('follow_up');
  const [newNotes, setNewNotes] = useState('');

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const district = districts.find(d => d.id === newDistrict);
    setTasks(prev => [{
      id: `t-${Date.now()}`,
      title: newTitle,
      districtId: newDistrict || undefined,
      districtName: district?.name,
      dueDate: newDue,
      priority: newPriority,
      done: false,
      type: newType,
      notes: newNotes || undefined,
    }, ...prev]);
    setNewTitle(''); setNewDistrict(''); setNewNotes(''); setNewPriority('normal'); setNewType('follow_up');
    setShowAdd(false);
  };

  const filtered = tasks.filter(t => {
    const diff = Math.floor((new Date(t.dueDate).getTime() - new Date(REF).getTime()) / 86400000);
    if (view === 'done') return t.done;
    if (t.done) return false;
    if (view === 'today') return diff === 0;
    if (view === 'overdue') return diff < 0;
    if (view === 'upcoming') return diff > 0;
    return true;
  }).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pa = PRIORITY_CONFIG[a.priority].order;
    const pb = PRIORITY_CONFIG[b.priority].order;
    if (pa !== pb) return pa - pb;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const counts = {
    all: tasks.filter(t => !t.done).length,
    today: tasks.filter(t => !t.done && Math.floor((new Date(t.dueDate).getTime() - new Date(REF).getTime()) / 86400000) === 0).length,
    upcoming: tasks.filter(t => !t.done && Math.floor((new Date(t.dueDate).getTime() - new Date(REF).getTime()) / 86400000) > 0).length,
    overdue: tasks.filter(t => !t.done && Math.floor((new Date(t.dueDate).getTime() - new Date(REF).getTime()) / 86400000) < 0).length,
    done: tasks.filter(t => t.done).length,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-[#a1a1aa] text-sm mt-0.5">
            {counts.overdue > 0 && <span className="text-[#ef4444] font-medium">{counts.overdue} overdue · </span>}
            {counts.today > 0 && <span className="text-[#f59e0b] font-medium">{counts.today} due today · </span>}
            {counts.all} open
          </p>
        </div>
        <button
          onClick={() => setShowAdd(prev => !prev)}
          className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#22c55e]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#111113] border border-[#27272a] rounded-lg p-1 mb-5 w-fit">
        {([
          { id: 'all', label: 'All' },
          { id: 'today', label: 'Today' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'done', label: 'Done' },
        ] as Array<{ id: FilterView; label: string }>).map(f => (
          <button
            key={f.id}
            onClick={() => setView(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              view === f.id ? 'bg-[#1c1c1f] text-white border border-[#3f3f46]' : 'text-[#71717a] hover:text-[#a1a1aa]'
            }`}
          >
            {f.label}
            {counts[f.id] > 0 && (
              <span className={`text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold ${
                f.id === 'overdue' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                f.id === 'today' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                'bg-[#27272a] text-[#71717a]'
              }`}>{counts[f.id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Add task form */}
      {showAdd && (
        <div className="bg-[#111113] border border-[#22c55e]/30 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">New Task</p>
            <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-[#52525b]" /></button>
          </div>

          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Task title…"
            className="w-full bg-[#0f0f10] border border-[#27272a] text-white text-sm rounded-lg px-3 py-2 outline-none placeholder:text-[#3f3f46] focus:border-[#3f3f46]"
          />

          <div className="grid grid-cols-2 gap-2">
            <select value={newDistrict} onChange={e => setNewDistrict(e.target.value)}
              className="bg-[#0f0f10] border border-[#27272a] text-[#a1a1aa] text-xs rounded-lg px-2.5 py-2 outline-none">
              <option value="">No district</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)}
              className="bg-[#0f0f10] border border-[#27272a] text-[#a1a1aa] text-xs rounded-lg px-2.5 py-2 outline-none" />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value as TaskPriority)}
              className="bg-[#0f0f10] border border-[#27272a] text-[#a1a1aa] text-xs rounded-lg px-2.5 py-2 outline-none">
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label} priority</option>)}
            </select>
            <select value={newType} onChange={e => setNewType(e.target.value as TaskType)}
              className="bg-[#0f0f10] border border-[#27272a] text-[#a1a1aa] text-xs rounded-lg px-2.5 py-2 outline-none">
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>

          <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)}
            placeholder="Notes (optional)…" rows={2}
            className="w-full bg-[#0f0f10] border border-[#27272a] text-white text-sm rounded-lg px-3 py-2 outline-none placeholder:text-[#3f3f46] resize-none focus:border-[#3f3f46]" />

          <div className="flex gap-2">
            <button onClick={addTask} className="flex-1 py-2 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-sm font-semibold rounded-lg hover:bg-[#22c55e]/25 transition-all">
              Add Task
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-[#71717a] text-sm rounded-lg border border-[#27272a] hover:text-[#a1a1aa] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#52525b]">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks here</p>
          </div>
        )}

        {filtered.map(task => {
          const due = dueDateLabel(task.dueDate);
          const pri = PRIORITY_CONFIG[task.priority];
          const typeCfg = TYPE_CONFIG[task.type];

          return (
            <div
              key={task.id}
              className={`group flex items-start gap-3 bg-[#111113] border rounded-xl px-4 py-3.5 transition-all ${
                task.done ? 'border-[#1c1c1f] opacity-50' : 'border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              {/* Check */}
              <button onClick={() => toggle(task.id)} className="mt-0.5 flex-shrink-0">
                {task.done
                  ? <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  : <Circle className="w-4 h-4 text-[#3f3f46] hover:text-[#71717a]" />
                }
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-sm font-medium ${task.done ? 'line-through text-[#52525b]' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {/* Type */}
                  <span className="text-[10px] text-[#52525b]">{typeCfg.icon} {typeCfg.label}</span>

                  {/* District */}
                  {task.districtName && (
                    <div className="flex items-center gap-1 text-[11px] text-[#22c55e]">
                      <Building2 className="w-2.5 h-2.5" />
                      {task.districtName}
                    </div>
                  )}

                  {/* Due */}
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: due.color }}>
                    <Calendar className="w-2.5 h-2.5" />
                    {due.label}
                  </div>

                  {/* Priority */}
                  {!task.done && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: pri.color, background: pri.bg }}>
                      <Flag className="w-2.5 h-2.5 inline mr-0.5" />
                      {pri.label}
                    </span>
                  )}
                </div>

                {/* Notes */}
                {task.notes && (
                  <p className="text-xs text-[#52525b] mt-1.5 leading-relaxed">{task.notes}</p>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => remove(task.id)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#3f3f46] hover:text-[#ef4444]" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
