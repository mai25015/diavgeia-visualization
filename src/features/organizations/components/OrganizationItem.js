import React from 'react';

const statusMap = {
  active: { 
    label: 'Ενεργός', 
    color: 'bg-green-600',
    ariaLabel: 'Ο φορέας είναι ενεργός'
  },
  inactive: { 
    label: 'Μη ενεργός', 
    color: 'bg-[#ab0613]',
    ariaLabel: 'Ο φορέας δεν είναι ενεργός'
  },
  pending: { 
    label: 'Υπό ενεργοποίηση', 
    color: 'bg-yellow-500',
    ariaLabel: 'Ο φορέας βρίσκεται υπό ενεργοποίηση'
  },
};

const OrganizationItem = ({ org }) => {
  const status = statusMap[org.status] || { 
    label: 'Άγνωστη', 
    color: 'bg-gray-400',
    ariaLabel: 'Η κατάσταση του φορέα είναι άγνωστη'
  };

  return (
    <li 
      className="p-2 border-b"
      role="article"
      aria-labelledby={`org-name-${org.uid}`}
    >
      <div className="grid gap-2">
        <div>
          <div className="text-xs text-gray-500" id={`org-name-${org.uid}`}>Όνομα Φορέα:</div>
          <div className="font-medium" aria-label={`Όνομα φορέα: ${org.label}`}>{org.label}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">UID:</div>
          <div 
            className="font-mono"
            aria-label={`Μοναδικός αναγνωριστικός κωδικός: ${org.uid}`}
          >
            {org.uid}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Κατάσταση:</div>
          <div 
            className="flex items-center gap-2"
            role="status"
            aria-label={status.ariaLabel}
          >
            <span 
              className={`w-2 h-2 rounded-full ${status.color}`}
              aria-hidden="true"
            />
            <span>{status.label}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default OrganizationItem;
