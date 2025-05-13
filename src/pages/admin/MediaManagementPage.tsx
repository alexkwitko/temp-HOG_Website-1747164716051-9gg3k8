import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Upload, Trash2, Search, FolderPlus, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

interface MediaFile {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  folder: string;
}

const MediaManagementPage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<string[]>(['hero-slides', 'blog', 'instructors', 'classes', 'general']);
  const [currentFolder, setCurrentFolder] = useState<string>('general');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchMediaFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // List files from the current folder in Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .list(currentFolder, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) throw error;
      
      // Get public URLs for each file
      const filesWithUrls = await Promise.all(
        data.filter(item => !item.id.endsWith('/')).map(async (file) => {
          const { data: publicUrl } = supabase.storage
            .from('images')
            .getPublicUrl(`${currentFolder}/${file.name}`);
          
          return {
            id: file.id,
            name: file.name,
            fileUrl: publicUrl.publicUrl,
            fileType: file.metadata?.mimetype || getFileTypeFromName(file.name),
            filePath: `${currentFolder}/${file.name}`,
            fileSize: file.metadata?.size || 0,
            uploadedBy: 'Admin',
            uploadedAt: file.created_at,
            folder: currentFolder
          };
        })
      );
      
      setMediaFiles(filesWithUrls);
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    fetchMediaFiles();
  }, [currentFolder, fetchMediaFiles]);

  const getFileTypeFromName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (documentTypes.includes(extension)) return 'document';
    
    return 'other';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Generate a unique file name to avoid conflicts
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${currentFolder}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        return fileName;
      });
      
      await Promise.all(uploadPromises);
      
      setSuccessMessage(`${files.length} file(s) uploaded successfully`);
      
      // Refresh the file list
      fetchMediaFiles();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploading(false);
      // Clear the file input
      e.target.value = '';
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);
      
      if (error) throw error;
      
      // Remove the file from the state
      setMediaFiles(mediaFiles.filter(file => file.filePath !== filePath));
      
      setSuccessMessage('File deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const createNewFolder = async () => {
    if (!newFolderName) return;
    
    // Sanitize folder name (remove spaces, special chars)
    const sanitizedName = newFolderName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    if (!sanitizedName) {
      setError('Invalid folder name');
      return;
    }
    
    setError(null);
    
    try {
      // Create an empty file to represent the folder
      const { error } = await supabase.storage
        .from('images')
        .upload(`${sanitizedName}/.folder`, new Blob(['']));
      
      if (error) throw error;
      
      // Update folders list
      setFolders([...folders, sanitizedName]);
      
      // Switch to the new folder
      setCurrentFolder(sanitizedName);
      
      setSuccessMessage('Folder created successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset the new folder input
      setNewFolderName('');
      setShowNewFolderInput(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Filter media files based on search query
  const filteredMediaFiles = mediaFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Copy file URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccessMessage('URL copied to clipboard');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Media Management</h2>
        <p className="text-text">Manage images and media files</p>
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setCurrentFolder(folder)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentFolder === folder 
                      ? 'bg-secondary-500 text-white' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {folder}
                </button>
              ))}
              <button
                onClick={() => setShowNewFolderInput(!showNewFolderInput)}
                className="px-3 py-1 text-sm rounded-md bg-background text-white hover:bg-neutral-800 flex items-center"
              >
                <FolderPlus size={16} className="mr-1" />
                New Folder
              </button>
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-text" />
              </div>
              <label className="cursor-pointer bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md flex items-center">
                <Upload size={18} className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Files'}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
            </div>
          </div>

          {showNewFolderInput && (
            <div className="mb-6 flex items-center space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
              />
              <button
                onClick={createNewFolder}
                className="px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-800"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName('');
                }}
                className="px-4 py-2 bg-background text-text rounded-md hover:bg-neutral-200"
              >
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : filteredMediaFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-text mb-4" />
              <p className="text-text">
                {searchQuery 
                  ? 'No files match your search query' 
                  : `No files in the ${currentFolder} folder. Upload files to get started.`
                }
              </p>
              <label className="cursor-pointer mt-4 bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md inline-flex items-center">
                <Upload size={18} className="mr-2" />
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMediaFiles.map((file) => (
                <div key={file.id} className="border border-neutral-200 rounded-md overflow-hidden">
                  <div className="aspect-square bg-background flex items-center justify-center relative">
                    {file.fileType === 'image' ? (
                      <img
                        src={file.fileUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-text">
                        <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs mt-2">{file.name.split('.').pop()?.toUpperCase()}</span>
                      </div>
                    )}
                    <button
                      onClick={() => deleteFile(file.filePath)}
                      className="absolute top-2 right-2 bg-background text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-text truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-text">
                      {formatFileSize(file.fileSize)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(file.fileUrl)}
                      className="mt-2 text-xs text-secondary-600 hover:text-secondary-800"
                    >
                      Copy URL
                    </button>
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

export default MediaManagementPage; 