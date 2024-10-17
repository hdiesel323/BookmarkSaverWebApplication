import React from 'react';
import { Bookmark, Category } from '../types';
import { Star, Pencil, Trash2 } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  categories: Category[];
  onToggleFavorite: (id: string) => void;
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  categories,
  onToggleFavorite,
  onEditBookmark,
  onDeleteBookmark,
}) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img src={bookmark.icon} alt="" className="w-6 h-6 mr-4" />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{bookmark.title}</h3>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {bookmark.url}
            </a>
            {bookmark.description && <p className="text-gray-600 mt-1">{bookmark.description}</p>}
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2">
              {getCategoryName(bookmark.category)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleFavorite(bookmark.id)}
              className={`p-2 rounded-full ${
                bookmark.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Star size={20} />
            </button>
            <button
              onClick={() => onEditBookmark(bookmark)}
              className="p-2 rounded-full text-blue-500 hover:text-blue-600"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => onDeleteBookmark(bookmark.id)}
              className="p-2 rounded-full text-red-500 hover:text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkList;