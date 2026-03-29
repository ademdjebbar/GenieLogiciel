import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { AlertTriangle } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      maxWidth="sm"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-danger/10 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-danger" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
              Supprimer la tâche
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <Button variant="danger" onClick={onConfirm}>
            Supprimer
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { ConfirmDeleteModal };
