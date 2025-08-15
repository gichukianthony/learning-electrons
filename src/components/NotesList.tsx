import React from 'react'
import { Note } from '../types'
import './NotesList.css'

interface NotesListProps {
  notes: Note[]
  onDelete: (id: string) => void
  searchTerm: string
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDelete, searchTerm }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContentSnippet = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <div className="empty-state">
          {searchTerm ? (
            <>
              <p>No notes found matching "{searchTerm}"</p>
              <p>Try adjusting your search terms</p>
            </>
          ) : (
            <>
              <p>No notes yet!</p>
              <p>Create your first note using the form above</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="notes-list">
      <h2>Your Notes ({notes.length})</h2>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <button
                className="delete-btn"
                onClick={() => onDelete(note.id)}
                title="Delete note"
                aria-label={`Delete note: ${note.title}`}
              >
                🗑️
              </button>
            </div>
            <p className="note-content">
              {getContentSnippet(note.content)}
            </p>
            <div className="note-footer">
              <span className="note-date">
                Created: {formatDate(note.createdAt)}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span className="note-date">
                  Updated: {formatDate(note.updatedAt)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesList
