import React, { useState, useEffect } from 'react';
import { Project, Bookmark } from '../types';

interface ProjectFormProps {
  bookmarks: Bookmark[];
  onSaveProject: (project: Project) => void;
  onCancel: () => void;
  editingProject?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  bookmarks,
  onSaveProject,
  onCancel,
  editingProject,
}) => {
  const [name, setName] = useState('');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setSelectedBookmarks(editingProject.bookmarkIds);
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      name,
      bookmarkIds: selectedBookmarks,
    };
    onSaveProject(project);
    setName('');
    setSelectedBookmarks([]);
  };

  const handleBookmarkToggle = (bookmarkId: string) => {
    setSelectedBookmarks((prev) =>
      prev.includes(bookmarkId)
        ? prev.filter((id) => id !== bookmarkId)
        : [...prev, bookmarkId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="projectName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bookmarks</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="flex items-center">
              <input
                type="checkbox"
                id={`bookmark-${bookmark.id}`}
                checked={selectedBookmarks.includes(bookmark.id)}
                onChange={() => handleBookmarkToggle(bookmark.id)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor={`bookmark-${bookmark.id}`} className="ml-2 text-sm text-gray-700">
                {bookmark.title}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingProject ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;