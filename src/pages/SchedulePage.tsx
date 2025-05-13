import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { schedule, getDayName, formatTime, ScheduleItemType } from '../data/schedule';
import { classes } from '../data/classes';
import { motion } from 'framer-motion';

const SchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(getCurrentDayOfWeek());
  const [filterType, setFilterType] = useState<string>('All');

  function getCurrentDayOfWeek(): number {
    const today = new Date().getDay();
    return today === 0 ? 7 : today;
  }

  const classTypes = useMemo(() => {
    const types = classes.map(c => c.title);
    return ['All', ...new Set(types)];
  }, []);

  const filteredSchedule = useMemo(() => {
    return schedule.filter(item => {
      if (item.dayOfWeek !== selectedDay) return false;
      if (filterType === 'All') return true;
      
      const classItem = classes.find(c => c.id === item.classId);
      return classItem?.title === filterType;
    }).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  }, [selectedDay, filterType]);

  return (
    <>
      <Helmet>
        <title>Class Schedule | MBJJ</title>
        <meta name="description" content="View our weekly class schedule with over 40 classes per week. Find a class that fits your schedule and skill level." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/7045511/pexels-photo-7045511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        />
        <div className="absolute inset-0 bg-background opacity-90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-6">
              Class Schedule
            </h1>
            <p className="text-xl text-text">
              Find a class time that works for you with over 40 classes weekly
            </p>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Day Tabs */}
          <div className="mb-8 overflow-x-auto">
            <div className="inline-flex min-w-full">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 min-w-[100px] py-3 px-4 text-center font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  } ${day === 1 ? 'rounded-l-md' : ''} ${day === 7 ? 'rounded-r-md' : ''}`}
                >
                  {getDayName(day)}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-text">
              {getDayName(selectedDay)}'s Classes
            </h2>
            <div className="flex items-center gap-3">
              <label htmlFor="class-filter" className="text-text font-medium">Filter:</label>
              <select
                id="class-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
              >
                {classTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule Items */}
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-12 bg-background rounded-lg">
              <h3 className="text-xl font-bold text-text mb-2">No classes scheduled</h3>
              <p className="text-text">
                {filterType !== 'All' 
                  ? `There are no ${filterType} classes on ${getDayName(selectedDay)}.` 
                  : `There are no classes scheduled for ${getDayName(selectedDay)}.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedule.map((item, index) => (
                <ScheduleItem key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold text-text mb-4">Class Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-background rounded-md shadow-sm">
              <div className="w-4 h-4 bg-background rounded-full mr-3"></div>
              <span className="text-text">Main Mat - Large training area for adult classes</span>
            </div>
            <div className="flex items-center p-4 bg-background rounded-md shadow-sm">
              <div className="w-4 h-4 bg-secondary-500 rounded-full mr-3"></div>
              <span className="text-text">Kids Mat - Dedicated area for children's classes</span>
            </div>
            <div className="flex items-center p-4 bg-background rounded-md shadow-sm">
              <div className="w-4 h-4 bg-background rounded-full mr-3"></div>
              <span className="text-text">Competition Area - For competition team training</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-text mb-6">
              Ready to Train?
            </h2>
            <p className="text-xl text-text/90 mb-8">
              Your first class is free. Come experience MBJJ for yourself.
            </p>
            <Link 
              to="/contact" 
              className="bg-background hover:bg-neutral-800 text-text font-bold py-3 px-8 rounded-md transition-colors text-lg inline-block"
            >
              Schedule Your Free Class
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

interface ScheduleItemProps {
  item: ScheduleItemType;
  index: number;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ item, index }) => {
  const classDetails = classes.find(c => c.id === item.classId);
  
  if (!classDetails) return null;

  const getRoomColor = (room: string) => {
    if (room.includes('Kids')) return 'bg-secondary-500';
    if (room.includes('Competition')) return 'bg-neutral-700';
    return 'bg-neutral-900';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col md:flex-row items-stretch border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Time Column */}
      <div className="w-full md:w-48 bg-background p-4 flex flex-row md:flex-col justify-between">
        <div>
          <span className="block text-sm text-text">Start</span>
          <span className="block text-lg font-bold text-text">{formatTime(item.startTime)}</span>
        </div>
        <div>
          <span className="block text-sm text-text">End</span>
          <span className="block text-lg font-bold text-text">{formatTime(item.endTime)}</span>
        </div>
      </div>

      {/* Class Details */}
      <div className="flex-1 p-4 bg-background flex flex-col md:flex-row items-start md:items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-text mb-1">{classDetails.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-background text-text">
              {classDetails.level}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary-100 text-secondary-800">
              {classDetails.ageGroup}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-background text-text">
              {classDetails.duration} min
            </span>
          </div>
          <p className="hidden md:block text-text line-clamp-1">{classDetails.description}</p>
        </div>
        <div className="flex flex-col items-start md:items-end mt-3 md:mt-0 w-full md:w-auto">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${getRoomColor(item.room)}`}></div>
            <span className="text-sm text-text">{item.room}</span>
          </div>
          <span className="text-text font-medium">{item.instructor}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SchedulePage;