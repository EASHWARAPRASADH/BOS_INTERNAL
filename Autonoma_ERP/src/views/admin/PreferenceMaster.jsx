import { useState, useEffect } from 'react';

// material-ui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Box,
  Divider
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import axios from 'utils/axios';

// ==============================|| PREFERENCE MASTER ||============================== //

const PreferenceMaster = () => {
  const dispatch = useDispatch();

  const [preferences, setPreferences] = useState([]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('/api/preferences/all');
      setPreferences(response.data);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <MainCard title="App Preference">
      {/* Top Form Section */}
      <Box sx={{ mb: 4 }}>
        <Formik
          initialValues={{
            name: '',
            value: '',
            comments: '',
            type: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required('Name is required'),
            value: Yup.string().max(255).required('Value is required'),
            comments: Yup.string().max(500),
            type: Yup.string().max(100).required('Type is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
            try {
              await axios.post('/api/preferences/create', {
                prefName: values.name,
                prefValue: values.value,
                comments: values.comments,
                prefType: values.type,
                createdBy: 'System' // Mocked user
              });

              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Preference saved successfully',
                  variant: 'alert',
                  alert: { color: 'success' },
                  close: false
                })
              );

              resetForm();
              setStatus({ success: true });
              fetchPreferences();
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.response?.data?.message || err.message || 'Save failed' });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="flex-start">
                {/* NAME */}
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormControl fullWidth error={Boolean(touched.name && errors.name)}>
                    <InputLabel htmlFor="pref-name">NAME</InputLabel>
                    <OutlinedInput
                      id="pref-name"
                      type="text"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="NAME"
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error id="helper-text-pref-name">
                        {errors.name}
                      </FormHelperText>
                    )}
                  </CustomFormControl>
                </Grid>

                {/* Value */}
                <Grid item xs={12} sm={6} md={2}>
                  <CustomFormControl fullWidth error={Boolean(touched.value && errors.value)}>
                    <InputLabel htmlFor="pref-value">Value</InputLabel>
                    <OutlinedInput
                      id="pref-value"
                      type="text"
                      value={values.value}
                      name="value"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Value"
                    />
                    {touched.value && errors.value && (
                      <FormHelperText error id="helper-text-pref-value">
                        {errors.value}
                      </FormHelperText>
                    )}
                  </CustomFormControl>
                </Grid>

                {/* Comments */}
                <Grid item xs={12} sm={6} md={3}>
                  <CustomFormControl fullWidth error={Boolean(touched.comments && errors.comments)}>
                    <InputLabel htmlFor="pref-comments">Comments</InputLabel>
                    <OutlinedInput
                      id="pref-comments"
                      type="text"
                      value={values.comments}
                      name="comments"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Comments"
                    />
                    {touched.comments && errors.comments && (
                      <FormHelperText error id="helper-text-pref-comments">
                        {errors.comments}
                      </FormHelperText>
                    )}
                  </CustomFormControl>
                </Grid>

                {/* Type */}
                <Grid item xs={12} sm={6} md={2}>
                  <CustomFormControl fullWidth error={Boolean(touched.type && errors.type)}>
                    <InputLabel htmlFor="pref-type">Type</InputLabel>
                    <OutlinedInput
                      id="pref-type"
                      type="text"
                      value={values.type}
                      name="type"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Type"
                    />
                    {touched.type && errors.type && (
                      <FormHelperText error id="helper-text-pref-type">
                        {errors.type}
                      </FormHelperText>
                    )}
                  </CustomFormControl>
                </Grid>

                {/* SAVE Button */}
                <Grid item xs={12} sm={12} md={2} sx={{ mt: { md: 1 } }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      SAVE
                    </Button>
                  </AnimateButton>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
              </Grid>
            </form>
          )}
        </Formik>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bottom Table Section */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
        <Table sx={{ minWidth: 650 }} aria-label="preference table">
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Value</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Comments</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Updated By</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Updated Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preferences.length > 0 ? (
              preferences.map((row, index) => (
                <TableRow key={row.rowId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.prefName}</TableCell>
                  <TableCell>{row.prefValue}</TableCell>
                  <TableCell>{row.comments}</TableCell>
                  <TableCell>{row.prefType}</TableCell>
                  <TableCell>{row.updatedBy || row.createdBy}</TableCell>
                  <TableCell>{row.updatedDate || row.createdDate ? new Date(row.updatedDate || row.createdDate).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="subtitle1" sx={{ py: 3 }}>
                    No preferences found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default PreferenceMaster;
