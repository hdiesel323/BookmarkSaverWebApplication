import React from 'react';
import { Project, Bookmark } from '../types';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  bookmarks: Bookmark[];
  onOpenProject: (projectId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  bookmarks,
  onOpenProject,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Daily Starts</h2>
      {projects.map((project) => (
        <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onOpenProject(project.id)}
                className="p-2 rounded-full text-green-500 hover:text-green-600"
                title="Open all project tabs"
              >
                <ExternalLink size={20} />
              </button>
              <button
                onClick={() => onEditProject(project)}
                className="p-2 rounded-full text-blue-500 hover:text-blue-600"
                title="Edit project"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDeleteProject(project.id)}
                className="p-2 rounded-full text-red-500 hover:text-red-600"
                title="Delete project"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.bookmarkIds.map((bookmarkId) => {
              const bookmark = bookmarks.find((b) => b.id === bookmarkId);
              return bookmark ? (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  <img src={bookmark.icon} alt="" className="w-4 h-4 mr-2" />
                  {bookmark.title}
                </a>
              ) : null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;