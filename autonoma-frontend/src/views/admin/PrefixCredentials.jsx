import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  CircularProgress,
  alpha,
  Switch
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
// Removed Formik/Yup for simpler inline state management

// project imports
import axios from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import ConfirmDeleteDialog from 'ui-component/ConfirmDeleteDialog';
import useAuth from 'hooks/useAuth';
import { setFilterConfig, resetFilters } from 'store/slices/search';

// assets
import {
  IconSettings,
  IconPlus,
  IconPencil,
  IconX,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconUser,
  IconTrash,
  IconCheck
} from '@tabler/icons-react';

// ==============================|| PREFIX CREDENTIALS - INLINE EDITABLE ||============================== //

const searchConfig = [
  { id: 'accountYear', label: 'Account Year', type: 'text', placeholder: 'Search Year...' },
  { id: 'salesOrderPrefix', label: 'SO Prefix', type: 'text', placeholder: 'Search SO Prefix...' },
  { id: 'invoicePrefix', label: 'Invoice Prefix', type: 'text', placeholder: 'Search Invoice Prefix...' }
];

const PrefixCredentials = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Inline editing states
  const [editIdx, setEditIdx] = useState(-1); // -1 means no row is being edited
  const [editData, setEditData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const { user } = useAuth();
  const searchQuery = useSelector((state) => state.search.query);

  const getErrorMessage = (err) => {
    if (typeof err === 'string') return err;
    return err?.message || err?.error || err?.detail || JSON.stringify(err) || 'An unexpected error occurred';
  };

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prefix-credentials/all');
      setCredentials(response.data);
    } catch (err) {
      console.error('Failed to fetch prefix credentials:', err);
      dispatch(openSnackbar({ open: true, message: getErrorMessage(err) || 'Failed to fetch prefix credentials', variant: 'alert', severity: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
    dispatch(setFilterConfig(searchConfig));
    dispatch(resetFilters());
    return () => {
      dispatch(setFilterConfig(null));
      dispatch(resetFilters());
    };
  }, [dispatch]);

  const filteredCredentials = useMemo(() => {
    const query = searchQuery?.toLowerCase() || '';
    if (!query) return credentials;

    return credentials.filter((cred) =>
      cred.accountYear?.toLowerCase().includes(query) ||
      cred.salesOrderPrefix?.toLowerCase().includes(query) ||
      cred.matPoPrefix?.toLowerCase().includes(query) ||
      cred.gateEntryPrefix?.toLowerCase().includes(query) ||
      cred.invoicePrefix?.toLowerCase().includes(query)
    );
  }, [credentials, searchQuery]);

  // Handler for adding a new row
  const handleAddRow = () => {
    if (isAdding || editIdx !== -1) {
      dispatch(openSnackbar({ open: true, message: 'Please save or cancel current edit first', variant: 'alert', severity: 'warning' }));
      return;
    }
    setIsAdding(true);
    setEditData({
      accountYear: '',
      status: 1,
      salesOrderPrefix: '',
      matPoPrefix: '',
      gateEntryPrefix: '',
      invoicePrefix: ''
    });
  };

  // Handler for editing an existing row
  const handleEditRow = (idx, row) => {
    if (isAdding || editIdx !== -1) {
      dispatch(openSnackbar({ open: true, message: 'Please save or cancel current edit first', variant: 'alert', severity: 'warning' }));
      return;
    }
    setEditIdx(idx);
    setEditData({ ...row });
  };

  const handleCancelEdit = () => {
    setEditIdx(-1);
    setEditData({});
    setIsAdding(false);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const validateData = (data) => {
    if (!data.accountYear?.trim()) return 'Account Year is required';
    if (!isAdding && data.accountYear.length > 20) return 'Account Year max length is 20';
    
    // Check uniqueness on add
    if (isAdding && credentials.some(c => c.accountYear.toLowerCase() === data.accountYear.toLowerCase())) {
        return 'Account Year already exists';
    }

    return null;
  };

  const handleSave = async () => {
    const error = validateData(editData);
    if (error) {
      dispatch(openSnackbar({ open: true, message: error, variant: 'alert', severity: 'error' }));
      return;
    }

    try {
      const payload = {
        ...editData,
        status: editData.status ? 1 : 0
      };

      if (isAdding) {
        payload.createdBy = user?.id || 'System';
        await axios.post('/api/prefix-credentials/create', payload);
      } else {
        payload.updatedBy = user?.id || 'System';
        await axios.put(`/api/prefix-credentials/update/${editData.accountYear}`, payload);
      }

      dispatch(openSnackbar({ open: true, message: `Prefix Credential ${isAdding ? 'created' : 'updated'} successfully`, variant: 'alert', severity: 'success' }));
      handleCancelEdit();
      fetchCredentials();
    } catch (err) {
      console.error('Save failed:', err);
      dispatch(openSnackbar({ open: true, message: getErrorMessage(err) || 'Save failed', variant: 'alert', severity: 'error' }));
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteTargetId(row.accountYear);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    try {
      await axios.delete(`/api/prefix-credentials/${deleteTargetId}`);
      dispatch(openSnackbar({ open: true, message: 'Prefix Credential deleted successfully', variant: 'alert', severity: 'success' }));
      fetchCredentials();
    } catch (err) {
      console.error('Delete failed:', err);
      dispatch(openSnackbar({ open: true, message: getErrorMessage(err) || 'Delete failed', variant: 'alert', severity: 'error' }));
    }
  };

  const renderCellContent = (row, field, idx, type = 'text') => {
    const isEditing = idx === editIdx || (isAdding && idx === -1);
    
    if (isEditing) {
      if (field === 'status') {
        return (
          <Switch
            size="small"
            checked={editData.status === 1}
            onChange={(e) => handleInputChange('status', e.target.checked ? 1 : 0)}
            color="primary"
          />
        );
      }
      
      return (
        <TextField
          fullWidth
          size="small"
          variant="standard"
          value={editData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${field}...`}
          disabled={!isAdding && field === 'accountYear'}
          inputProps={{ 
            maxLength: 20,
            style: { fontSize: '0.75rem', fontWeight: 700, color: '#1a223f' } 
          }}
          sx={{ '& .MuiInput-underline:before': { borderBottomColor: alpha(theme.palette.primary.main, 0.2) } }}
        />
      );
    }

    if (field === 'status') {
        return (
            <Typography variant="caption" sx={{
              fontWeight: 800,
              color: row.status === 1 ? '#4caf50' : '#f44336',
              bgcolor: alpha(row.status === 1 ? '#4caf50' : '#f44336', 0.08),
              px: 1, py: 0.3, borderRadius: '4px', fontSize: '0.65rem'
            }}>
              {row.status === 1 ? 'Active' : 'Inactive'}
            </Typography>
        );
    }

    if (field === 'accountYear') {
        return <Typography variant="body2" sx={{ fontWeight: 800, color: '#2196f3', fontSize: '0.75rem' }}>{row[field]}</Typography>;
    }

    return <Typography variant="body2" sx={{ fontWeight: 800, color: '#1a223f', fontSize: '0.75rem' }}>{row[field] || '-'}</Typography>;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 145px)', gap: 1, overflow: 'hidden' }}>
      {/* ── HEADER SECTION ── */}
      <Box sx={{
        bgcolor: 'white',
        p: '10px 24px',
        borderRadius: '12px',
        border: '1px solid #eef2f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <IconSettings size={28} />
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a223f', lineHeight: 1.2 }}>Prefix Credentials</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#9e9e9e', textTransform: 'uppercase', fontSize: '0.65rem' }}>SYSTEM CONFIGURATION MANAGER</Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          onClick={handleAddRow}
          disabled={isAdding || editIdx !== -1}
          sx={{
            height: 40,
            borderRadius: '8px',
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
            px: 3,
            fontWeight: 700,
            boxShadow: 'none'
          }}
        >
          Add Prefix
        </Button>
      </Box>

      {/* ── TABLE SECTION ── */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #eef2f6',
        bgcolor: 'white',
        minHeight: 0
      }}>
        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Account Year</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>SO Prefix</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Mat PO Prefix</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Gate Entry Prefix</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Invoice Prefix</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5 }}>Audit Info</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: '#f8fafc', color: '#1a223f', fontSize: '0.7rem', py: 2.5, width: 120 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render New Row at the top if isAdding */}
              {isAdding && (
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), '& td': { py: 1, borderBottom: '2px solid #2196f3' } }}>
                  <TableCell>{renderCellContent({}, 'accountYear', -1)}</TableCell>
                  <TableCell>{renderCellContent({}, 'status', -1)}</TableCell>
                  <TableCell>{renderCellContent({}, 'salesOrderPrefix', -1)}</TableCell>
                  <TableCell>{renderCellContent({}, 'matPoPrefix', -1)}</TableCell>
                  <TableCell>{renderCellContent({}, 'gateEntryPrefix', -1)}</TableCell>
                  <TableCell>{renderCellContent({}, 'invoicePrefix', -1)}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>New Entry</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" onClick={handleSave} sx={{ color: '#4caf50', bgcolor: alpha('#4caf50', 0.1), '&:hover': { bgcolor: '#4caf50', color: 'white' } }}>
                        <IconCheck size={18} />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancelEdit} sx={{ color: '#f44336', bgcolor: alpha('#f44336', 0.1), '&:hover': { bgcolor: '#f44336', color: 'white' } }}>
                        <IconX size={18} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={32} thickness={5} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontWeight: 600 }}>Loading Credentials...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCredentials.length > 0 ? (
                filteredCredentials.map((row, idx) => (
                  <TableRow
                    key={row.accountYear}
                    sx={{
                      '& td': { py: 1.5, borderBottom: '1px solid #f8fafc' },
                      '&:hover': { bgcolor: '#f1f5f9 !important' },
                      bgcolor: idx % 2 === 0 ? 'white' : '#f9fbff'
                    }}
                  >
                    <TableCell>{renderCellContent(row, 'accountYear', idx)}</TableCell>
                    <TableCell>{renderCellContent(row, 'status', idx)}</TableCell>
                    <TableCell>{renderCellContent(row, 'salesOrderPrefix', idx)}</TableCell>
                    <TableCell>{renderCellContent(row, 'matPoPrefix', idx)}</TableCell>
                    <TableCell>{renderCellContent(row, 'gateEntryPrefix', idx)}</TableCell>
                    <TableCell>{renderCellContent(row, 'invoicePrefix', idx)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconCalendarEvent size={14} color="#94a3b8" />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#1a223f', display: 'block', lineHeight: 1.1 }}>
                            {row.updatedDate || row.createdDate ? new Date(row.updatedDate || row.createdDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconUser size={10} color="#94a3b8" />
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', fontWeight: 700 }}>{row.updatedBy || row.createdBy || 'System'}</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {editIdx === idx ? (
                          <>
                            <Tooltip title="Save" arrow>
                              <IconButton size="small" onClick={handleSave} sx={{ color: '#4caf50', bgcolor: alpha('#4caf50', 0.1), '&:hover': { bgcolor: '#4caf50', color: 'white' } }}>
                                <IconDeviceFloppy size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel" arrow>
                              <IconButton size="small" onClick={handleCancelEdit} sx={{ color: '#f44336', bgcolor: alpha('#f44336', 0.1), '&:hover': { bgcolor: '#f44336', color: 'white' } }}>
                                <IconX size={18} />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleEditRow(idx, row)}
                                disabled={isAdding || editIdx !== -1}
                                sx={{
                                  bgcolor: alpha('#2196f3', 0.1),
                                  color: '#2196f3',
                                  borderRadius: '6px',
                                  p: 0.5,
                                  '&:hover': { bgcolor: '#2196f3', color: 'white' }
                                }}
                              >
                                <IconPencil size={18} />
                              </IconButton>
                            </Tooltip>
                            {user?.isBosAdmin === 1 && (
                              <Tooltip title="Delete" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(row)}
                                  disabled={isAdding || editIdx !== -1}
                                  sx={{
                                    bgcolor: alpha('#f44336', 0.1),
                                    color: '#f44336',
                                    borderRadius: '6px',
                                    p: 0.5,
                                    '&:hover': { bgcolor: '#f44336', color: 'white' }
                                  }}
                                >
                                  <IconTrash size={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography variant="h5" color="textSecondary">No prefix credentials found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Prefix Credential"
        message="Are you sure you want to delete this prefix credential? This action cannot be undone."
        itemName={`Account Year: ${deleteTargetId}`}
      />
    </Box>
  );
};

export default PrefixCredentials;
