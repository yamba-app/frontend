import { Box } from '@mui/material';
import { BusinessListingColumns } from '../components/datatables/Columns';
import useAxiosPrivate from '../core/instance/axiosprivate.instance';
import Datatable from '../components/datatables/Datatables';
import { useState } from 'react';
import useToast from '../components/Toast.components';
import { DeleteConfirmationModal, StatusManagementModal } from '../components/Modal.components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const BusinessPublish = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { showToast, ToastComponent } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate =useNavigate()
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    location: '',
  });

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, business: null });
  const [statusModal, setStatusModal] = useState({ open: false, business: null });

  // ============= API FUNCTIONS =============
  
  // Fetch function with filters
  const fetchBusinessData = async () => {
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      
      const queryString = params.toString();
      const url = queryString 
        ? `api/admin/businesses?${queryString}` 
        : 'api/admin/businesses';
      
      const response = await axiosPrivate.get(url);
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching business data:", error.message);
      throw new Error("An unknown error occurred while fetching business data.");
    }
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

  // ============= REACT QUERY HOOKS =============

  // Fetch data query
  const { data: businessData, isLoading, refetch } = useQuery({
    queryKey: ['businessData', searchQuery, filters],
    queryFn: fetchBusinessData,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
  });

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

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
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
     navigate(`/admin/businesses/view/${row?.id}`);
  };

  const handleEditClick = (row) => {
      // Navigate to edit page or open edit modal
     navigate(`/admin/businesses/${row?.id}`);
    };
  

  // Actions for datatable
  const actions = {
    onView: handleViewClick,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
    onStatusClick: handleStatusClick, // Add this new action
  };

  // Filter configurations
  const filterConfigs = [
    {
      name: 'status',
      label: 'Statut',
      options: [
        { value: 'pending', label: 'En attente' },
        { value: 'approved', label: 'Approuvé' },
        { value: 'rejected', label: 'Rejeté' },
        { value: 'bought', label: 'Acheté' },
      ],
    },
    {
      name: 'category',
      label: 'Catégorie',
      options: [
        { value: 'technology', label: 'Technologie' },
        { value: 'retail', label: 'Commerce de détail' },
        { value: 'service', label: 'Service' },
        { value: 'manufacturing', label: 'Fabrication' },
        { value: 'food', label: 'Alimentation' },
      ],
    },
    {
      name: 'location',
      label: 'Localisation',
      options: [
        { value: 'Ouagadougou', label: 'Ouagadougou' },
        { value: 'Bobo-Dioulasso', label: 'Bobo-Dioulasso' },
        { value: 'Koudougou', label: 'Koudougou' },
        { value: 'Ouahigouya', label: 'Ouahigouya' },
      ],
    },
  ];

  // Get loading state


  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Datatable
        columns={BusinessListingColumns}
        data={businessData || []}
        title={"Liste des entreprises"}
        actions={actions}
        isHeadButton
        value={searchQuery}
        onChange={handleSearchChange}
        onRefresh={refetch}
        isLoading={isLoading}
        filters={filterConfigs}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        showFilterCount={true}
      />

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

      {ToastComponent}
    </Box>
  );
};

export default BusinessPublish;