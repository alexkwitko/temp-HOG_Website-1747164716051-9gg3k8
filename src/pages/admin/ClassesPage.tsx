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

interface ClassCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

interface ClassType {
  id: string;
  name: string;
  description: string;
  level?: string;
  duration?: number;
  image_url?: string;
  is_featured?: boolean;
  order?: number;
  instructor?: string;
  schedule?: Record<string, unknown>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  category_id?: string;
  category?: ClassCategory | null;
  use_icon?: boolean;
  icon?: string;
}

const ClassesPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<string[]>(['All']);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('class_categories')
          .select('*')
          .order('name');
        if (catError) throw catError;
        setCategories(catData || []);

        // Fetch classes with category_id
        const { data, error } = await supabase
          .from('classes')
          .select('*, category:category_id(*)')
          .order('order', { ascending: true });
        if (error) throw error;
        
        // Add default values for potentially missing fields
        const processedData = (data || []).map((c: ClassType) => ({
          ...c,
          level: c.level || 'All Levels',
          duration: c.duration || 60,
          is_featured: c.is_featured || false,
          image_url: c.image_url || '/images/Logo hog 2 - 1.png', // Default image
          use_icon: c.icon ? true : false
        }));
        
        setClasses(processedData);
        
        // Extract unique levels
        const uniqueLevels = ['All', ...new Set(processedData.filter(c => c.level).map(c => c.level))];
        setLevels(uniqueLevels);
      } catch (err) {
        console.error('Failed to fetch classes or categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter classes by search query, level, and category
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = searchQuery === '' || 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = selectedLevel === '' || selectedLevel === 'All' || 
      classItem.level === selectedLevel;
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
      (classItem.category && classItem.category.id === selectedCategory);
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Paginate classes
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting class:', error);
          return;
        }
        
        // Update local state after successful deletion
        setClasses(classes.filter(c => c.id !== id));
      } catch (err) {
        console.error('Failed to delete class:', err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle add new class button click
  const handleAddNew = () => {
    navigate('/admin/classes/new');
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Classes</h1>
          <p className="mt-2 text-sm text-text">
            Manage your class offerings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-background hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Class
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b border-neutral-200 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Search classes..."
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
          <div className="p-8 text-center">Loading classes...</div>
        ) : paginatedClasses.length === 0 ? (
          <div className="p-8 text-center">
            No classes found. Try adjusting your search or <Link to="/admin/classes/new" className="text-text hover:underline">add a new class</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Class
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
                {paginatedClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {classItem.use_icon && classItem.icon ? (
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-background">
                              {classItem.icon === 'Award' && <Award size={20} className="text-text" />}
                              {classItem.icon === 'Users' && <Users size={20} className="text-text" />}
                              {classItem.icon === 'Calendar' && <Calendar size={20} className="text-text" />}
                              {classItem.icon === 'ShieldCheck' && <ShieldCheck size={20} className="text-text" />}
                              {classItem.icon === 'Brain' && <Brain size={20} className="text-text" />}
                              {classItem.icon === 'Shield' && <Shield size={20} className="text-text" />}
                              {classItem.icon === 'Target' && <Target size={20} className="text-text" />}
                              {classItem.icon === 'Dumbbell' && <Dumbbell size={20} className="text-text" />}
                            </div>
                          ) : (
                            <img className="h-10 w-10 rounded-md object-cover" src={classItem.image_url || '/images/Logo hog 2 - 1.png'} alt={classItem.name} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text">{classItem.name}</div>
                          <div className="text-sm text-text truncate max-w-xs">{classItem.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {classItem.category ? classItem.category.name : 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-background text-text">
                        {classItem.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {classItem.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                      {classItem.is_featured ? (
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
                          to={`/admin/classes/edit/${classItem.id}`}
                          className="text-text hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(classItem.id)}
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
                    {startIndex + paginatedClasses.length}
                  </span> of <span className="font-medium">{filteredClasses.length}</span> results
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

export default ClassesPage; 