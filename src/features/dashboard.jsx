import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingCart,
  FaFileExport,
  FaPlus,
  FaSync,
  FaTelegram,
} from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../core/instance/axiosprivate.instance';
import Datatable from '../components/datatables/Datatables';
import { BusinessListingColumns } from '../components/datatables/Columns';
import { styled, keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import useToast from '../components/Toast.components';
import { DeleteConfirmationModal, StatusManagementModal } from '../components/Modal.components';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled Components
const StatCard = styled(Card)(({ color = 'primary' }) => {
  const colorMap = {
    primary: { bg: '#2E7D32', light: '#E8F5E9', icon: '#4CAF50' },
    warning: { bg: '#F57C00', light: '#FFF3E0', icon: '#FF9800' },
    success: { bg: '#388E3C', light: '#E8F5E9', icon: '#66BB6A' },
    error: { bg: '#D32F2F', light: '#FFEBEE', icon: '#EF5350' },
    info: { bg: '#1976D2', light: '#E3F2FD', icon: '#42A5F5' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%)`,
    border: `1px solid ${colors.icon}20`,
    transition: 'all 0.3s ease',
    animation: `${fadeIn} 0.6s ease-out`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${colors.icon}30`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${colors.bg}, ${colors.icon})`,
    },
  };
});

const IconWrapper = styled(Box)(({ color = 'primary' }) => {
  const colorMap = {
    primary: '#2E7D32',
    warning: '#F57C00',
    success: '#388E3C',
    error: '#D32F2F',
    info: '#1976D2',
  };

  return {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colorMap[color] || colorMap.primary}15`,
    color: colorMap[color] || colorMap.primary,
    marginBottom: '12px',
  };
});

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate =useNavigate()
    const queryClient = useQueryClient();
  const { showToast, ToastComponent } = useToast();
  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, business: null });
  const [statusModal, setStatusModal] = useState({ open: false, business: null });

  // ===
  // Fetch statistics
  const { data: statistics, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['businessStatistics'],
    queryFn: async () => {
      const response = await axiosPrivate.get('api/admin/businesses/statistics');
      return response.data?.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Fetch recent businesses
  const { data: recentBusinesses, isLoading: businessesLoading, refetch: refetchBusinesses } = useQuery({
    queryKey: ['recentBusinesses', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('per_page', '10');

      const url = params.toString()
        ? `api/admin/businesses?${params}`
        : 'api/admin/businesses?per_page=10';

      const response = await axiosPrivate.get(url);
      return response.data?.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Calculate percentage
  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  
    // Delete business
    const deleteBusiness = async (businessId) => {
      const response = await axiosPrivate.delete(`api/admin/businesses/${businessId}`);
      return response.data;
    };
  
    // Change business status (unified function for all status changes)
    const changeBusinessStatus = async ({ businessId, newStatus, reason, notes }) => {
      let endpoint = '';
      let payload = { admin_notes: notes };
  
      switch (newStatus) {
        case 'approved':
          endpoint = `api/admin/businesses/${businessId}/approve`;
          break;
        case 'rejected':
          endpoint = `api/admin/businesses/${businessId}/reject`;
          payload.reason = reason;
          break;
        case 'pending':
          endpoint = `api/admin/businesses/${businessId}/revert-to-pending`;
          break;
        case 'bought':
          endpoint = `api/admin/businesses/${businessId}/mark-as-bought`;
          payload.buyer_notes = notes;
          break;
        default:
          throw new Error('Invalid status');
      }
  
      const response = await axiosPrivate.post(endpoint, payload);
      return response.data;
    };
  
   // Delete mutation
    const deleteMutation = useMutation({
      mutationFn: deleteBusiness,
      onSuccess: () => {
        queryClient.invalidateQueries(['businessData']);
        showToast({ title: "", description: "Entreprise supprimée avec succès!", status: "success" });
        setDeleteModal({ open: false, business: null });
      },
      onError: (error) => {
        showToast({ title: "", description: error.response?.data?.message || "Erreur lors de la suppression", status: "error" });
      },
    });
  
    // Status change mutation
    const statusMutation = useMutation({
      mutationFn: changeBusinessStatus,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['businessData']);
        
        const statusMessages = {
          approved: 'Entreprise approuvée avec succès!',
          rejected: 'Entreprise rejetée avec succès!',
          pending: 'Entreprise remise en attente avec succès!',
          bought: 'Entreprise marquée comme achetée avec succès!',
        };
        
        showToast({ 
          title: "", 
          description: statusMessages[variables.newStatus] || "Statut mis à jour avec succès!", 
          status: "success" 
        });
        setStatusModal({ open: false, business: null });
      },
      onError: (error) => {
        showToast({ 
          title: "", 
          description: error.response?.data?.message || "Erreur lors du changement de statut", 
          status: "error" 
        });
      },
    });
  
    // ============= HANDLERS =============
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value || "");
    };

    // Delete handler
    const handleDeleteClick = (row) => {
      setDeleteModal({ open: true, business: row });
    };
  
    const handleDeleteConfirm = () => {
      if (deleteModal.business) {
        deleteMutation.mutate(deleteModal.business.id);
      }
    };
  
    // Status click handler - open modal when clicking on status
    const handleStatusClick = (row) => {
      setStatusModal({ open: true, business: row });
    };
  
    // Status change handler
    const handleStatusChange = (data) => {
      if (!statusModal.business) return;
  
      const payload = {
        businessId: statusModal.business.id,
        newStatus: data.newStatus,
        reason: data.reason,
        notes: data.notes,
      };
  
      statusMutation.mutate(payload);
    };
  
    const handleViewClick = (row) => {
      // Navigate to view page or open view modal
      console.log('View business:', row);
      // Example: navigate(`/admin/businesses/${row.id}`);
    };
  
    const handleEditClick = (row) => {
      // Navigate to edit page or open edit modal
     navigate(`/admin/businesses/${row.id}`);
    };
  
    // Actions for datatable
    const actions = {
      onView: handleViewClick,
      onEdit: handleEditClick,
      onDelete: handleDeleteClick,
      onStatusClick: handleStatusClick, // Add this new action
    };
  
  // Actions for datatable
 

  const handleRefreshAll = () => {
    refetchStats();
    refetchBusinesses();
  };

  const handleExport = async (format) => {
    try {
      const response = await axiosPrivate.get(`api/admin/businesses/export?format=${format}`);
      alert(`Export ${format.toUpperCase()} préparé avec succès`);
      console.log('Export data:', response.data);
    } catch (error) {
      alert(`Erreur lors de l'export: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" alignItems="center" mb={4}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#1e293b',
              mb: 0.5,
            }}
          >
            Tableau de Bord Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestion des entreprises et statistiques
          </Typography>
        </Box>

        <Stack direction={"row"} spacing={1}>
          <Tooltip title="Actualiser les données" arrow>
            <IconButton
              onClick={handleRefreshAll}
              sx={{
                backgroundColor: '#f1f5f9',
                '&:hover': { backgroundColor: '#e2e8f0' }
              }}
            >
              <FaSync />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<FaPlus />}
            sx={{
              backgroundColor: '#2E7D32',
              '&:hover': { backgroundColor: '#1B5E20' }
            }}
          >
            Nouveau
          </Button>
          <Button
            variant="outlined"
            startIcon={<FaFileExport />}
            onClick={() => handleExport('excel')}
          >
            Exporter
          </Button>
        </Stack>
      </Stack>

      {/* Loading Bar */}
      {(statsLoading || businessesLoading) && (
        <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
      )}

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Businesses */}
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <StatCard color="primary">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Entreprises
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                    {statistics?.total_businesses || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prix moyen: {(statistics?.average_price || 0).toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
                <IconWrapper color="primary">
                  <FaChartLine size={24} />
                </IconWrapper>
              </Stack>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Pending */}
        <Grid size={{ xs: 6, sm: 6, md: 2.25 }}>
          <StatCard color="warning">
            <CardContent>
              <Stack spacing={1}>
                <IconWrapper color="warning">
                  <FaClock size={20} />
                </IconWrapper>
                <Typography variant="subtitle2" color="text.secondary">
                  En attente
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {statistics?.pending_count || 0}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(getPercentage(statistics?.pending_count, statistics?.total_businesses))}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#FFF3E0',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#F57C00' }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getPercentage(statistics?.pending_count, statistics?.total_businesses)}%
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Approved */}
        <Grid size={{ xs: 6, sm: 6, md: 2.25 }}>
          <StatCard color="success">
            <CardContent>
              <Stack spacing={1}>
                <IconWrapper color="success">
                  <FaCheckCircle size={20} />
                </IconWrapper>
                <Typography variant="subtitle2" color="text.secondary">
                  Approuvées
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {statistics?.approved_count || 0}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(getPercentage(statistics?.approved_count, statistics?.total_businesses))}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#E8F5E9',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#388E3C' }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getPercentage(statistics?.approved_count, statistics?.total_businesses)}%
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Rejected */}
        <Grid size={{ xs: 6, sm: 6, md: 2.25 }}>
          <StatCard color="error">
            <CardContent>
              <Stack spacing={1}>
                <IconWrapper color="error">
                  <FaTimesCircle size={20} />
                </IconWrapper>
                <Typography variant="subtitle2" color="text.secondary">
                  Rejetées
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {statistics?.rejected_count || 0}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(getPercentage(statistics?.rejected_count, statistics?.total_businesses))}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#FFEBEE',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#D32F2F' }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getPercentage(statistics?.rejected_count, statistics?.total_businesses)}%
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Bought */}
        <Grid size={{ xs: 6, sm: 6, md: 2.25 }}>
          <StatCard color="info">
            <CardContent>
              <Stack spacing={1}>
                <IconWrapper color="info">
                  <FaShoppingCart size={20} />
                </IconWrapper>
                <Typography variant="subtitle2" color="text.secondary">
                  Vendues
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {statistics?.bought_count || 0}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(getPercentage(statistics?.bought_count, statistics?.total_businesses))}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#E3F2FD',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#1976D2' }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {getPercentage(statistics?.bought_count, statistics?.total_businesses)}%
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Secondary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Value */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2E7D32'
                }}
              >
                <FaTelegram size={28} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Valeur totale (approuvées)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {(statistics?.total_value || 0).toLocaleString('fr-FR')} FCFA
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Sold Value */}
         <Grid  size={{ xs: 12, sm: 12, md: 4 }}> 
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: '#E3F2FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1976D2'
                }}
              >
                <FaShoppingCart size={28} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Valeur vendue
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {(statistics?.sold_value || 0).toLocaleString('fr-FR')} FCFA
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Pending Too Long */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F57C00'
                }}
              >
                <FaClock size={28} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  En attente + 7 jours
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {statistics?.pending_too_long || 0}
                </Typography>
                {statistics?.pending_too_long > 0 && (
                  <Chip
                    label="Action requise"
                    size="small"
                    color="warning"
                    sx={{ mt: 0.5, animation: `${pulse} 2s infinite` }}
                  />
                )}
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Businesses Table */}
      <Box>
        <Datatable
          columns={BusinessListingColumns}
          data={recentBusinesses || []}
          title="Soumissions récentes"
          actions={actions}
          isHeadButton
          value={searchQuery}
          onChange={handleSearchChange}
          onRefresh={refetchBusinesses}
          isLoading={businessesLoading}
          onExportExcel={() => handleExport('excel')}
          onExportPDF={() => handleExport('pdf')}
        />
      </Box>

          {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              open={deleteModal.open}
              onClose={() => setDeleteModal({ open: false, business: null })}
              onConfirm={handleDeleteConfirm}
              itemName={deleteModal.business?.name}
              description={`Vous êtes sur le point de supprimer l'entreprise "${deleteModal.business?.name}". Cette action supprimera définitivement toutes les données associées incluant les images, documents et informations du soumissionnaire.`}
              isLoading={deleteMutation.isPending}
            />
      
            {/* Status Management Modal */}
            <StatusManagementModal
              open={statusModal.open}
              onClose={() => setStatusModal({ open: false, business: null })}
              onConfirm={handleStatusChange}
              business={statusModal.business}
              isLoading={statusMutation.isPending}
            />
    </Box>
  );
};

export default Dashboard;