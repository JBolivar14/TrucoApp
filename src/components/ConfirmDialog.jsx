import { X, AlertTriangle } from 'lucide-react'
import './ConfirmDialog.css'

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción', 
  message = '¿Estás seguro de realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={`confirm-icon confirm-icon-${type}`}>
          <AlertTriangle size={32} />
        </div>
        
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="confirm-btn-confirm" onClick={() => {
            onConfirm()
            onClose()
          }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

