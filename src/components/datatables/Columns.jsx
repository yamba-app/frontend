import { Box, IconButton, Chip, Avatar, Tooltip, Stack } from '@mui/material';
import { FaEdit, FaTrash, FaEye, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { styled } from '@mui/system';
// Status configuration
const statusConfig = {
  pending: {
    label: 'En attente',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  approved: {
    label: 'Approuvé',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  rejected: {
    label: 'Rejeté',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  bought: {
    label: 'Acheté',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
};
// Styled Components for Actions
const ActionButton = styled(IconButton)(({ color = 'default' }) => {
  const colorMap = {
    edit: {
      bg: 'rgba(59, 130, 246, 0.1)',
      hover: 'rgba(59, 130, 246, 0.2)',
      color: '#3b82f6',
    },
    delete: {
      bg: 'rgba(239, 68, 68, 0.1)',
      hover: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
    },
    view: {
      bg: 'rgba(16, 185, 129, 0.1)',
      hover: 'rgba(16, 185, 129, 0.2)',
      color: '#10b981',
    },
  };

  const colors = colorMap[color] || colorMap.view;

  return {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.color}20`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.hover,
      transform: 'scale(1.05)',
    },
  };
});

// Business Listing Columns (matches BusinessForm data shape)
export const BusinessListingColumns = (actions) => [
  {
    name: 'N°',
    selector: (row) => row.businessNumber || row.business_number || row.id,
    sortable: true,
    width: '110px',
    cell: (row) => (
      <Chip
        label={row.businessNumber || row.business_number || `#${row.id}`}
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: 'rgba(100, 116, 139, 0.06)',
          color: '#374151',
          fontSize: '12px',
        }}
      />
    ),
  },
  {
    name: 'Entreprise',
    selector: (row) => row.name,
    sortable: true,
    minWidth: '300px',
    cell: (row) => (
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={row.photos && row.photos[0] ? row.photos[0].url : undefined}
          alt={row.name}
          sx={{ width: 56, height: 56, border: '2px solid rgba(46, 125, 50, 0.08)' }}
        >
          {row.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ overflow: 'hidden' }}>
          <Box sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', mb: 0.3 }}>
            {row.name}
          </Box>
          <Box sx={{ fontSize: '12px', color: '#64748b' }}>
            {row.category} • {row.location}
          </Box>
          <Box 
            sx={{ 
              fontSize: '12px', 
              color: '#94a3b8', 
              mt: 0.5, 
              overflow: 'hidden', 
              maxWidth: '220px', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }} 
            title={row.description}
          >
            {row.description}
          </Box>
        </Box>
      </Box>
    ),
  },
  {
    name: 'Prix (FCFA)',
    selector: (row) => row.price,
    sortable: true,
    width: '140px',
    cell: (row) => (
      <Box sx={{ fontWeight: 700, color: '#065f46' }}>
        {typeof row.price === 'number'
          ? row.price.toLocaleString('fr-FR')
          : (row.price || '').toString()}
      </Box>
    ),
  },
  {
    name: "Année",
    selector: (row) => row.yearEstablished || row.year_established,
    sortable: true,
    width: '110px',
    cell: (row) => (
      <Box sx={{ color: '#334155' }}>
        {row.yearEstablished || row.year_established || '—'}
      </Box>
    ),
  },
  {
    name: 'Employés',
    selector: (row) => row.businessDetails?.employees || row.employees,
    sortable: true,
    width: '120px',
    cell: (row) => (
      <Box sx={{ color: '#334155', fontWeight: 600 }}>
        {row.businessDetails?.employees ?? row.employees ?? '—'}
      </Box>
    ),
  },
  {
    name: 'CA mensuel',
    selector: (row) => row.businessDetails?.monthlyRevenue || row.monthly_revenue,
    sortable: true,
    width: '140px',
    cell: (row) => (
      <Box sx={{ color: '#0f766e' }}>
        {(row.businessDetails?.monthlyRevenue || row.monthly_revenue)
          ? Number(row.businessDetails?.monthlyRevenue || row.monthly_revenue).toLocaleString('fr-FR')
          : '—'}
      </Box>
    ),
  },
  {
    name: 'Statut',
    selector: (row) => row.status,
    sortable: true,
    width: '140px',
    cell: (row) => {
      const status = row.status?.toLowerCase() || 'pending';
      const config = statusConfig[status] || statusConfig.pending;
      
      return (
        <Tooltip title="Cliquez pour changer le statut" arrow>
          <Chip
            label={config.label}
            size="small"
            onClick={() => actions?.onStatusClick && actions.onStatusClick(row)}
            sx={{
              fontWeight: 700,
              bgcolor: config.bgColor,
              color: config.color,
              border: `1px solid ${config.borderColor}`,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 0 0 3px ${config.bgColor}`,
                borderColor: config.color,
              },
            }}
          />
        </Tooltip>
      );
    },
  },
  {
    name: 'Posté le',
    selector: (row) => row.datePosted || row.created_at,
    sortable: true,
    width: '150px',
    cell: (row) => (
      <Box sx={{ color: '#64748b', fontSize: '13px' }}>
        {row.datePosted || row.created_at
          ? new Date(row.datePosted || row.created_at).toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })
          : '—'}
      </Box>
    ),
  },
  {
    name: 'Soumis par',
    selector: (row) => row.submitter_name || row.owner?.name,
    sortable: false,
    minWidth: '220px',
    cell: (row) => (
      <Box>
        <Box sx={{ fontWeight: 700, color: '#0f172a' }}>
          {row.submitter_name || row.owner?.name || row.contactName || '—'}
        </Box>
        <Box sx={{ fontSize: '12px', color: '#64748b' }}>
          {row.submitter_email || row.owner?.email || row.contactEmail || '—'}
        </Box>
        <Box sx={{ fontSize: '12px', color: '#94a3b8' }}>
          {row.submitter_phone || row.owner?.phone || row.contactPhone || ''}
        </Box>
      </Box>
    ),
  },
  {
    name: 'Actions',
    width: '180px',
    cell: (row) => (
      <Stack direction="row" spacing={1}>
        {actions?.onView && (
          <Tooltip title="Voir les détails" arrow>
            <ActionButton color="view" onClick={() => actions.onView(row)} aria-label="view">
              <FaEye size={14} />
            </ActionButton>
          </Tooltip>
        )}
        {actions?.onEdit && (
          <Tooltip title="Modifier" arrow>
            <ActionButton color="edit" onClick={() => actions.onEdit(row)} aria-label="edit">
              <FaEdit size={14} />
            </ActionButton>
          </Tooltip>
        )}
        {actions?.onDelete && (
          <Tooltip title="Supprimer" arrow>
            <ActionButton color="delete" onClick={() => actions.onDelete(row)} aria-label="delete">
              <FaTrash size={14} />
            </ActionButton>
          </Tooltip>
        )}
      </Stack>
    ),
  },
];