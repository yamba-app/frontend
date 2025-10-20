// Custom Datatable Styles
const customTableStyles = {
  table: {
    style: {
      backgroundColor: 'transparent',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'rgba(46, 125, 50, 0.05)',
      borderBottom: '2px solid rgba(46, 125, 50, 0.1)',
      minHeight: '52px',
    },
  },
  headCells: {
    style: {
      fontSize: '13px',
      fontWeight: 700,
      textTransform: 'uppercase',
      color: '#1e293b',
      letterSpacing: '0.5px',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  },
  rows: {
    style: {
      fontSize: '14px',
      color: '#334155',
      backgroundColor: 'transparent',
      minHeight: '60px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(46, 125, 50, 0.04)',
        transform: 'scale(1.001)',
        cursor: 'pointer',
      },
      '&:nth-of-type(even)': {
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
      },
    },
  },
  cells: {
    style: {
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
      backgroundColor: 'rgba(248, 250, 252, 0.5)',
      minHeight: '56px',
      fontSize: '14px',
      color: '#64748b',
      fontWeight: 500,
    },
    pageButtonsStyle: {
      borderRadius: '8px',
      height: '36px',
      width: '36px',
      padding: '8px',
      margin: '0 4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'transparent',
      color: '#64748b',
      fill: '#64748b',
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.3,
      },
      '&:hover:not(:disabled)': {
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        color: '#2E7D32',
        fill: '#2E7D32',
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
      },
    },
  },
  noData: {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#64748b',
      fontSize: '16px',
      fontWeight: 500,
      backgroundColor: 'transparent',
    },
  },
  progress: {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
    },
  },
};
export { customTableStyles };