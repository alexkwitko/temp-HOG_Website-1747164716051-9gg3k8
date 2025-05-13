import React, { useState, useEffect } from 'react';
import { ColorPalette, PaletteColor, DEFAULT_PALETTES } from '../../types/ColorPalette';

interface ColorPaletteSelectorProps {
  selectedPaletteId: string;
  onChange: (paletteId: string) => void;
  customPalettes?: ColorPalette[];
  allowCustomPalette?: boolean;
  allowEditing?: boolean;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({
  selectedPaletteId,
  onChange,
  customPalettes = [],
  allowCustomPalette = false,
  allowEditing = false
}) => {
  const [allPalettes, setAllPalettes] = useState<ColorPalette[]>([...DEFAULT_PALETTES, ...customPalettes]);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [editingPaletteId, setEditingPaletteId] = useState<string | null>(null);
  const [currentlyEditingPalette, setCurrentlyEditingPalette] = useState<ColorPalette | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [customPalette, setCustomPalette] = useState<ColorPalette>({
    id: 'custom',
    name: 'Custom Palette',
    isCustom: true,
    colors: [
      {
        name: 'Primary',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        accent: '#3B82F6',
        border: 'transparent'
      },
      {
        name: 'Secondary',
        background: 'var(--color-secondary)',
        text: 'var(--color-background)',
        accent: '#38BDF8',
        border: 'transparent'
      },
      {
        name: 'Tertiary',
        background: '#F5F5F5',
        text: 'var(--color-secondary)',
        accent: 'var(--color-text)',
        border: 'transparent'
      }
    ]
  });

  useEffect(() => {
    const initialPalettes = [...DEFAULT_PALETTES];
    
    if (customPalettes && customPalettes.length > 0) {
      const filteredCustomPalettes = customPalettes.filter(
        customPalette => !initialPalettes.some(p => p.id === customPalette.id)
      );
      
      initialPalettes.push(...filteredCustomPalettes);
    }
    
    setAllPalettes(initialPalettes);
  }, [customPalettes.length]);

  const handlePaletteChange = (paletteId: string) => {
    onChange(paletteId);
    
    if (editingPaletteId) {
      setEditingPaletteId(null);
      setCurrentlyEditingPalette(null);
    }
  };

  const startEditingPalette = (palette: ColorPalette) => {
    const paletteCopy = JSON.parse(JSON.stringify(palette)) as ColorPalette;
    setCurrentlyEditingPalette(paletteCopy);
    setEditingPaletteId(palette.id);
    setShowCustomizePanel(true);
  };

  const savePaletteEdits = () => {
    if (!currentlyEditingPalette) return;
    
    const updatedPalettes = allPalettes.map(p => 
      p.id === currentlyEditingPalette.id ? currentlyEditingPalette : p
    );
    
    setAllPalettes(updatedPalettes);
    
    if (selectedPaletteId === currentlyEditingPalette.id) {
      onChange(currentlyEditingPalette.id);
    }
    
    setEditingPaletteId(null);
    setCurrentlyEditingPalette(null);
    setShowCustomizePanel(false);
  };

  const cancelEditing = () => {
    setEditingPaletteId(null);
    setCurrentlyEditingPalette(null);
    setShowCustomizePanel(false);
  };

  const updateCustomColor = (index: number, field: keyof PaletteColor, value: string) => {
    if (editingPaletteId && currentlyEditingPalette) {
      const updatedColors = [...currentlyEditingPalette.colors];
      updatedColors[index] = { ...updatedColors[index], [field]: value };
      
      setCurrentlyEditingPalette({
        ...currentlyEditingPalette,
        colors: updatedColors
      });
    } else {
      const updatedColors = [...customPalette.colors];
      updatedColors[index] = { ...updatedColors[index], [field]: value };
      
      const updatedPalette = { ...customPalette, colors: updatedColors };
      setCustomPalette(updatedPalette);
      
      if (allPalettes.some(p => p.id === 'custom')) {
        const updatedPalettes = allPalettes.map(p => 
          p.id === 'custom' ? updatedPalette : p
        );
        
        setAllPalettes(updatedPalettes);
      }
    }
  };

  const addColorToCustomPalette = () => {
    const targetPalette = editingPaletteId && currentlyEditingPalette ? currentlyEditingPalette : customPalette;
    const newColor: PaletteColor = {
      name: `Color ${targetPalette.colors.length + 1}`,
      background: 'var(--color-background)',
      text: 'var(--color-text)',
      accent: '#3B82F6',
      border: 'transparent'
    };
    
    if (editingPaletteId && currentlyEditingPalette) {
      setCurrentlyEditingPalette({
        ...currentlyEditingPalette,
        colors: [...currentlyEditingPalette.colors, newColor]
      });
    } else {
      const updatedPalette = {
        ...customPalette,
        colors: [...customPalette.colors, newColor]
      };
      
      setCustomPalette(updatedPalette);
      
      const updatedPalettes = allPalettes.map(p => 
        p.id === 'custom' ? updatedPalette : p
      );
      
      setAllPalettes(updatedPalettes);
    }
  };

  const removeColorFromCustomPalette = (index: number) => {
    const targetPalette = editingPaletteId && currentlyEditingPalette ? currentlyEditingPalette : customPalette;
    
    if (targetPalette.colors.length <= 1) return;
    
    const updatedColors = targetPalette.colors.filter((_, i) => i !== index);
    
    if (editingPaletteId && currentlyEditingPalette) {
      setCurrentlyEditingPalette({
        ...currentlyEditingPalette,
        colors: updatedColors
      });
    } else {
      const updatedPalette = { ...customPalette, colors: updatedColors };
      
      setCustomPalette(updatedPalette);
      
      const updatedPalettes = allPalettes.map(p => 
        p.id === 'custom' ? updatedPalette : p
      );
      
      setAllPalettes(updatedPalettes);
    }
  };

  const filteredPalettes = allPalettes.filter(palette => 
    palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    palette.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    palette.colors.some(color => color.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderPaletteColors = (palette: ColorPalette) => (
    <div className="flex gap-2 mt-2 flex-wrap">
      {palette.colors.map((color, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div 
            className="w-14 h-14 rounded border border-neutral-200 flex flex-col overflow-hidden"
            title={color.name}
          >
            <div 
              className="flex-1" 
              style={{ 
                backgroundColor: color.background,
                color: color.text,
                borderColor: color.border || 'transparent',
                borderWidth: '2px'
              }}
            >
              <div className="h-full flex items-center justify-center">
                <span className="text-xs font-medium" style={{color: color.text}}>Aa</span>
              </div>
            </div>
            <div 
              className="h-3" 
              style={{ backgroundColor: color.accent }}
            ></div>
          </div>
          <span className="text-xs mt-1">{color.name}</span>
        </div>
      ))}
    </div>
  );

  const targetPalette = editingPaletteId && currentlyEditingPalette ? currentlyEditingPalette : customPalette;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search palettes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-neutral-300 rounded-md"
          />
          <div className="absolute left-3 top-2.5 text-text">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-neutral-200' : 'bg-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-neutral-200' : 'bg-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {filteredPalettes.map(palette => (
          <div 
            key={palette.id}
            className={`relative border rounded-lg p-4 cursor-pointer hover:border-neutral-400 transition ${
              selectedPaletteId === palette.id ? 'border-neutral-800 bg-neutral-50' : 'border-neutral-200'
            }`}
            onClick={() => handlePaletteChange(palette.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{palette.name}</h3>
              <div className="flex items-center space-x-2">
                {selectedPaletteId === palette.id && (
                  <span className="bg-neutral-800 text-white text-xs px-2 py-0.5 rounded">Selected</span>
                )}
                
                {allowEditing && (
                  <button
                    type="button"
                    className="text-xs text-text hover:text-neutral-700 px-2 py-0.5 rounded border border-neutral-300 hover:border-neutral-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingPalette(palette);
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            {palette.description && (
              <p className="text-sm text-text mb-3">{palette.description}</p>
            )}
            
            {renderPaletteColors(palette)}
            
            {palette.id === 'custom' && palette.isCustom && selectedPaletteId === palette.id && (
              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm text-text hover:text-neutral-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCustomizePanel(!showCustomizePanel);
                  }}
                >
                  {showCustomizePanel ? 'Hide Editor' : 'Customize Palette'}
                </button>
              </div>
            )}
          </div>
        ))}
        
        {allowCustomPalette && !allPalettes.some(p => p.id === 'custom') && (
          <button
            type="button"
            className="border border-dashed border-neutral-300 rounded-lg p-4 text-center hover:bg-background text-text"
            onClick={() => {
              setAllPalettes([...allPalettes, customPalette]);
              handlePaletteChange('custom');
              setShowCustomizePanel(true);
            }}
          >
            <span className="block font-medium">+ Create Custom Palette</span>
            <span className="text-sm">Define your own color scheme</span>
          </button>
        )}
      </div>
      
      {showCustomizePanel && (editingPaletteId || selectedPaletteId === 'custom') && (
        <div className="mt-4 border rounded-lg p-4 bg-background">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">
              {editingPaletteId ? `Edit ${currentlyEditingPalette?.name}` : 'Customize Palette'}
            </h3>
            
            {editingPaletteId && (
              <div className="space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-text border border-neutral-300 rounded hover:bg-background"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-white bg-background rounded hover:bg-neutral-700"
                  onClick={savePaletteEdits}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {editingPaletteId && currentlyEditingPalette && (
              <div className="space-y-2 mb-4">
                <div>
                  <label className="block text-xs text-text mb-1">Palette Name</label>
                  <input
                    type="text"
                    value={currentlyEditingPalette.name}
                    onChange={(e) => setCurrentlyEditingPalette({
                      ...currentlyEditingPalette,
                      name: e.target.value
                    })}
                    className="w-full border border-neutral-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text mb-1">Description</label>
                  <input
                    type="text"
                    value={currentlyEditingPalette.description || ''}
                    onChange={(e) => setCurrentlyEditingPalette({
                      ...currentlyEditingPalette,
                      description: e.target.value
                    })}
                    className="w-full border border-neutral-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            )}
            
            {targetPalette.colors.map((color, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateCustomColor(idx, 'name', e.target.value)}
                      className="border-b border-neutral-300 px-1 py-0.5 text-sm font-medium focus:outline-none focus:border-neutral-800"
                    />
                  </div>
                  
                  {targetPalette.colors.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-text hover:text-red-700"
                      onClick={() => removeColorFromCustomPalette(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text mb-1">Background</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={color.background}
                        onChange={(e) => updateCustomColor(idx, 'background', e.target.value)}
                        className="w-8 h-8 p-0 border border-neutral-200 rounded mr-2"
                      />
                      <input
                        type="text"
                        value={color.background}
                        onChange={(e) => updateCustomColor(idx, 'background', e.target.value)}
                        className="flex-1 border border-neutral-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-text mb-1">Text</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={color.text}
                        onChange={(e) => updateCustomColor(idx, 'text', e.target.value)}
                        className="w-8 h-8 p-0 border border-neutral-200 rounded mr-2"
                      />
                      <input
                        type="text"
                        value={color.text}
                        onChange={(e) => updateCustomColor(idx, 'text', e.target.value)}
                        className="flex-1 border border-neutral-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-text mb-1">Accent</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={color.accent}
                        onChange={(e) => updateCustomColor(idx, 'accent', e.target.value)}
                        className="w-8 h-8 p-0 border border-neutral-200 rounded mr-2"
                      />
                      <input
                        type="text"
                        value={color.accent}
                        onChange={(e) => updateCustomColor(idx, 'accent', e.target.value)}
                        className="flex-1 border border-neutral-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-text mb-1">Border</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={color.border || 'transparent'}
                        onChange={(e) => updateCustomColor(idx, 'border', e.target.value)}
                        className="w-8 h-8 p-0 border border-neutral-200 rounded mr-2"
                      />
                      <input
                        type="text"
                        value={color.border || 'transparent'}
                        onChange={(e) => updateCustomColor(idx, 'border', e.target.value)}
                        className="flex-1 border border-neutral-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 p-2 border border-neutral-200 rounded">
                  <div className="text-xs text-text mb-2">Preview:</div>
                  <div 
                    className="h-16 rounded overflow-hidden border"
                    style={{ 
                      backgroundColor: color.background,
                      borderColor: color.border || 'transparent',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center px-2">
                        <div style={{ color: color.text }} className="font-medium">Sample Text</div>
                        <div style={{ color: color.text }} className="text-xs opacity-80">Smaller text example</div>
                      </div>
                    </div>
                    <div className="h-4" style={{ backgroundColor: color.accent }}></div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="w-full border border-dashed border-neutral-300 rounded-lg p-3 text-center hover:bg-background text-text"
              onClick={addColorToCustomPalette}
            >
              + Add Color
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteSelector; 