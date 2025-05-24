// features/organizations/hooks/useOrganizations.js
import { useState, useEffect } from 'react';
import { getOrganizations } from '../services/organizationService';

const useOrganizations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgs = await getOrganizations();
        setData(orgs);
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};

export default useOrganizations;
