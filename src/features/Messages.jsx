import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    CircularProgress,
    Badge,
} from '@mui/material';
import { 
    FaEnvelope, 
    FaPhone, 
    FaUser, 
    FaReply, 
    FaInbox, 
    FaEnvelopeOpen, 
    FaCheckCircle, 
    FaBuilding 
} from 'react-icons/fa';
import useToast from '../components/Toast.components';
import { DeleteConfirmationModal } from '../components/Modal.components';
import { 
    useBusinessMessages, 
    useMarkMessageAsRead, 
    useMarkMessageAsReplied, 
    useDeleteMessage,
    useAllBusinessesForMessages 
} from './services/Messages.services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageColumns } from '../components/datatables/Columns';
import Datatable from '../components/datatables/Datatables';

const MessagesPage = () => {
    const { showToast, ToastComponent } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBusinessId, setSelectedBusinessId] = useState('');
    
    // Filter states
    const [filters, setFilters] = useState({
        status: '',
    });

    // Modal states
    const [deleteModal, setDeleteModal] = useState({ open: false, message: null });
    const [viewModal, setViewModal] = useState({ open: false, message: null });

    // Fetch all businesses for dropdown
    const { data: businessesData, isLoading: businessesLoading } = useAllBusinessesForMessages();
    const businesses = businessesData?.data || [];

    // Calculate total unread messages across all businesses
    const totalUnreadMessages = businesses.reduce((sum, business) => {
        return sum + (business.unread_messages_count || 0);
    }, 0);

    // Build filters for API
    const apiFilters = {
        status: filters.status || undefined,
        per_page: 20,
    };

    // Fetch messages (only when business is selected)
    const { data: messagesData, isLoading: messagesLoading, refetch } = useBusinessMessages(
        selectedBusinessId, 
        apiFilters,
        { enabled: !!selectedBusinessId }
    );
    
    
    // Mutations
    const markAsReadMutation = useMarkMessageAsRead({
        onSuccess: () => {
            showToast({ title: 'Succès', description: 'Message marqué comme lu', status: 'success' });
            refetch();
        },
        onError: () => {
            showToast({ title: 'Erreur', description: 'Impossible de marquer le message comme lu', status: 'error' });
        }
    });

    const markAsRepliedMutation = useMarkMessageAsReplied({
        onSuccess: () => {
            showToast({ title: 'Succès', description: 'Message marqué comme répondu', status: 'success' });
            refetch();
        },
        onError: () => {
            showToast({ title: 'Erreur', description: 'Impossible de marquer le message comme répondu', status: 'error' });
        }
    });

    const deleteMutation = useDeleteMessage({
        onSuccess: () => {
            showToast({ title: 'Succès', description: 'Message supprimé avec succès', status: 'success' });
            setDeleteModal({ open: false, message: null });
            refetch();
        },
        onError: () => {
            showToast({ title: 'Erreur', description: 'Impossible de supprimer le message', status: 'error' });
        }
    });

    // Extract data
    const messages = messagesData?.data || [];
    const statistics = messagesData?.statistics || { total: 0, new: 0, read: 0, replied: 0 };

    // Filter messages by search query
    const filteredMessages = messages?.filter(msg => 
        msg.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.business?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value || '');
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
        }));
    };

    const handleBusinessChange = (event) => {
        setSelectedBusinessId(event.target.value);
        setFilters({ status: '' }); // Reset filters when changing business
        setSearchQuery(''); // Reset search
    };

    const handleViewClick = async (row) => {
        setViewModal({ open: true, message: row });
        
        // Mark as read if it's new
        if (row.status === 'new') {
            await markAsReadMutation.mutateAsync(row.id);
        }
    };

    const handleMarkAsReplied = async (row) => {
        await markAsRepliedMutation.mutateAsync(row.id);
    };

    const handleDeleteClick = (row) => {
        setDeleteModal({ open: true, message: row });
    };

    const handleDeleteConfirm = () => {
        if (deleteModal.message) {
            deleteMutation.mutate(deleteModal.message.id);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: fr });
        } catch {
            return 'N/A';
        }
    };

    // Actions for datatable
    const actions = {
        onView: handleViewClick,
        onMarkAsReplied: handleMarkAsReplied,
        onDelete: handleDeleteClick,
    };

    // Filter configurations
    const filterConfigs = [
        {
            name: 'status',
            label: 'Statut',
            options: [
                { value: 'new', label: `Nouveaux (${statistics.new})` },
                { value: 'read', label: `Lus (${statistics.read})` },
                { value: 'replied', label: `Répondus (${statistics.replied})` },
            ],
        },
    ];

    // Get selected business details
    const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        <FaInbox style={{ marginRight: 12, verticalAlign: 'middle' }} />
                        Messagerie
                    </Typography>
                    {totalUnreadMessages > 0 && (
                        <Badge 
                            badgeContent={totalUnreadMessages} 
                            color="error"
                            max={99}
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.9rem',
                                    height: '28px',
                                    minWidth: '28px',
                                    borderRadius: '14px',
                                }
                            }}
                        >
                            <Box sx={{ width: 40, height: 40 }} />
                        </Badge>
                    )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Gérez tous les messages et demandes de renseignements par entreprise
                </Typography>
            </Box>

            {/* Business Selector */}
            <Card sx={{ mb: 4, boxShadow: 3 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                            <FaBuilding size={24} color="#2E7D32" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Entreprise:
                            </Typography>
                        </Box>
                        
                        <FormControl fullWidth>
                            <InputLabel id="business-select-label">Sélectionner une entreprise</InputLabel>
                            <Select
                                labelId="business-select-label"
                                id="business-select"
                                value={selectedBusinessId}
                                label="Sélectionner une entreprise"
                                onChange={handleBusinessChange}
                                disabled={businessesLoading}
                            >
                                <MenuItem value="">
                                    <em>-- Sélectionner une entreprise --</em>
                                </MenuItem>
                                {businesses.map((business) => (
                                    <MenuItem key={business.id} value={business.id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {business.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    N° {business.business_number} • {business.category}
                                                </Typography>
                                            </Box>
                                            {business.unread_messages_count > 0 && (
                                                <Badge 
                                                    badgeContent={business.unread_messages_count} 
                                                    color="error"
                                                    max={99}
                                                    sx={{ ml: 2 }}
                                                />
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {businessesLoading && (
                            <CircularProgress size={24} sx={{ ml: 2 }} />
                        )}
                    </Stack>

                    {selectedBusiness && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Contact: {selectedBusiness.contact_name || '—'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {selectedBusiness.contact_email || '—'}
                                    </Typography>
                                </Grid>
                                {selectedBusiness.unread_messages_count > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FaEnvelope color="#f44336" />
                                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                                                {selectedBusiness.unread_messages_count} message{selectedBusiness.unread_messages_count > 1 ? 's' : ''} non lu{selectedBusiness.unread_messages_count > 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Show content only when business is selected */}
            {selectedBusinessId ? (
                <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid size={{md:3,sm:6,xs:12}}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography color="text.secondary" variant="body2">
                                                Total
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {statistics.total}
                                            </Typography>
                                        </Box>
                                        <FaEnvelope size={40} color="#757575" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{md:3,sm:6,xs:12}}>
                            <Card sx={{ bgcolor: '#ffebee' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography color="text.secondary" variant="body2">
                                                Nouveaux
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                {statistics.new}
                                            </Typography>
                                        </Box>
                                        <FaEnvelope size={40} color="#f44336" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{md:3,sm:6,xs:12}}>
                            <Card sx={{ bgcolor: '#fff3e0' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography color="text.secondary" variant="body2">
                                                Lus
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                                                {statistics.read}
                                            </Typography>
                                        </Box>
                                        <FaEnvelopeOpen size={40} color="#ff9800" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{md:3,sm:6,xs:12}}>
                            <Card sx={{ bgcolor: '#e8f5e9' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography color="text.secondary" variant="body2">
                                                Répondus
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                {statistics.replied}
                                            </Typography>
                                        </Box>
                                        <FaCheckCircle size={40} color="#4caf50" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Messages Datatable */}
                    <Datatable
                        columns={MessageColumns}
                        data={filteredMessages}
                        title={`Messages - ${selectedBusiness?.name || ''}`}
                        actions={actions}
                        isHeadButton={false}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onRefresh={refetch}
                        isLoading={messagesLoading}
                        filters={filterConfigs}
                        filterValues={filters}
                        onFilterChange={handleFilterChange}
                        showFilterCount={true}
                        noDataComponent={
                            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                                <Typography variant="h6" gutterBottom>
                                    Aucun message trouvé
                                </Typography>
                                <Typography variant="body2">
                                    {filters.status 
                                        ? 'Aucun message trouvé avec les filtres appliqués'
                                        : 'Aucun message reçu pour cette entreprise'}
                                </Typography>
                            </Box>
                        }
                    />
                </>
            ) : (
                // Placeholder when no business is selected
                <Card sx={{ textAlign: 'center', py: 8 }}>
                    <CardContent>
                        <FaBuilding size={64} color="#bdbdbd" style={{ marginBottom: 16 }} />
                        <Typography variant="h5" gutterBottom color="text.secondary">
                            Sélectionnez une entreprise
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Veuillez sélectionner une entreprise dans la liste ci-dessus pour voir ses messages
                        </Typography>
                        {totalUnreadMessages > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Chip 
                                    icon={<FaEnvelope />}
                                    label={`${totalUnreadMessages} message${totalUnreadMessages > 1 ? 's' : ''} non lu${totalUnreadMessages > 1 ? 's' : ''} au total`}
                                    color="error"
                                    size="medium"
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* View Message Dialog */}
            <Dialog
                open={viewModal.open}
                onClose={() => setViewModal({ open: false, message: null })}
                maxWidth="md"
                fullWidth
            >
                {viewModal.message && (
                    <>
                        <DialogTitle>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Détails du message</Typography>
                                <Chip
                                    label={
                                        viewModal.message.status === 'new' 
                                            ? 'Nouveau' 
                                            : viewModal.message.status === 'read' 
                                            ? 'Lu' 
                                            : 'Répondu'
                                    }
                                    color={
                                        viewModal.message.status === 'new' 
                                            ? 'error' 
                                            : viewModal.message.status === 'read' 
                                            ? 'warning' 
                                            : 'success'
                                    }
                                    size="small"
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            <FaUser style={{ marginRight: 8 }} />
                                            Expéditeur
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {viewModal.message.sender_name}
                                        </Typography>
                                        <Box display="flex" gap={3} flexWrap="wrap">
                                            <Typography variant="body2" color="text.secondary">
                                                <FaEnvelope style={{ marginRight: 8 }} />
                                                {viewModal.message.sender_email}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <FaPhone style={{ marginRight: 8 }} />
                                                {viewModal.message.sender_phone}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Entreprise concernée
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {viewModal.message.business?.name || '—'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            N° {viewModal.message.business?.business_number || '—'}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Message
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {viewModal.message.message}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" color="text.secondary">
                                        Date d'envoi
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(viewModal.message.created_at)}
                                    </Typography>
                                </Grid>

                                {viewModal.message.read_at && (
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Lu le
                                        </Typography>
                                        <Typography variant="body2">
                                            {formatDate(viewModal.message.read_at)}
                                        </Typography>
                                    </Grid>
                                )}

                                {viewModal.message.replied_at && (
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="caption" color="text.secondary">
                                            Répondu le
                                        </Typography>
                                        <Typography variant="body2">
                                            {formatDate(viewModal.message.replied_at)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewModal({ open: false, message: null })}>
                                Fermer
                            </Button>
                            {viewModal.message.status !== 'replied' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<FaReply />}
                                    onClick={() => {
                                        handleMarkAsReplied(viewModal.message);
                                        setViewModal({ open: false, message: null });
                                    }}
                                >
                                    Marquer comme répondu
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="primary"
                                href={`mailto:${viewModal.message.sender_email}?subject=Re: ${viewModal.message.subject}`}
                                startIcon={<FaEnvelope />}
                            >
                                Répondre par email
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, message: null })}
                onConfirm={handleDeleteConfirm}
                itemName={deleteModal.message?.sender_name}
                description={`Vous êtes sur le point de supprimer le message de "${deleteModal.message?.sender_name}". Cette action est irréversible.`}
                isLoading={deleteMutation.isPending}
            />

            {ToastComponent}
        </Box>
    );
};

export default MessagesPage;