import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography, Box, Button, Stack, Tooltip, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, TextField
} from '@mui/material';
import {
  IconFileDownload,
  IconListCheck,
  IconRefresh,
  IconUser,
  IconCalendar,
  IconChecks,
  IconBan
} from '@tabler/icons-react';
import axios from 'utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterConfig } from 'store/slices/search';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import { exportToExcel } from 'utils/excelExport';
import { BOSDataTable, btnExport, getStatusChipSx } from 'ui-component/bos';
import useLookups from 'hooks/useLookups';
import { API_PATHS } from 'utils/api-constants';

const columns = [
  { id: 'index', label: '#', minWidth: 50 },
  { id: 'seqNo', label: 'Seq.No', minWidth: 80, bold: true },
  { id: 'checkingPoint', label: 'Checking Point', minWidth: 200 },
  { id: 'frequency', label: 'Frequency', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 120 },
  { id: 'assignType', label: 'Assign Type', minWidth: 100 },
  { id: 'photoRequired', label: 'Photo Required', minWidth: 100 },
  { id: 'verificationRequired', label: 'Verification Required', minWidth: 120 },
  { id: 'assignDate', label: 'Assign Date', minWidth: 120 },
  { id: 'nextRenewalDate', label: 'Next Renewal Date', minWidth: 130 },
  { id: 'assignTo', label: 'Assign To', minWidth: 120 },
  { id: 'createdDate', label: 'Created Date', minWidth: 140 },
  { id: 'status', label: 'Verification Status', minWidth: 160 }
];

const STATUS_OPTIONS = [
  'Pending', 'Pending for Verified', 'Pending for Accepted',
  'Accepted', 'Not Accepted', 'Verified', 'Rejected', 'Missed'
];

export default function CloseCheckListRenewal() {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const globalQuery = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);
  const lookups = useLookups(['EMPLOYEES']);

  useEffect(() => {
    dispatch(setFilterConfig([
      {
        id: 'taskType', label: 'Task Type', type: 'select',
        options: [
          { label: 'Mine', value: 'Mine' },
          { label: 'Team', value: 'Team' },
          { label: 'All', value: 'All' }
        ],
        defaultValue: 'Mine'
      },
      {
        id: 'status', label: 'Status', type: 'select',
        options: [{ label: 'All', value: 'All' }, ...STATUS_OPTIONS.map(s => ({ label: s, value: s }))],
        defaultValue: 'All'
      },
      { id: 'fromDate', label: 'From Date', type: 'date' },
      { id: 'toDate', label: 'To Date', type: 'date' },
      {
        id: 'considerDate', label: 'Consider Date?', type: 'select',
        options: [
          { label: 'No', value: 'No' },
          { label: 'Yes', value: 'Yes' }
        ],
        defaultValue: 'No'
      },
      {
        id: 'assignedTo', label: 'Assign To', type: 'select',
        options: [{ label: 'All', value: 'All' }, ...(lookups.employees || []).map(e => ({ label: e.employeeName || `${e.firstName} ${e.lastName}`, value: e.employeeName || `${e.firstName} ${e.lastName}` }))],
        defaultValue: 'All'
      },
      {
        id: 'category', label: 'Category', type: 'select',
        options: [
          { label: 'All', value: 'All' },
          { label: 'Renewal', value: 'RENEWAL' },
          { label: 'Check List', value: 'CHECK LIST' }
        ],
        defaultValue: 'All'
      },
      {
        id: 'searchBy', label: 'Search by', type: 'select',
        options: [
          { label: 'Seq No', value: 'seqNo' },
          { label: 'Checking Point', value: 'checkingPoint' },
          { label: 'Category', value: 'category' }
        ],
        defaultValue: 'checkingPoint'
      }
    ]));
    return () => dispatch(setFilterConfig(null));
  }, [dispatch, lookups.employees]);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page, size,
        taskType: filters.taskType || 'Mine',
        status: filters.status !== 'All' ? filters.status : undefined,
        assignedTo: filters.assignedTo !== 'All' ? filters.assignedTo : undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        fromDate: filters.considerDate === 'Yes' ? filters.fromDate : undefined,
        toDate: filters.considerDate === 'Yes' ? filters.toDate : undefined,
        searchBy: filters.searchBy !== 'All' ? filters.searchBy : undefined,
        searchValue: globalQuery || undefined,
        masterVerifyStatus: 'Verified'
      };
      const response = await axios.get('/api/qms/checklist/assignments', { params });
      setRows(response.data.content || []);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  }, [page, size, filters, globalQuery]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  // Accept or Not Accept the assignment
  const handleVerifyAction = async (status, remarks) => {
    if (!selectedRow) return;
    try {
      await axios.post('/api/qms/checklist/verify', {
        assignmentId: selectedRow.id,
        status: status,
        verifiedBy: 'Current User',
        remarks: remarks || `Action: ${status}`
      });
      dispatch(openSnackbar({
        open: true,
        message: `Checklist ${status} successfully!`,
        severity: status === 'Accepted' || status === 'Pending for Verified' ? 'success' : 'warning',
        variant: 'alert'
      }));
      setDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectRemarks('');
      setSelectedRow(null);
      fetchAssignments();
    } catch (error) {
      console.error('Action failed:', error);
      dispatch(openSnackbar({ open: true, message: 'Action failed', severity: 'error', variant: 'alert' }));
    }
  };

  const handleExport = () => {
    const exportData = rows.map((r, i) => {
      const m = r.checklist || {};
      const statusRaw = r.status;
      const statusText = typeof statusRaw === 'object' ? statusRaw?.name : statusRaw;
      return {
        '#': i + 1,
        'Seq.No': m.seqNo,
        'Checking Point': m.checkingPoint,
        'Frequency': m.frequency,
        'Category': m.category,
        'Assign Type': r.assignType || 'NONE',
        'Photo Required': m.photoRequired || '-',
        'Verification Required': m.verificationRequired || '-',
        'Assign Date': r.assignedDate ? new Date(r.assignedDate).toLocaleDateString() : '-',
        'Next Renewal Date': (r.nextDueDate || m.nextDueDate) ? new Date(r.nextDueDate || m.nextDueDate).toLocaleDateString() : '-',
        'Assign To': r.assignedTo || m.assignTo || '-',
        'Created Date': r.assignedDate ? new Date(r.assignedDate).toLocaleString() : '-',
        'Verification Status': statusText || 'Pending'
      };
    });
    exportToExcel(exportData, 'Close_Checklist_Renewal');
  };

  const renderCell = (col, row, idx) => {
    if (col.id === 'index') return idx + 1 + page * size;

    const master = row.checklist || {};

    if (col.id === 'seqNo') return master.seqNo || '-';
    if (col.id === 'checkingPoint') return master.checkingPoint || '-';
    if (col.id === 'frequency') return master.frequency || '-';
    if (col.id === 'category') return master.category || '-';
    if (col.id === 'assignType') return row.assignType || 'NONE';
    if (col.id === 'photoRequired') return master.photoRequired || '-';
    if (col.id === 'verificationRequired') return master.verificationRequired || '-';
    if (col.id === 'assignDate') return row.assignedDate ? new Date(row.assignedDate).toLocaleDateString() : '-';
    if (col.id === 'nextRenewalDate') {
      const next = row.nextDueDate || master.nextDueDate;
      return next ? new Date(next).toLocaleDateString() : '-';
    }
    if (col.id === 'assignTo') return row.assignedTo || master.assignTo || '-';
    if (col.id === 'createdDate') {
      return row.assignedDate ? new Date(row.assignedDate).toLocaleString() : '-';
    }
    if (col.id === 'status') {
      let s = row.status;
      if (typeof s === 'object' && s !== null) s = s.name;
      s = s || 'Pending';
      let chipStatus = 'PENDING';
      if (s === 'Accepted' || s === 'Verified' || s === 'Completed') chipStatus = 'ACTIVE';
      if (s === 'Rejected' || s === 'Not Accepted' || s === 'Missed') chipStatus = 'INACTIVE';
      if (s === 'Pending for Verified' || s === 'Pending for Accepted') chipStatus = 'PENDING';
      return <Chip label={s} size="small" sx={getStatusChipSx(chipStatus)} />;
    }

    const val = row[col.id];
    if (typeof val === 'object' && val !== null) return val.name || val.label || '-';
    return val || '-';
  };

  // Build dialog data from selected row
  const dialogData = selectedRow ? {
    assignedTo: selectedRow.assignedTo || selectedRow.checklist?.assignTo || 'N/A',
    date: selectedRow.checklistDate || selectedRow.assignedDate,
    assignType: selectedRow.assignType || 'NONE',
    frequency: selectedRow.checklist?.frequency || '-',
    seqNo: selectedRow.checklist?.seqNo || '-',
    checkingPoint: selectedRow.checklist?.checkingPoint || '',
    description: selectedRow.checklist?.description || ''
  } : null;

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconListCheck size={24} />
          <Typography variant="h3">Close Check List / Renewal</Typography>
        </Stack>
      }
      secondary={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={fetchAssignments} color="primary" size="small" sx={{ border: '2px solid', borderColor: 'divider', borderRadius: '8px', p: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'primary.light', transform: 'scale(1.05)' } }}>
              <IconRefresh size={20} />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" color="primary" size="medium" startIcon={<IconFileDownload size={18} />} onClick={handleExport} sx={btnExport}>
            Export Excel
          </Button>
        </Stack>
      }
    >
      <BOSDataTable
        columns={columns}
        rows={rows}
        page={page}
        size={size}
        totalCount={totalElements}
        loading={loading}
        onPageChange={setPage}
        onSizeChange={(s) => { setSize(s); setPage(0); }}
        onDoubleClickRow={(row) => { setSelectedRow(row); setDialogOpen(true); }}
        onClickRow={setSelectedRow}
        selectedRowId={selectedRow?.id}
        showActions={false}
        renderCell={renderCell}
        id="close-renewal-table"
      />

      {/* ===== Accept / Not Accept Dialog ===== */}
      <Dialog open={dialogOpen && !!dialogData} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconChecks size={24} />
            <Typography variant="h4" color="inherit">
              Checklist Verification — {dialogData?.seqNo}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {dialogData && (
            <Grid container spacing={3}>
              {/* Header Row */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Assign To :</Typography>
                    <Typography variant="body1" fontWeight="bold">{dialogData.assignedTo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Date :</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {dialogData.date ? new Date(dialogData.date).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Assign Type :</Typography>
                    <Typography variant="body1" fontWeight="bold">{dialogData.assignType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Frequency :</Typography>
                    <Typography variant="body1" fontWeight="bold">{dialogData.frequency}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Seq No :</Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">{dialogData.seqNo}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Checking Point */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Checking Point</Typography>
                <Typography variant="h4" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  {dialogData.checkingPoint || '-'}
                </Typography>
              </Grid>

              {/* Descriptions */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Descriptions</Typography>
                <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider', whiteSpace: 'pre-wrap', minHeight: 80 }}>
                  {dialogData.description || 'No additional description provided.'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button variant="outlined" color="inherit" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="error"
            startIcon={<IconBan size={18} />}
            onClick={() => { setDialogOpen(false); setRejectDialogOpen(true); }}
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Not Accept
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<IconChecks size={18} />}
            onClick={() => handleVerifyAction('Pending for Verified')}
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Not Accept Reason Dialog ===== */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Not Accept — Provide Reason</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason / Comments"
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="Please explain why this is not accepted..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleVerifyAction('Not Accepted', rejectRemarks)}
            disabled={!rejectRemarks.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
