import React, { useState } from 'react'
import './NoteForm.css'

interface NoteFormProps {
  onSave: (title: string, content: string) => void
}

const NoteForm: React.FC<NoteFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSave(title.trim(), content.trim())
      // Reset form after successful save
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl+Enter to submit the form
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit(e as any)
    }
  }

  const isFormValid = title.trim().length > 0 && content.trim().length > 0

  return (
    <div className="note-form-container">
      <h2>Create New Note</h2>
      <form className="note-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="form-input"
            required
            maxLength={100}
          />
          <span className="char-count">{title.length}/100</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your note content here... (Ctrl+Enter to save)"
            className="form-textarea"
            rows={6}
            required
            maxLength={5000}
          />
          <span className="char-count">{content.length}/5000</span>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="save-btn"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Note'}
          </button>
          
          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              setTitle('')
              setContent('')
            }}
            disabled={!title && !content}
          >
            Clear
          </button>
        </div>
        
        <div className="form-tip">
          💡 Tip: Use Ctrl+Enter to quickly save your note
        </div>
      </form>
    </div>
  )
}

export default NoteForm
