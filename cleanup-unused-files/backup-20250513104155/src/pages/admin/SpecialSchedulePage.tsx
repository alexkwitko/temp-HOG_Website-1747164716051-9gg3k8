import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Plus, Trash2, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  event_date: string; // ISO date string
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  instructor_id: string;
  location: string;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
}

const SpecialSchedulePage: React.FC = () => {
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
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
      // Fetch special events
      const { data: eventsData, error: eventsError } = await supabase
        .from('special_events')
        .select('*')
        .order('event_date, start_time');
      
      if (eventsError) throw eventsError;
      
      // Fetch instructors
      const { data: instructorsData, error: instructorsError } = await supabase
        .from('instructors')
        .select('id, name, email');
      
      if (instructorsError) throw instructorsError;
      
      setSpecialEvents(eventsData || []);
      setInstructors(instructorsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (id: string, field: keyof SpecialEvent, value: string | number | boolean) => {
    setSpecialEvents(
      specialEvents.map(event => 
        event.id === id ? { ...event, [field]: value } : event
      )
    );
  };

  const addNewEvent = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const newEvent: SpecialEvent = {
      id: `temp-${Date.now()}`, // Will be replaced with a real ID after saving
      title: 'New Special Event',
      description: 'Add a description for this special event',
      event_date: formattedDate,
      start_time: '09:00',
      end_time: '11:00',
      instructor_id: instructors.length > 0 ? instructors[0].id : '',
      location: 'Main Studio',
      max_capacity: 20,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    setSpecialEvents([...specialEvents, newEvent]);
  };

  const removeEvent = (id: string) => {
    setSpecialEvents(specialEvents.filter(event => event.id !== id));
  };

  const saveEvents = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // For each event, either update or insert
      for (const event of specialEvents) {
        if (event.id.startsWith('temp-')) {
          // This is a new event, insert it
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...newEvent } = event;
          const { error } = await supabase
            .from('special_events')
            .insert([newEvent]);
          
          if (error) throw error;
        } else {
          // This is an existing event, update it
          const { error } = await supabase
            .from('special_events')
            .update({
              title: event.title,
              description: event.description,
              event_date: event.event_date,
              start_time: event.start_time,
              end_time: event.end_time,
              instructor_id: event.instructor_id,
              location: event.location,
              max_capacity: event.max_capacity,
              is_active: event.is_active
            })
            .eq('id', event.id);
          
          if (error) throw error;
        }
      }
      
      // Fetch the updated data
      await fetchData();
      
      setSuccessMessage('Special events saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving special events:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  // Group events by date
  const groupEventsByDate = () => {
    const grouped: Record<string, SpecialEvent[]> = {};
    
    specialEvents.forEach(event => {
      if (!grouped[event.event_date]) {
        grouped[event.event_date] = [];
      }
      grouped[event.event_date].push(event);
    });
    
    // Sort dates
    return Object.keys(grouped)
      .sort()
      .map(date => ({
        date,
        events: grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time))
      }));
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Special Events</h2>
        <p className="text-text">Manage special events and workshops</p>
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
            <h3 className="text-lg font-medium text-text">Special Events</h3>
            <div className="space-x-4">
              <button
                onClick={addNewEvent}
                className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Event
              </button>
              <button
                onClick={saveEvents}
                disabled={saving}
                className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Events
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : specialEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text">No special events found. Add your first event to get started.</p>
              <button
                onClick={addNewEvent}
                className="mt-4 bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center mx-auto"
              >
                <Plus size={18} className="mr-2" />
                Add First Event
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupEventsByDate().map(({ date, events }) => (
                <div key={date} className="border border-neutral-200 rounded-md overflow-hidden">
                  <div className="bg-background px-4 py-3 border-b border-neutral-200 flex items-center">
                    <Calendar size={18} className="mr-2 text-text" />
                    <h4 className="font-medium text-text">{formatDate(date)}</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border border-neutral-100 rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium text-lg">{event.title}</h5>
                          <button
                            onClick={() => removeEvent(event.id)}
                            className="text-text hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => handleEventChange(event.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">
                            Description
                          </label>
                          <textarea
                            value={event.description}
                            onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={event.event_date}
                              onChange={(e) => handleEventChange(event.id, 'event_date', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={event.start_time}
                              onChange={(e) => handleEventChange(event.id, 'start_time', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={event.end_time}
                              onChange={(e) => handleEventChange(event.id, 'end_time', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              Instructor
                            </label>
                            <select
                              value={event.instructor_id}
                              onChange={(e) => handleEventChange(event.id, 'instructor_id', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            >
                              {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={event.location}
                              onChange={(e) => handleEventChange(event.id, 'location', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">
                              Max Capacity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={event.max_capacity}
                              onChange={(e) => handleEventChange(event.id, 'max_capacity', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={event.is_active}
                                onChange={(e) => handleEventChange(event.id, 'is_active', e.target.checked)}
                                className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                              />
                              <span className="ml-2 text-sm text-text">Active</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SpecialSchedulePage; 