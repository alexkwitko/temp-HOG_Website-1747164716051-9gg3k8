import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock,
  Award,
  Users,
  Calendar,
  ShieldCheck,
  Brain,
  Shield,
  Target,
  Dumbbell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

interface ProgramCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

interface Program {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  level?: string;
  duration?: number;
  image_url?: string;
  is_featured?: boolean;
  order?: number;
  instructor?: string;
  schedule?: Record<string, unknown>;
  is_active?: boolean;
  background_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  category_id?: string;
  category?: ProgramCategory | null;
  use_icon?: boolean;
}

const ProgramsPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<string[]>(['All']);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  console.log('ProgramsPage component render');

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...');
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (catError) throw catError;
        console.log('Categories fetched:', catData);
        setCategories(catData || []);

        // Fetch programs with category_id
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('order', { ascending: true });
        if (error) throw error;
        
        console.log('Programs data fetched:', data);
        
        // Add default values for potentially missing fields
        const processedData = (data || []).map((p: Program) => ({
          ...p,
          level: p.level || 'All Levels',
          duration: p.duration || 60,
          is_featured: p.is_featured || false,
          background_color: p.background_color || '#f9fafb',
          text_color: p.text_color || 'var(--color-text)',
          button_color: p.button_color || 'var(--color-text)',
          button_text_color: p.button_text_color || '#ffffff',
          button_text: p.button_text || 'Learn More',
          image_url: p.image_url || '/images/Logo hog 2 - 1.png',
          use_icon: p.icon ? true : false
        }));
        
        console.log('Processed programs:', processedData);
        setPrograms(processedData);
        
        // Extract unique levels
        const uniqueLevels = ['All', ...new Set(processedData.filter(p => p.level).map(p => p.level))];
        setLevels(uniqueLevels);
      } catch (err) {
        console.error('Failed to fetch programs or categories:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter programs by search query, level, and category
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchQuery === '' || 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.excerpt && program.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (program.content && program.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = selectedLevel === '' || selectedLevel === 'All' || 
      program.level === selectedLevel;
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
      program.category_id === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Paginate programs
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        const { error } = await supabase
          .from('programs')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting program:', error);
          return;
        }
        
        // Update local state after successful deletion
        setPrograms(programs.filter(p => p.id !== id));
      } catch (err) {
        console.error('Failed to delete program:', err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle add new program button click
  const handleAddNew = () => {
    navigate('/admin/programs/new');
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Programs</h1>
          <p className="mt-2 text-sm text-text">
            Manage your program offerings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-background hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Program
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b border-neutral-200 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-text" />
          </div>

          {/* Level Filter */}
          {levels.length > 1 && (
            <div className="relative md:w-1/4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  level !== 'All' && <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <Filter size={18} className="absolute left-3 top-2.5 text-text" />
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="relative md:w-1/4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Filter size={18} className="absolute left-3 top-2.5 text-text" />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading programs...</div>
        ) : error ? (
          <div className="p-8 text-center text-text">
            Error: {error} <button onClick={() => window.location.reload()} className="underline ml-2">Retry</button>
          </div>
        ) : currentPrograms.length === 0 ? (
          <div className="p-8 text-center">
            No programs found. Try adjusting your search or <Link to="/admin/programs/new" className="text-text hover:underline">add a new program</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {currentPrograms.map((program) => (
                  <tr key={program.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {program.use_icon && program.icon ? (
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-background">
                              {program.icon === 'Award' && <Award size={20} className="text-text" />}
                              {program.icon === 'Users' && <Users size={20} className="text-text" />}
                              {program.icon === 'Calendar' && <Calendar size={20} className="text-text" />}
                              {program.icon === 'ShieldCheck' && <ShieldCheck size={20} className="text-text" />}
                              {program.icon === 'Brain' && <Brain size={20} className="text-text" />}
                              {program.icon === 'Shield' && <Shield size={20} className="text-text" />}
                              {program.icon === 'Target' && <Target size={20} className="text-text" />}
                              {program.icon === 'Dumbbell' && <Dumbbell size={20} className="text-text" />}
                            </div>
                          ) : (
                            <img className="h-10 w-10 rounded-md object-cover" src={program.image_url || '/images/Logo hog 2 - 1.png'} alt={program.title} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text">{program.title}</div>
                          <div className="text-sm text-text truncate max-w-xs">{program.excerpt?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {categories.find(cat => cat.id === program.category_id)?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-background text-text">
                        {program.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {program.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {program.is_featured ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-background text-text">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-background text-text">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          to={`/admin/programs/edit/${program.id}`}
                          className="text-text hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="text-text hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-background border-t border-neutral-200 sm:px-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-text">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">
                    {startIndex + currentPrograms.length}
                  </span> of <span className="font-medium">{filteredPrograms.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {/* Render page numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-neutral-900 border-neutral-900 text-white'
                            : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProgramsPage; 