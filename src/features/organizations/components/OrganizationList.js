// features/organizations/components/OrganizationList.js
import React from 'react';
import OrganizationItem from './OrganizationItem';

const OrganizationList = ({ organizations }) => (
  <ul className="pt-12 px-6 prose">
    {organizations.map((org, index) => (
      <OrganizationItem key={index} org={org} />
    ))}
  </ul>
);

export default OrganizationList;
