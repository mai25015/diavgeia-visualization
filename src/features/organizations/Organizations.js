import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import useOrganizations from '../organizations/hooks/useOrganizations';
import OrganizationList from '../organizations/components/OrganizationList';
import Pagination from '../../components/Pagination';
import LoadingProgress from '../../components/LoadingProgress';

// Memoized components to prevent unnecessary re-renders
const MemoizedOrganizationList = memo(OrganizationList);

const PageInfo = memo(({ currentPage, totalPages }) => (
  <span>Σελίδα {currentPage} από {totalPages}</span>
));

const PaginationButton = memo(({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 text-white rounded bg-primary hover:bg-main disabled:bg-gray-400"
  >
    {children}
  </button>
));

const Organizations = () => {
  const { data, loading } = useOrganizations();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const itemsPerPage = 10;

  // Simulate loading progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      if (loading) {
        progress = Math.min(progress + Math.random() * 10, 90);
        setLoadingProgress(progress);
      } else {
        setLoadingProgress(100);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  // Calculate only what's needed for rendering
  const paginationData = useMemo(() => {
    if (!data.length) return { currentData: [], totalPages: 0 };
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      currentData: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage)
    };
  }, [data, currentPage, itemsPerPage]);

  // Stable callback references
  const handlePrev = useCallback(() => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage(prev => prev < paginationData.totalPages ? prev + 1 : prev);
  }, [paginationData.totalPages]);

  // Early return for loading state
  if (loading) {
    return (
      <div className="bg-[#fef9f5] mx-auto container">
        <h1 className="mt-12 mb-12 px-6 text-2xl font-medium text">
          Λήψη όλων των εγγεγραμμένων φορέων στη Διαύγεια
        </h1>
        <LoadingProgress progress={loadingProgress} />
      </div>
    );
  }

  return (
    <div className="bg-[#fef9f5] mx-auto container">
      <h1 className="m-12 text-2xl font-medium text">
        Λήψη όλων των εγγεγραμμένων φορέων στη Διαύγεια
      </h1>
      
      <p className="p-12">
        Σύνολο εγγεγραμμένων φορέων: 
        <span className="text-2xl font-bold text"> {data.length}</span>
      </p>

      <MemoizedOrganizationList organizations={paginationData.currentData} />

      <Pagination
        currentPage={currentPage}
        totalPages={paginationData.totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default memo(Organizations);