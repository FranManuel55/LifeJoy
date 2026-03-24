import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Plus, ArrowLeft } from 'lucide-react';
import MissionCard from "../components/MissionCard";
import RepeatableMissionCard from "../components/RepeatableMissionCard";
import AddMissionModal from "../components/AddMissionModal";
import { useGame } from '../context/GameContext';

const Missions = () => {
  const navigate = useNavigate();
  const { gameState, toggleTaskCompletion, failTask, addMission, editMission, deleteMission, incrementRepeatableTask, decrementRepeatableTask } = useGame();
  const { tasks, categories } = gameState;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missionToEdit, setMissionToEdit] = useState(null);

  // Filter tasks based on active categories
  const filteredTasks = tasks.filter(task => {
    const cat = categories[task.category];
    return cat && cat.isActive !== false;
  });

  const handleComplete = (id) => {
    const mission = tasks.find(t => t.id === id);
    if (mission) {
      const xp = mission.reward || 10;
      let lifeReward = 1;
      if (mission.frequency === 'weekly') lifeReward = 3;
      if (mission.frequency === 'monthly') lifeReward = 8;
      toggleTaskCompletion(mission.id, mission.category, xp, lifeReward);
    }
  };

  const handleFail = (id) => {
    const mission = tasks.find(t => t.id === id);
    if (mission) {
      failTask(mission.id, mission.category, mission.penalty || 2);
    }
  };

  const handleIncrement = (id) => {
    incrementRepeatableTask(id);
  };

  const handleDecrement = (id) => {
    decrementRepeatableTask(id);
  };

  const handleAddNew = () => {
    setMissionToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const mission = tasks.find(t => t.id === id);
    if (mission) {
      setMissionToEdit(mission);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta misión?")) {
      deleteMission(id);
    }
  };

  const handleSaveMission = (missionData) => {
    if (missionToEdit) {
      editMission(missionToEdit.id, missionData);
    } else {
      addMission(missionData);
    }
  };

  // Helpers para detectar misión repetible
  const isRepeatable = (mission) => mission.targetCount && mission.targetCount > 1;

  // Stats
  const totalMissions = filteredTasks.length;
  const completedMissions = filteredTasks.filter(m => m.completed).length;
  const totalXP = filteredTasks.reduce((sum, m) => sum + (m.completed ? m.reward : 0), 0);
  const progressPercent = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 md:p-8 pb-32 text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-violet-400" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Centro de Misiones
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center text-center">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Total</span>
            <span className="text-2xl font-black text-white">{totalMissions}</span>
          </div>

          <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center text-center">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Completadas</span>
            <span className="text-2xl font-black text-green-400">{completedMissions}</span>
          </div>

          <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center text-center">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> XP
            </span>
            <span className="text-2xl font-black text-amber-400">{totalXP}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-900 rounded-xl p-5 border border-white/[0.06] mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-400">Progreso Diario</span>
            <span className="text-sm font-bold text-amber-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Mission Button */}
        <button
          onClick={handleAddNew}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-[0.98] text-white font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          <span className="uppercase tracking-wide text-sm">Nueva Misión</span>
        </button>

        {/* Missions List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 text-center border border-white/[0.06] flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sin misiones activas</h3>
              <p className="text-gray-500 max-w-sm text-sm">
                Agrega tareas para empezar a ganar XP y subir de nivel.
              </p>
            </div>
          ) : (
            filteredTasks.map((mission) =>
              isRepeatable(mission) ? (
                <RepeatableMissionCard
                  key={mission.id}
                  mission={mission}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onFail={handleFail}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onComplete={handleComplete}
                  onFail={handleFail}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )
          )}
        </div>

        {/* Modal */}
        <AddMissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMission}
          initialData={missionToEdit}
        />

      </div>
    </div>
  );
};

export default Missions;