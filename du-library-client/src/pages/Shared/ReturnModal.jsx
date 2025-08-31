// components/Shared/ReturnModal.jsx
import React from "react";

const ReturnModal = ({ isOpen, onClose, onConfirm, bookTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Return</h2>
        <p className="text-gray-700">
          Are you sure you want to return the book{" "}
          <strong>{bookTitle}</strong>?
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn bg-[#E62727] btn-sm text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
