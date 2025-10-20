import React from 'react';
import { Box, Grid } from '@mui/material';
import { InputField } from './Form.components';

export default function PasswordReset({ values = {}, onChange, disabled = true, errors = {} }) {
    return (
        <Grid container>
            <Grid size={{ sm: 12, md: 4, xs: 12 }}>
                <InputField
                    fullWidth
                    label="Mot de passe actuel"
                    name="currentPassword"
                    type="password"
                    value={values.currentPassword || ''}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!errors.currentPassword}
                    errorMessage={errors.currentPassword}
                />
            </Grid>
            <Grid size={{ sm: 12, md: 4, xs: 12 }}>
                <InputField
                    fullWidth
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type="password"
                    value={values.newPassword || ''}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!errors.newPassword}
                    errorMessage={errors.newPassword}
                />
            </Grid>
            <Grid size={{ sm: 12, md: 4, xs: 12 }}>
                <InputField
                    fullWidth
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword || ''}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                />
            </Grid>
        </Grid>
    );
}
