import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, Plus, Trash2, Edit, FileText } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  author_id: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
}

const BlogManagementPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Fetch authors
      const { data: authorsData, error: authorsError } = await supabase
        .from('authors')
        .select('id, name, email');
      
      if (authorsError) throw authorsError;
      
      setBlogPosts(postsData || []);
      setAuthors(authorsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePostChange = (field: keyof BlogPost, value: string | boolean | null) => {
    if (!editingPost) return;
    
    setEditingPost({
      ...editingPost,
      [field]: value,
      updated_at: new Date().toISOString()
    });
  };

  const createNewPost = () => {
    const newPost: BlogPost = {
      id: `temp-${Date.now()}`,
      title: 'New Blog Post',
      slug: `new-blog-post-${Date.now()}`,
      content: 'Start writing your blog post here...',
      excerpt: 'A brief excerpt of your blog post',
      featured_image_url: '',
      author_id: authors.length > 0 ? authors[0].id : '',
      is_published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setEditingPost(newPost);
    setIsCreating(true);
  };

  const editPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setIsCreating(false);
  };

  const savePost = async () => {
    if (!editingPost) return;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isCreating) {
        // Creating a new post
        const { id, ...newPost } = editingPost; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { error } = await supabase
          .from('blog_posts')
          .insert([newPost]);
        
        if (error) throw error;
        
        setSuccessMessage('Blog post created successfully');
      } else {
        // Updating an existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: editingPost.title,
            slug: editingPost.slug,
            content: editingPost.content,
            excerpt: editingPost.excerpt,
            featured_image_url: editingPost.featured_image_url,
            author_id: editingPost.author_id,
            is_published: editingPost.is_published,
            published_at: editingPost.is_published && !editingPost.published_at ? 
              new Date().toISOString() : editingPost.published_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);
        
        if (error) throw error;
        
        setSuccessMessage('Blog post updated successfully');
      }
      
      // Refresh the data
      await fetchData();
      
      // Clear the editing state
      setEditingPost(null);
      setIsCreating(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    setError(null);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Refresh the data
      await fetchData();
      
      setSuccessMessage('Blog post deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Helper function to get author name by ID
  const getAuthorName = (authorId: string): string => {
    const author = authors.find(a => a.id === authorId);
    return author ? author.name : 'Unknown Author';
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not published';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <p className="text-text">Create and manage blog posts</p>
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

      {editingPost ? (
        // Post Editor
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-text">
                {isCreating ? 'Create New Blog Post' : 'Edit Blog Post'}
              </h3>
              <div className="space-x-4">
                <button
                  onClick={cancelEdit}
                  className="bg-background hover:bg-neutral-200 text-text px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={savePost}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Post
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => handlePostChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Slug
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => handlePostChange('slug', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                  />
                  <button
                    onClick={() => handlePostChange('slug', editingPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                    className="ml-2 bg-background hover:bg-neutral-200 text-text px-3 py-2 rounded-md text-sm"
                  >
                    Generate from Title
                  </button>
                </div>
                <p className="mt-1 text-sm text-text">
                  The slug will be used in the URL: /blog/{editingPost.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Excerpt
                </label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => handlePostChange('excerpt', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                />
                <p className="mt-1 text-sm text-text">
                  A short summary of the post that will appear in previews
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Content
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => handlePostChange('content', e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={editingPost.featured_image_url}
                  onChange={(e) => handlePostChange('featured_image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Author
                </label>
                <select
                  value={editingPost.author_id}
                  onChange={(e) => handlePostChange('author_id', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                >
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPost.is_published}
                    onChange={(e) => handlePostChange('is_published', e.target.checked)}
                    className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                  />
                  <span className="ml-2 text-sm text-text">Published</span>
                </label>
                {editingPost.published_at && (
                  <p className="mt-1 text-sm text-text">
                    Published on: {formatDate(editingPost.published_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Blog Posts List
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-text">Blog Posts</h3>
              <button
                onClick={createNewPost}
                className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Create New Post
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-text mb-4" />
                <p className="text-text">No blog posts found. Create your first post to get started.</p>
                <button
                  onClick={createNewPost}
                  className="mt-4 bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md flex items-center mx-auto"
                >
                  <Plus size={18} className="mr-2" />
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-background">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Author
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Published Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {blogPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text">{post.title}</div>
                          <div className="text-sm text-text">/blog/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text">{getAuthorName(post.author_id)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          {formatDate(post.published_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => editPost(post)}
                            className="text-secondary-600 hover:text-secondary-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-text hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogManagementPage; 