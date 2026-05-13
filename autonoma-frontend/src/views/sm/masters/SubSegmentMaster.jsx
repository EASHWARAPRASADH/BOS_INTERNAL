import { useState, useEffect, useCallback } from 'react';
import { Typography, Stack, MenuItem, useTheme, Button, Grid } from '@mui/material';
import { IconChartPie, IconDeviceFloppy, IconPlus, IconX } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import { BOSDataTable, BOSTextField, btnSave, btnDelete, btnCancel } from 'ui-component/bos';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

const columns = [
  { id: 'index', label: '#', minWidth: 50 },
  { id: 'subSegmentCode', label: 'Sub Segment Code', minWidth: 120, bold: true },
  { id: 'subSegmentName', label: 'Sub Segment Name', minWidth: 200 },
  { id: 'status', label: 'Status', minWidth: 100 }
];

const INITIAL = { subSegmentCode: '', subSegmentName: '', status: 'Active' };

export default function SubSegmentMaster() {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/sm/sub-segments');
      setRows(data.map((r, i) => ({ ...r, index: i + 1 })));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const h = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.subSegmentCode || !form.subSegmentName) {
      dispatch(openSnackbar({ open: true, message: 'Please fill required fields.', variant: 'alert', alert: { variant: 'filled' }, severity: 'error', close: false }));
      return;
    }
    try {
      if (selectedId) await axios.put(`/api/sm/sub-segments/${selectedId}`, form);
      else await axios.post('/api/sm/sub-segments', form);
      
      dispatch(openSnackbar({ open: true, message: `Sub Segment ${selectedId ? 'updated' : 'created'}!`, variant: 'alert', alert: { variant: 'filled' }, severity: 'success', close: false }));
      setShowForm(false);
      setForm(INITIAL);
      setSelectedId(null);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sub-segment?')) return;
    try {
      await axios.delete(`/api/sm/sub-segments/${id}`);
      dispatch(openSnackbar({ open: true, message: 'Sub Segment deleted!', variant: 'alert', alert: { variant: 'filled' }, severity: 'success', close: false }));
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconChartPie size={24} />
          <Typography variant="h3">Sub Segment Master</Typography>
        </Stack>
      }
      secondary={
        !showForm && (
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => setShowForm(true)} sx={btnSave}>
            Add New
          </Button>
        )
      }
    >
      {showForm ? (
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <BOSTextField name="subSegmentCode" label="Sub Segment Code" value={form.subSegmentCode} onChange={h} required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <BOSTextField name="subSegmentName" label="Sub Segment Name" value={form.subSegmentName} onChange={h} required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <BOSTextField name="status" label="Status" value={form.status} onChange={h} select>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </BOSTextField>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="contained" startIcon={<IconX size={18} />} onClick={() => { setShowForm(false); setForm(INITIAL); setSelectedId(null); }} sx={btnCancel}>Cancel</Button>
            <Button variant="contained" startIcon={<IconDeviceFloppy size={18} />} onClick={handleSave} sx={btnSave}>Save</Button>
          </Stack>
        </Stack>
      ) : (
        <BOSDataTable
          columns={columns}
          rows={rows}
          onEdit={(row) => { setForm(row); setSelectedId(row.id); setShowForm(true); }}
          onDelete={(row) => handleDelete(row.id)}
        />
      )}
    </MainCard>
  );
}
