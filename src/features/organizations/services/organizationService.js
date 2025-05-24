// features/organizations/services/organizationService.js
import axios from 'axios';

export const getOrganizations = async () => {
  const response = await axios.get('http://localhost:8080/proxy', {
    params: {
      // url: 'https://diavgeia.gov.gr/luminapi/opendata/organizations.json'
      url: 'https://test3.diavgeia.gov.gr/luminapi/opendata/organizations.json',
    }
  });
  return response.data.organizations || [];
};
