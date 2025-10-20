import React, { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { FaEdit, FaSave, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import useCurrentUser from '../core/current/user.currents';
import { InputField } from '../components/Form.components';
import PasswordReset from '../components/PasswordReset.components';
import { passwordValidator, profileValidator } from '../utils/functions/inputValidations.functions';
import { useLogout } from '../core/logout/logout.logout';
import useAxiosPrivate from '../core/instance/axiosprivate.instance';
import useToast from '../components/Toast.components';

const Profiles = () => {
  const { currentUser, isLoading, isError, refetch } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '' });
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const profileSchema = profileValidator();
  const passwordSchema = passwordValidator();
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  // Populate form when user loads
  useMemo(() => {
    if (currentUser) {
      const parts = (currentUser?.name || '').trim().split(' ');
      const first = parts.shift() || '';
      const last = parts.join(' ') || '';
      setForm({
        firstName: first,
        lastName: last,
        role: currentUser?.role || currentUser?.roles || 'admin',
      });
    }
  }, [currentUser]);

  const handleInputChange = useCallback((event) => {
    const { name, type, value, checked } = event.target;
    const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value);
    setForm((prevValues) => ({
      ...prevValues,
      [name]: sanitizedValue
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined
    }));
  }, []);


  const handlePasswordChange = useCallback((event) => {
    const { name, type, value, checked } = event.target;
    const sanitizedValue = type === "checkbox" ? checked : DOMPurify.sanitize(value);
    setPasswords((prevValues) => ({
      ...prevValues,
      [name]: sanitizedValue
    }));
    setPasswordErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined
    }));
  }, []);

  const handleToggleEdit = () => setIsEditing((s) => !s);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await profileSchema.validate(form, { abortEarly: false });
      // TODO: call API to save profile
      const data = {
        name: `${form.firstName} ${form.lastName}`.trim(),
      };
      const result = await axiosPrivate.put('/api/auth/update-profile', data);
      if (result.status === 200) {
        showToast({ title: "Success", description: result.data.message, status: "success" });
        setIsEditing(false);
        await refetch();
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        return;
      }
      if (err.response && err.response.data.message) {
        showToast({ title: "", description: err.response.data.message, status: "error" });
      } else {
        console.warn('Profile save error:', err);
      }
    }
    finally {
      setIsEditing(false);
    }

  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    try {
      setLoading(true);
      await passwordSchema.validate(passwords, { abortEarly: false });
      // TODO: call API to change password
      const result = await axiosPrivate.put('/api/auth/update-password', {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword
      });
      if (result.status === 200) {
        showToast({ title: "Success", description: "Password changed successfully", status: "success" });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setLoading(false);
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setPasswordErrors(validationErrors);
      }
      if (err.response && err.response.data.message) {
        showToast({ title: "", description: err.response.data.message, status: "error" });
        setPasswordErrors(err.response.data.errors);
      }
    }
    finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Unable to load profile
        </Typography>
        <Button onClick={() => refetch()} sx={{ mt: 2 }} variant="contained">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', bgcolor: 'primary.main', height: 110 }} />
            <CardContent sx={{ pt: 0, textAlign: 'center' }}>
              <Box sx={{ mt: -8, display: 'flex', justifyContent: 'center' }}>
                <Avatar sx={{ width: 96, height: 96, border: '4px solid', borderColor: 'background.paper' }}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </Avatar>
              </Box>

              <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
                {currentUser?.name || currentUser?.email || 'Administrateur'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email}
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <Chip icon={<FaShieldAlt />} label={(currentUser?.role || 'admin').toString()} color="success" />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1} alignItems="center">
                <Button startIcon={<FaEdit />} variant="outlined" onClick={handleToggleEdit}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button startIcon={<FaSignOutAlt />} color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Profile Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your administrator profile and account settings.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {isEditing ? (
                    <Button startIcon={<FaSave />} variant="contained" onClick={handleProfileSave}>
                      Save Changes
                    </Button>
                  ) : (
                    <Button startIcon={<FaEdit />} variant="outlined" onClick={handleToggleEdit}>
                      Edit
                    </Button>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InputField fullWidth label="Prénom" name="firstName" value={form.firstName} onChange={handleInputChange} disabled={!isEditing} error={!!errors.firstName} helperText={errors.firstName} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InputField fullWidth label="Nom" name="lastName" value={form.lastName} onChange={handleInputChange} disabled={!isEditing} error={!!errors.lastName} helperText={errors.lastName} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Modifier le mot de passe</Typography>
                    <form onSubmit={handlePasswordSave}>
                      <PasswordReset values={passwords} onChange={handlePasswordChange} disabled={false} errors={passwordErrors} />

                      <Box textAlign="right" sx={{ mt: 1 }}>
                        <Button type="submit" sx={{ width: "100%" }} variant="contained" startIcon={<FaShieldAlt />} disabled={loading}>
                          {loading?<CircularProgress size={24} /> : "Change Password"}
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {ToastComponent}
    </Box>
  );
};

export default Profiles;