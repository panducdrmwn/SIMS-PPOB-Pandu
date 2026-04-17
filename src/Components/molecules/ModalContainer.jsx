import { useModal } from '../../contexts/ModalContext';


export function ModalContainer() {
  const { modals, closeModal } = useModal()

  return (
    <>
      {modals.map((modal) => (
        <div key={modal.id} className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => modal.closable && closeModal(modal.id)}
          />

          {/* Modal */}
          <div className={`relative bg-white rounded-lg shadow-lg w-96`}>
            {/* Header */}
            <div className="flex items-center justify-between  px-6 py-4">
              {modal.closable && (
                <button
                  onClick={() => closeModal(modal.id)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
                >
                  ×
                </button>
              )}
            </div>

            {/* Content */}
            <div className="text-center">
              {typeof modal.content === 'string' ? (
                <p className="text-gray-600">{modal.content}</p>
              ) : (
                modal.content
              )}
              
            </div>

            {/* Footer */}
            {modal.footer && (
              <div className="px-6 py-4 flex flex-col justify-center text-center gap-2">
                {modal.footer}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
