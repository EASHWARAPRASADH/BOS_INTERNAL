import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Stack,
  Chip
} from '@mui/material';
import { IconUser, IconCalendar, IconChecks, IconBan } from '@tabler/icons-react';
import { getStatusChipSx } from 'ui-component/bos';

const ExecutionVerifyDialog = ({ open, handleClose, data, onVerify, onReject }) => {
  if (!data) return null;

  // Assignments have a nested checklist object, Master records don't
  const isAssignment = !!data.checklist;
  const master = isAssignment ? data.checklist : data;

  const statusRaw = data.status;
  const statusText = (typeof statusRaw === 'object' ? statusRaw?.name : statusRaw) || 
                     (typeof master.status === 'object' ? master.status?.name : master.status) || 'Pending';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconChecks size={24} />
          <Typography variant="h4" color="inherit">
            {isAssignment ? 'Verify Execution' : 'Verify Master Record'}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Header Info Row */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="caption" color="textSecondary">Assign To :</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUser size={16} color="#666" />
                  <Typography variant="body1" fontWeight="600">{data.assignedTo || master.assignTo || 'N/A'}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Date :</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconCalendar size={16} color="#666" />
                  <Typography variant="body1">{data.checklistDate ? new Date(data.checklistDate).toLocaleDateString() : 'N/A'}</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Assign Type :</Typography>
                <Typography variant="body1" fontWeight="600">{data.assignType || 'NONE'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Frequency :</Typography>
                <Typography variant="body1" fontWeight="600">{master.frequency || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Seq No :</Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">{master.seqNo}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* Checking Point */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Checking Point</Typography>
            <Typography variant="h4" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              {master.checkingPoint || '-'}
            </Typography>
          </Grid>

          {/* Descriptions */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Descriptions</Typography>
            <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', whiteSpace: 'pre-wrap', minHeight: 80 }}>
              {master.description || 'No additional description provided.'}
            </Typography>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Status</Typography>
            <Chip 
              label={statusText} 
              sx={{ mt: 1, ...getStatusChipSx('PENDING') }} 
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Close
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="error"
          startIcon={<IconBan size={18} />}
          onClick={onReject}
          sx={{ borderRadius: '8px', fontWeight: 600 }}
        >
          Not Accept
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<IconChecks size={18} />}
          onClick={onVerify}
          sx={{ borderRadius: '8px', fontWeight: 600 }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExecutionVerifyDialog;
