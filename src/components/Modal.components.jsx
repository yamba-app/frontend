import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Chip,
  Alert,
  Fade,
  Slide,
  CircularProgress,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { 
  FaTimes, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaHourglassHalf, 
  FaShoppingCart 
} from 'react-icons/fa';

// ============= Delete Confirmation Modal =============
export const DeleteConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmer la suppression",
  itemName,
  description,
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const requiresTyping = itemName && itemName.length > 0;
  const canDelete = !requiresTyping || confirmText.toLowerCase() === itemName.toLowerCase();

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText('');
      onClose();
    }
  };

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FaExclamationTriangle size={24} />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <FaTimes size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            Cette action est irréversible et ne peut pas être annulée.
          </Typography>
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {description || "Êtes-vous sûr de vouloir supprimer cet élément ?"}
        </Typography>

        {itemName && (
          <Box
            sx={{
              bgcolor: 'grey.50',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 3,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Élément à supprimer :
            </Typography>
            <Typography variant="body1" fontWeight={600} color="error.main">
              {itemName}
            </Typography>
          </Box>
        )}

        {requiresTyping && (
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Pour confirmer, veuillez taper <strong>"{itemName}"</strong> ci-dessous :
            </Typography>
            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Tapez "${itemName}" pour confirmer`}
              disabled={isLoading}
              error={confirmText.length > 0 && !canDelete}
              helperText={
                confirmText.length > 0 && !canDelete
                  ? "Le texte ne correspond pas"
                  : ""
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2.5, bgcolor: 'grey.50' }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!canDelete || isLoading}
          variant="contained"
          color="error"
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <FaTrash />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: 3,
          }}
        >
          {isLoading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ============= Enhanced Status Management Modal =============
export const StatusManagementModal = ({
  open,
  onClose,
  onConfirm,
  business,
  isLoading = false,
}) => {
  const currentStatus = business?.status?.toLowerCase() || 'pending';
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [sendNotification, setSendNotification] = useState(true);

  // Reset when business changes
  React.useEffect(() => {
    if (business) {
      setSelectedStatus(business.status?.toLowerCase() || 'pending');
      setReason('');
      setNotes('');
      setSendNotification(true);
    }
  }, [business]);

  const statusConfigs = {
    pending: {
      label: 'En attente',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: FaHourglassHalf,
      description: 'Remettre en statut En attente pour révision',
      requiresReason: false,
    },
    approved: {
      label: 'Approuvé',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: FaCheckCircle,
      description: 'Approuver et publier cette entreprise publiquement',
      requiresReason: false,
    },
    rejected: {
      label: 'Rejeté',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: FaTimesCircle,
      description: 'Rejeter cette soumission avec une raison',
      requiresReason: true,
    },
    bought: {
      label: 'Acheté',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: FaShoppingCart,
      description: 'Marquer comme vendue/achetée',
      requiresReason: false,
    },
  };

  const config = statusConfigs[selectedStatus] || statusConfigs.pending;
  const Icon = config.icon;
  const isStatusChanged = selectedStatus !== currentStatus;
  const requiresReason = config.requiresReason;
  const canSubmit = !requiresReason || reason.trim().length >= 10;

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStatus(currentStatus);
      setReason('');
      setNotes('');
      setSendNotification(true);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (canSubmit && isStatusChanged) {
      onConfirm({
        newStatus: selectedStatus,
        reason: reason.trim(),
        notes: notes.trim(),
        sendNotification,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: config.gradient,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Icon size={24} />
          <Typography variant="h6" fontWeight={600}>
            Gérer le statut de l'entreprise
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <FaTimes size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        {/* Business Info */}
        {business && (
          <Box
            sx={{
              bgcolor: 'grey.50',
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Entreprise
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {business.name}
                </Typography>
              </Box>
              <Chip
                label={statusConfigs[currentStatus]?.label || currentStatus}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: `${statusConfigs[currentStatus]?.color}20`,
                  color: statusConfigs[currentStatus]?.color,
                  border: `1px solid ${statusConfigs[currentStatus]?.color}40`,
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Numéro
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {business.businessNumber || business.business_number}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Catégorie
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {business.category}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Localisation
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {business.location}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Prix
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {business.price?.toLocaleString()} FCFA
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Status Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Sélectionnez le nouveau statut :
          </Typography>
          
          <ToggleButtonGroup
            value={selectedStatus}
            exclusive
            onChange={(e, value) => value && setSelectedStatus(value)}
            fullWidth
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: '12px !important',
                mx: 0,
              },
            }}
          >
            {Object.entries(statusConfigs).map(([key, statusConfig]) => {
              const StatusIcon = statusConfig.icon;
              const isSelected = selectedStatus === key;
              const isCurrent = currentStatus === key;
              
              return (
                <ToggleButton
                  key={key}
                  value={key}
                  sx={{
                    py: 2,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    border: `2px solid ${isSelected ? statusConfig.color : '#e5e7eb'} !important`,
                    bgcolor: isSelected ? `${statusConfig.color}10` : 'white',
                    '&:hover': {
                      bgcolor: `${statusConfig.color}15`,
                      borderColor: `${statusConfig.color} !important`,
                    },
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  {isCurrent && (
                    <Chip
                      label="Actuel"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 8,
                        height: 20,
                        fontSize: '10px',
                        fontWeight: 700,
                        bgcolor: statusConfig.color,
                        color: 'white',
                      }}
                    />
                  )}
                  <StatusIcon size={28} color={statusConfig.color} />
                  <Typography variant="body2" fontWeight={600} color={statusConfig.color}>
                    {statusConfig.label}
                  </Typography>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Box>

        {/* Status Description */}
        {isStatusChanged && (
          <Alert 
            severity={selectedStatus === 'rejected' ? 'error' : selectedStatus === 'approved' ? 'success' : 'info'} 
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body2" fontWeight={500}>
              {config.description}
            </Typography>
          </Alert>
        )}

        {/* Rejection Reason (Required for reject) */}
        {requiresReason && isStatusChanged && (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Raison du rejet *"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Expliquez pourquoi cette entreprise est rejetée..."
            disabled={isLoading}
            error={reason.length > 0 && reason.length < 10}
            helperText={
              reason.length > 0 && reason.length < 10
                ? "La raison doit contenir au moins 10 caractères"
                : "Cette raison sera envoyée au soumissionnaire"
            }
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        )}

        {/* Optional Notes */}
        {isStatusChanged && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes internes (optionnel)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajoutez des notes internes pour votre équipe..."
            disabled={isLoading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        )}

        {/* Notification Toggle */}
        {isStatusChanged && (
          <FormControlLabel
            control={
              <Checkbox
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                disabled={isLoading}
                sx={{
                  color: config.color,
                  '&.Mui-checked': {
                    color: config.color,
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                Envoyer une notification par email au soumissionnaire
              </Typography>
            }
          />
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 2.5, bgcolor: 'grey.50' }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!canSubmit || !isStatusChanged || isLoading}
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Icon />
            )
          }
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: 3,
            bgcolor: config.color,
            '&:hover': {
              bgcolor: config.color,
              filter: 'brightness(0.9)',
            },
          }}
        >
          {isLoading ? 'Traitement...' : `Changer en ${config.label}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};