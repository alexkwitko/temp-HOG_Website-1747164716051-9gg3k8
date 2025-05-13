import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

interface ScheduleClass {
  id: string;
  class_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  instructor_id: string;
  location: string;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
}

interface Class {
  id: string;
  name: string;
  description: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const ScheduleConfigPage: React.FC = () => {
  const [scheduleClasses, setScheduleClasses] = useState<ScheduleClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, description')
        .eq('is_active', true)
        .order('name');
      
      if (classesError) throw classesError;
      setClasses(classesData || []);
      
      // Fetch instructors
      const { data: instructorsData, error: instructorsError } = await supabase
        .from('instructors')
        .select('id, name, email')
        .order('name');
      
      if (instructorsError) throw instructorsError;
      setInstructors(instructorsData || []);
      
      // Fetch schedule classes
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule_classes')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (scheduleError) throw scheduleError;
      setScheduleClasses(scheduleData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClassChange = (id: string, field: keyof ScheduleClass, value: string | number | boolean) => {
    setScheduleClasses(
      scheduleClasses.map(scheduleClass => 
        scheduleClass.id === id ? { ...scheduleClass, [field]: value } : scheduleClass
      )
    );
  };

  const addNewScheduleClass = () => {
    const newScheduleClass: ScheduleClass = {
      id: `temp-${Date.now()}`, // Will be replaced with a real ID after saving
      class_id: classes.length > 0 ? classes[0].id : '',
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '10:00',
      instructor_id: instructors.length > 0 ? instructors[0].id : '',
      location: 'Main Studio',
      max_capacity: 20,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    setScheduleClasses([...scheduleClasses, newScheduleClass]);
  };

  const removeScheduleClass = (id: string) => {
    setScheduleClasses(scheduleClasses.filter(scheduleClass => scheduleClass.id !== id));
  };

  const saveSchedule = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // For each schedule class, either update or insert
      for (const scheduleClass of scheduleClasses) {
        if (scheduleClass.id.startsWith('temp-')) {
          // This is a new schedule class, insert it
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...newScheduleClass } = scheduleClass;
          const { error } = await supabase
            .from('schedule_classes')
            .insert([newScheduleClass]);
          
          if (error) throw error;
        } else {
          // This is an existing schedule class, update it
          const { error } = await supabase
            .from('schedule_classes')
            .update({
              class_id: scheduleClass.class_id,
              day_of_week: scheduleClass.day_of_week,
              start_time: scheduleClass.start_time,
              end_time: scheduleClass.end_time,
              instructor_id: scheduleClass.instructor_id,
              location: scheduleClass.location,
              max_capacity: scheduleClass.max_capacity,
              is_active: scheduleClass.is_active
            })
            .eq('id', scheduleClass.id);
          
          if (error) throw error;
        }
      }
      
      // Fetch the updated data
      await fetchData();
      
      setSuccessMessage('Schedule saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get class name by ID
  const getClassName = (classId: string) => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.name : 'Unknown Class';
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Schedule Configuration</h2>
        <p className="text-text">Manage the class schedule</p>
      </div>

      {error && (
        <div className="bg-background border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-text mr-2" />
            <span className="text-text">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-background border-l-4 border-green-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-text" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-text">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-text">Class Schedule</h3>
            <div className="space-x-4">
              <button
                onClick={addNewScheduleClass}
                className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Class
              </button>
              <button
                onClick={saveSchedule}
                disabled={saving}
                className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Schedule
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : scheduleClasses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text">No classes scheduled. Add your first class to get started.</p>
              <button
                onClick={addNewScheduleClass}
                className="mt-4 bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center mx-auto"
              >
                <Plus size={18} className="mr-2" />
                Add First Class
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group classes by day of week */}
              {daysOfWeek.map((day, dayIndex) => {
                const dayClasses = scheduleClasses.filter(sc => sc.day_of_week === dayIndex);
                
                if (dayClasses.length === 0) return null;
                
                return (
                  <div key={dayIndex} className="border border-neutral-200 rounded-md overflow-hidden">
                    <div className="bg-background px-4 py-3 border-b border-neutral-200">
                      <h4 className="font-medium text-text">{day}</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      {dayClasses.map((scheduleClass) => (
                        <div key={scheduleClass.id} className="border border-neutral-100 rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">
                              {getClassName(scheduleClass.class_id)} ({scheduleClass.start_time} - {scheduleClass.end_time})
                            </h5>
                            <button
                              onClick={() => removeScheduleClass(scheduleClass.id)}
                              className="text-text hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Class
                              </label>
                              <select
                                value={scheduleClass.class_id}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'class_id', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              >
                                {classes.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Instructor
                              </label>
                              <select
                                value={scheduleClass.instructor_id}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'instructor_id', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              >
                                {instructors.map((instructor) => (
                                  <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Day
                              </label>
                              <select
                                value={scheduleClass.day_of_week}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'day_of_week', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              >
                                {daysOfWeek.map((day, index) => (
                                  <option key={index} value={index}>{day}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={scheduleClass.start_time}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'start_time', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={scheduleClass.end_time}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'end_time', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Location
                              </label>
                              <input
                                type="text"
                                value={scheduleClass.location}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'location', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Max Capacity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={scheduleClass.max_capacity}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'max_capacity', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={scheduleClass.is_active}
                                onChange={(e) => handleScheduleClassChange(scheduleClass.id, 'is_active', e.target.checked)}
                                className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                              />
                              <span className="ml-2 text-sm text-text">Active</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ScheduleConfigPage; 