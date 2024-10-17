import React, { useState, useEffect } from 'react';
import { Bookmark, Project, Category } from './types';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import CategoryForm from './components/CategoryForm';
import { Search, Bookmark as BookmarkIcon, FolderPlus, Tag } from 'lucide-react';

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' },
    { id: '3', name: 'Study' },
    { id: '4', name: 'Other' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    const storedProjects = localStorage.getItem('projects');
    const storedCategories = localStorage.getItem('categories');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [bookmarks, projects, categories]);

  const addBookmark = (newBookmark: Bookmark) => {
    setBookmarks([...bookmarks, newBookmark]);
  };

  const toggleFavorite = (id: string) => {
    setBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, isFavorite: !bookmark.isFavorite } : bookmark
      )
    );
  };

  const editBookmark = (updatedBookmark: Bookmark) => {
    setBookmarks(
      bookmarks.map((bookmark) => (bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark))
    );
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    setProjects(
      projects.map((project) => ({
        ...project,
        bookmarkIds: project.bookmarkIds.filter((bookmarkId) => bookmarkId !== id),
      }))
    );
  };

  const saveProject = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects([...projects, project]);
    }
    setShowProjectForm(false);
    setEditingProject(undefined);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const openProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.bookmarkIds.forEach((bookmarkId) => {
        const bookmark = bookmarks.find((b) => b.id === bookmarkId);
        if (bookmark) {
          window.open(bookmark.url, '_blank');
        }
      });
    }
  };

  const addCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
    setShowCategoryForm(false);
  };

  const filteredBookmarks = bookmarks
    .filter((bookmark) =>
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((bookmark) => filter === 'all' || (filter === 'favorites' && bookmark.isFavorite));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-indigo-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">Bookmark Saver</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowProjectForm(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FolderPlus className="mr-2" size={20} />
              New Project
            </button>
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Tag className="mr-2" size={20} />
              New Category
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <BookmarkForm onAddBookmark={addBookmark} categories={categories} />
              {showProjectForm && (
                <div className="mt-6">
                  <ProjectForm
                    bookmarks={bookmarks}
                    onSaveProject={saveProject}
                    onCancel={() => {
                      setShowProjectForm(false);
                      setEditingProject(undefined);
                    }}
                    editingProject={editingProject}
                  />
                </div>
              )}
              {showCategoryForm && (
                <div className="mt-6">
                  <CategoryForm onAddCategory={addCategory} onCancel={() => setShowCategoryForm(false)} />
                </div>
              )}
            </div>
            <div className="lg:w-2/3">
              <div className="mb-4">
                <ProjectList
                  projects={projects}
                  bookmarks={bookmarks}
                  onOpenProject={openProject}
                  onEditProject={(project) => {
                    setEditingProject(project);
                    setShowProjectForm(true);
                  }}
                  onDeleteProject={deleteProject}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search bookmarks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'favorites')}
                  className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="all">All</option>
                  <option value="favorites">Favorites</option>
                </select>
              </div>
              <BookmarkList
                bookmarks={filteredBookmarks}
                onToggleFavorite={toggleFavorite}
                onEditBookmark={editBookmark}
                onDeleteBookmark={deleteBookmark}
                categories={categories}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;