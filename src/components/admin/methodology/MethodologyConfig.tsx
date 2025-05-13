import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { Save, Move, Edit, Plus, Trash, Award, Users, Calendar, ShieldCheck, Shield, Target, Brain, Dumbbell } from 'lucide-react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { StrictModeDroppable } from '../../../components/StrictModeDroppable';
import ComponentPreview from '../home/ComponentPreview';
import { useSiteSettings } from '../../../contexts/SiteSettingsContext';

// Methodology item types
interface MethodologyItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order: number;
  is_active: boolean;
  text_color?: string;
  icon_color?: string;
  text_alignment?: string;
  icon_alignment?: string;
  button_text?: string;
  button_url?: string;
}

const DEFAULT_METHODOLOGY: MethodologyItem[] = [
  {
    id: 'fundamental',
    title: 'Fundamentals First',
    description: 'Master the core techniques and principles that form the foundation of effective BJJ.',
    icon_name: 'Shield',
    order: 1,
    is_active: true,
    text_color: 'var(--color-secondary)',
    icon_color: 'var(--color-secondary)',
    text_alignment: 'left',
    icon_alignment: 'left'
  },
  {
    id: 'progressive',
    title: 'Progressive Learning',
    description: 'Structured curriculum that builds complexity as you advance in your journey.',
    icon_name: 'Target',
    order: 2,
    is_active: true,
    text_color: 'var(--color-secondary)',
    icon_color: 'var(--color-secondary)',
    text_alignment: 'left',
    icon_alignment: 'left'
  },
  {
    id: 'conceptual',
    title: 'Conceptual Understanding',
    description: 'Focus on the underlying principles that connect techniques and positions.',
    icon_name: 'Brain',
    order: 3,
    is_active: true,
    text_color: 'var(--color-secondary)',
    icon_color: 'var(--color-secondary)',
    text_alignment: 'left',
    icon_alignment: 'left'
  },
  {
    id: 'practical',
    title: 'Practical Application',
    description: 'Regular drilling and sparring to develop real-world effectiveness.',
    icon_name: 'Dumbbell',
    order: 4,
    is_active: true,
    text_color: 'var(--color-secondary)',
    icon_color: 'var(--color-secondary)',
    text_alignment: 'left',
    icon_alignment: 'left'
  }
];

const AVAILABLE_ICONS = [
  { name: 'Award', component: Award },
  { name: 'Users', component: Users },
  { name: 'Calendar', component: Calendar },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Shield', component: Shield },
  { name: 'Target', component: Target },
  { name: 'Brain', component: Brain },
  { name: 'Dumbbell', component: Dumbbell }
];

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Methodology component failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-background border-2 border-red-400 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-text">Error Rendering Component</h2>
          <p className="mb-2">Something went wrong while rendering this component.</p>
          <p className="font-medium">Error details: {this.state.error?.message || 'Unknown error'}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-background text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * MethodologyConfig Component
 * 
 * This component configures the CONTENT of the Training Methodology section:
 * - Individual methodology items (title, description, icon)
 * - Order of methodology items
 * - Active/inactive status of items
 * 
 * Note: Container styling (background color, padding, etc.) is managed in the 
 * Home Page Configuration screen. This page only configures the content.
 */
const MethodologyConfig: React.FC = () => {
  const [items, setItems] = useState<MethodologyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [columnsLayout, setColumnsLayout] = useState('4');
  const [newItem, setNewItem] = useState<MethodologyItem>({
    id: '',
    title: '',
    description: '',
    icon_name: 'Shield',
    order: 0,
    is_active: true,
    text_color: 'var(--color-secondary)',
    icon_color: 'var(--color-secondary)',
    text_alignment: 'left',
    icon_alignment: 'left'
  });

  useEffect(() => {
    fetchMethodologyItems();
    fetchColumnLayout();
  }, []);

  const fetchMethodologyItems = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting to fetch methodology items...');
      
      const { data, error } = await supabase
        .from('methodology')
        .select('*')
        .order('"order"');
      
      console.log('Fetch result:', { data, error });
      
      if (error) {
        console.error('Error fetching methodology items:', error);
        
        // Handle specific database errors
        if (error.code === '42P01' || error.message.includes('relation "methodology" does not exist')) {
          setError('The methodology table does not exist in the database. Please check your database setup or contact your administrator.');
          console.log('Using default methodology items due to missing table');
          setItems(DEFAULT_METHODOLOGY);
        } else {
          setError(`Database error: ${error.message}`);
          // Still load default values as fallback
          setItems(DEFAULT_METHODOLOGY);
        }
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} methodology items in database`);
        setItems(data);
      } else {
        console.log('No methodology items found, using defaults');
        setItems(DEFAULT_METHODOLOGY);
      }
    } catch (err) {
      console.error('Error in fetchMethodologyItems:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Still set some items to prevent white screen
      setItems(DEFAULT_METHODOLOGY);
    } finally {
      setLoading(false);
    }
  };

  const fetchColumnLayout = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'methodology_columns_layout');

      if (error) {
        console.error('Error fetching column layout:', error);
        return;
      }

      if (data && data.length > 0) {
        setColumnsLayout(data[0].value);
      }
    } catch (err) {
      console.error('Error in fetchColumnLayout:', err);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each item
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setItems(updatedItems);
  };

  const toggleItemActive = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, is_active: !item.is_active } 
          : item
      )
    );
  };

  const toggleEditItem = (id: string) => {
    setEditingItem(editingItem === id ? null : id);
  };

  const updateItemField = (id: string, field: keyof MethodologyItem, value: string | boolean) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };

  const handleSave = async () => {
    console.log('Attempting to save methodology items...');
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      console.log('Items to save:', items);
      
      // Update all items in a single batch
      const { error } = await supabase
        .from('methodology')
        .upsert(items);
      
      if (error) {
        console.error('Error saving methodology items:', error);
        throw error;
      }

      // Also save the column layout setting
      const { error: configError } = await supabase
        .from('site_config')
        .upsert({ 
          key: 'methodology_columns_layout', 
          value: columnsLayout 
        }, 
        { onConflict: 'key' });

      if (configError) {
        console.error('Error saving column layout:', configError);
      }
      
      console.log('Save successful!');
      setSuccessMessage('Training methodology configuration saved successfully!');
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addNewItem = () => {
    if (!newItem.title || !newItem.description) {
      setError('Title and description are required');
      return;
    }
    
    // Create a unique ID based on the title
    const id = `${newItem.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Add new item with next order position
    const newCreatedItem: MethodologyItem = {
      ...newItem,
      id,
      order: items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 1,
    };
    
    setItems([...items, newCreatedItem]);
    setShowNewItemForm(false);
    
    // Reset new item form
    setNewItem({
      id: '',
      title: '',
      description: '',
      icon_name: 'Shield',
      order: 0,
      is_active: true,
      text_color: 'var(--color-secondary)',
      icon_color: 'var(--color-secondary)',
      text_alignment: 'left',
      icon_alignment: 'left'
    });
  };

  const deleteItem = (id: string) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return filtered.map((item, index) => ({
        ...item,
        order: index + 1
      }));
    });
  };

  // Add a renderIcon function to properly handle icon rendering
  const renderIcon = (iconName: string, size: number = 24) => {
    const iconObj = AVAILABLE_ICONS.find(icon => icon.name === iconName);
    if (!iconObj) return <Award size={size} />; // Fallback icon
    
    const IconComponent = iconObj.component;
    return <IconComponent size={size} />;
  };

  // Add this to the existing renderIconSelect function
  const renderIconSelect = (selectedIcon: string, onChange: (icon: string) => void) => {
    return (
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {AVAILABLE_ICONS.map(icon => {
          const IconComponent = icon.component;
          return (
            <button
              key={icon.name}
              type="button"
              onClick={() => onChange(icon.name)}
              className={`p-2 rounded-md ${
                selectedIcon === icon.name
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title={icon.name}
            >
              <IconComponent size={20} />
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background rounded w-1/4"></div>
          <div className="h-4 bg-background rounded w-1/2"></div>
          <div className="h-32 bg-background rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Training Methodology Configuration</h2>
            <p className="text-text">
              Customize the training methodology pillars displayed on the homepage.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewItemForm(true)}
              className="flex items-center px-4 py-2 bg-background text-text rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Method
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-background hover:bg-purple-700 text-white rounded"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-background border-l-4 border-red-500 text-text">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            {error.includes('table does not exist') && (
              <div className="mt-2">
                <p>You may need to run database migrations to create the methodology table.</p>
                <p className="mt-1 font-medium">Using default methodology items for now. Changes will not be saved to the database.</p>
              </div>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-background border-l-4 border-green-500 text-text">
            <p className="font-medium">Success</p>
            <p>{successMessage}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-1">Card Columns Layout</label>
          <div className="flex gap-2">
            {['1', '2', '3', '4'].map((cols) => (
              <button
                key={cols}
                onClick={() => setColumnsLayout(cols)}
                className={`flex-1 p-2 border rounded ${
                  columnsLayout === cols 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cols} {parseInt(cols) === 1 ? 'Column' : 'Columns'}
              </button>
            ))}
          </div>
          <p className="text-sm text-text mt-1">
            Choose how many columns to display your methodology cards in.
          </p>
        </div>

        {showPreview && (
          <div className="mb-6 border rounded-lg p-4 bg-background">
            <h2 className="text-xl font-semibold mb-4">Component Preview</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <ComponentPreview 
                components={[
                  { 
                    id: 'methodology', 
                    is_active: true, 
                    order: 4,
                    name: 'Training Methodology',
                    background_color: '#ffffff',
                    text_color: 'var(--color-text)',
                    border_color: 'transparent',
                    border_width: 0,
                    border_radius: 0,
                    padding: '1rem',
                    margin: '0'
                  }
                ]}
                globalPaletteId="default"
                componentPaletteOverrides={{}}
                singleComponentId="methodology"
                triggerRefresh={Date.now()}
              />
            </div>
          </div>
        )}

        {showNewItemForm && (
          <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Add New Item</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Icon</label>
                {renderIconSelect(newItem.icon_name, (iconName) => setNewItem({...newItem, icon_name: iconName}))}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Text Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newItem.text_color || 'var(--color-secondary)'}
                      onChange={(e) => setNewItem({...newItem, text_color: e.target.value})}
                      className="p-1 border rounded h-10 w-10"
                    />
                    <input
                      type="text"
                      value={newItem.text_color || 'var(--color-secondary)'}
                      onChange={(e) => setNewItem({...newItem, text_color: e.target.value})}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Icon Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newItem.icon_color || 'var(--color-secondary)'}
                      onChange={(e) => setNewItem({...newItem, icon_color: e.target.value})}
                      className="p-1 border rounded h-10 w-10"
                    />
                    <input
                      type="text"
                      value={newItem.icon_color || 'var(--color-secondary)'}
                      onChange={(e) => setNewItem({...newItem, icon_color: e.target.value})}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Text Alignment</label>
                  <select
                    value={newItem.text_alignment || 'left'}
                    onChange={(e) => setNewItem({...newItem, text_alignment: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Icon Alignment</label>
                  <select
                    value={newItem.icon_alignment || 'left'}
                    onChange={(e) => setNewItem({...newItem, icon_alignment: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                  <input
                    type="text"
                    value={newItem.button_text || ''}
                    onChange={(e) => setNewItem({...newItem, button_text: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Learn More"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                  <input
                    type="text"
                    value={newItem.button_url || ''}
                    onChange={(e) => setNewItem({...newItem, button_url: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowNewItemForm(false)}
                className="px-4 py-2 bg-background hover:bg-gray-400 text-text rounded"
              >
                Cancel
              </button>
              <button
                onClick={addNewItem}
                className="px-4 py-2 bg-background hover:bg-blue-700 text-white rounded"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="methodology-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border rounded-lg overflow-hidden bg-white"
                      >
                        <div 
                          className={`p-4 flex justify-between items-center ${
                            item.is_active ? 'bg-white' : 'bg-neutral-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="mr-3 cursor-move text-text hover:text-neutral-600"
                            >
                              <Move size={20} />
                            </div>
                            <div className="mr-4">
                              {/* Render selected icon */}
                              {renderIcon(item.icon_name, 24)}
                            </div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-text">Order: {item.order}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleItemActive(item.id)}
                              className={`p-2 rounded-md ${
                                item.is_active 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                              title={item.is_active ? 'Disable' : 'Enable'}
                            >
                              {item.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => toggleEditItem(item.id)}
                              className="p-2 bg-background text-text rounded-md hover:bg-neutral-200"
                              title="Edit Item"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-2 bg-background text-text rounded-md hover:bg-red-200"
                              title="Delete Item"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {editingItem === item.id && (
                          <div className="mt-4 p-4 bg-background rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Title</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                                  className="w-full p-2 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Icon</label>
                                {renderIconSelect(item.icon_name, (iconName) => updateItemField(item.id, 'icon_name', iconName))}
                              </div>
                              <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-text mb-1">Description</label>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                                  rows={3}
                                  className="w-full p-2 border rounded"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Text Color</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="color"
                                      value={item.text_color || 'var(--color-secondary)'}
                                      onChange={(e) => updateItemField(item.id, 'text_color', e.target.value)}
                                      className="p-1 border rounded h-10 w-10"
                                    />
                                    <input
                                      type="text"
                                      value={item.text_color || 'var(--color-secondary)'}
                                      onChange={(e) => updateItemField(item.id, 'text_color', e.target.value)}
                                      className="flex-1 p-2 border rounded"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Icon Color</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="color"
                                      value={item.icon_color || 'var(--color-secondary)'}
                                      onChange={(e) => updateItemField(item.id, 'icon_color', e.target.value)}
                                      className="p-1 border rounded h-10 w-10"
                                    />
                                    <input
                                      type="text"
                                      value={item.icon_color || 'var(--color-secondary)'}
                                      onChange={(e) => updateItemField(item.id, 'icon_color', e.target.value)}
                                      className="flex-1 p-2 border rounded"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Text Alignment</label>
                                  <select
                                    value={item.text_alignment || 'left'}
                                    onChange={(e) => updateItemField(item.id, 'text_alignment', e.target.value)}
                                    className="w-full p-2 border rounded"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Icon Alignment</label>
                                  <select
                                    value={item.icon_alignment || 'left'}
                                    onChange={(e) => updateItemField(item.id, 'icon_alignment', e.target.value)}
                                    className="w-full p-2 border rounded"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                                  <input
                                    type="text"
                                    value={item.button_text || ''}
                                    onChange={(e) => updateItemField(item.id, 'button_text', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Learn More"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                                  <input
                                    type="text"
                                    value={item.button_url || ''}
                                    onChange={(e) => updateItemField(item.id, 'button_url', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="https://example.com/page"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
    </ErrorBoundary>
  );
};

export default function MethodologyConfigWithErrorBoundary() {
  // Access global settings
  const { settings } = useSiteSettings();

  return (
    <ErrorBoundary>
      <MethodologyConfig />
    </ErrorBoundary>
  );
}; 