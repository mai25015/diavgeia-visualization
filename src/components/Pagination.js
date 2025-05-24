import React, { memo } from 'react';

const PageInfo = memo(({ currentPage, totalPages }) => (
  <span 
    className="text-sm"
    aria-live="polite"
  >
    Σελίδα {currentPage} από {totalPages}
  </span>
));

const PaginationButton = memo(({ onClick, disabled, children, direction }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 text-white rounded bg-primary hover:bg-main disabled:bg-gray-400"
    aria-label={`Μετάβαση στην ${direction} σελίδα`}
    aria-disabled={disabled}
  >
    {children}
  </button>
));

const Pagination = memo(({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <nav 
      className="flex items-center justify-center gap-4 py-6"
      aria-label="Πλοήγηση σελίδων"
    >
      <PaginationButton 
        onClick={onPrev} 
        disabled={currentPage === 1}
        direction="προηγούμενη"
      >
        Προηγούμενη
      </PaginationButton>
      
      <PageInfo 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
      
      <PaginationButton 
        onClick={onNext} 
        disabled={currentPage === totalPages}
        direction="επόμενη"
      >
        Επόμενη
      </PaginationButton>
    </nav>
  );
});

export default Pagination; 