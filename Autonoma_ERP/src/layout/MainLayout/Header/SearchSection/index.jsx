import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// third party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setFilters } from 'store/slices/search';

// assets
import { IconSearch, IconX, IconApps, IconFileText, IconAdjustmentsHorizontal, IconCalendar, IconFilter } from '@tabler/icons-react';
import { Divider, MenuItem, Select, Button, Stack } from '@mui/material';

const SUGGESTIONS = [
  { label: 'Master Check List', path: '/qms/checklist/master', type: 'Module' },
  { label: 'Check List Reports', path: '/qms/checklist/renewal-report', type: 'Module' },
  { label: 'Verifications', path: '/qms/checklist/verify', type: 'Module' },
  { label: 'Close Check List Renewal', path: '/qms/checklist/close-renewal', type: 'Module' },
  { label: 'Renewal Verify', path: '/qms/checklist/renewal-verify', type: 'Module' },
  { label: 'User Overview', path: '/admin/user-overview', type: 'Module' },
  { label: 'Dashboard', path: '/dashboard/default', type: 'Page' },
  { label: 'Analytics', path: '/dashboard/analytics', type: 'Page' }
];

function HeaderAvatar({ children, ref, ...others }) {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        color: theme.vars.palette.secondary.dark,
        background: theme.vars.palette.secondary.light,
        '&:hover': {
          color: theme.vars.palette.secondary.light,
          background: theme.vars.palette.secondary.dark
        },

        ...theme.applyStyles('dark', {
          color: theme.vars.palette.secondary.main,
          background: theme.vars.palette.dark.main,
          '&:hover': {
            color: theme.vars.palette.secondary.light,
            background: theme.vars.palette.secondary.main
          }
        })
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
}

// ==============================|| SEARCH INPUT - MOBILE||============================== //

function MobileSearch({ value, setValue, popupState, placeholder }) {
  const theme = useTheme();

  return (
    <OutlinedInput
      id="input-search-header-mobile"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder || "Search anything..."}
      startAdornment={
        <InputAdornment position="start">
          <IconSearch stroke={1.5} size="16px" />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <Box sx={{ ml: 2 }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: 'orange.light',
                color: 'orange.dark',
                '&:hover': { bgcolor: 'orange.dark', color: 'orange.light' },

                ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.dark.main })
              }}
              {...bindToggle(popupState)}
            >
              <IconX stroke={1.5} size="20px" />
            </Avatar>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      slotProps={{ input: { 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
      sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
    />
  );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const value = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);

  const setValue = (val) => {
    dispatch(setQuery(val));
  };
  const handleFilterChange = (key, val) => {
    dispatch(setFilters({ [key]: val }));
  };

  // --- Context Awareness Logic ---
  const isQmsChecklist = location.pathname.startsWith('/qms/checklist');
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/';

  // Dynamic Placeholder
  let searchPlaceholder = "Search across Autonoma...";
  if (isQmsChecklist) searchPlaceholder = "Search in Checklists...";
  else if (isDashboard) searchPlaceholder = "Search Dashboard...";

  // Dynamic Suggestions - Only show on Dashboard
  const currentSuggestions = isDashboard ? SUGGESTIONS : [];
  const showSuggestions = isDashboard;

  return (    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="19.2px" />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
              >
                {({ TransitionProps }) => (
                  <>
                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                        <Box sx={{ p: 2 }}>
                          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid size="grow">
                              <MobileSearch value={value} setValue={setValue} popupState={popupState} placeholder={searchPlaceholder} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>
      
      {/* Desktop Global Search - O365 Style */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', maxWidth: 500 }}>
        <Autocomplete
          freeSolo
          options={currentSuggestions}
          noOptionsText={isDashboard ? undefined : null}
          openOnFocus={isDashboard}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
          inputValue={value}
          onInputChange={(event, newInputValue) => {
            setValue(newInputValue);
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === 'object' && newValue !== null && newValue.path) {
              navigate(newValue.path);
              setValue('');
            } else if (typeof newValue === 'string') {
              const match = currentSuggestions.find(s => s.label.toLowerCase() === newValue.toLowerCase());
              if (match) {
                navigate(match.path);
                setValue('');
              }
            }
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.type === 'Module' ? <IconApps size={18} /> : <IconFileText size={18} />}
              <Typography variant="body2">{option.label}</Typography>
              <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>{option.type}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={searchPlaceholder}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  borderRadius: 2,
                  pr: 1,
                  pl: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                    boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
                    borderColor: 'primary.main'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <IconSearch stroke={1.5} size="18px" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {value && (
                        <IconButton size="small" onClick={() => setValue('')} sx={{ p: 0.5 }}>
                          <IconX stroke={1.5} size="16px" />
                        </IconButton>
                      )}
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
                      <PopupState variant="popper" popupId="advanced-filter-popper">
                        {(popupState) => (
                          <>
                            <IconButton 
                              size="small" 
                              {...bindToggle(popupState)}
                              sx={{ 
                                p: 0.5,
                                color: popupState.isOpen ? 'primary.main' : 'text.secondary',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
                            </IconButton>
                            <Popper
                              {...bindPopper(popupState)}
                              transition
                              placement="bottom-end"
                              sx={{ zIndex: 1200, mt: 1.5 }}
                            >
                              {({ TransitionProps }) => (
                                <Transitions type="fade" {...TransitionProps}>
                                  <Card sx={{ 
                                    p: 2, 
                                    width: 320, 
                                    boxShadow: theme => theme.customShadows?.z1 || theme.shadows[8],
                                    border: '1px solid',
                                    borderColor: 'divider'
                                  }}>
                                    <Stack spacing={2}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Advanced Filters</Typography>
                                      
                                      {isQmsChecklist ? (
                                        <>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Category</Typography>
                                            <Select fullWidth size="small" value={filters.category || 'All'} onChange={(e) => handleFilterChange('category', e.target.value)}>
                                              <MenuItem value="All">All Categories</MenuItem>
                                              <MenuItem value="RENEWAL">Renewal</MenuItem>
                                              <MenuItem value="CHECK LIST">Check List</MenuItem>
                                            </Select>
                                          </Box>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Status</Typography>
                                            <Select fullWidth size="small" value={filters.status || 'All'} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                              <MenuItem value="All">All Status</MenuItem>
                                              <MenuItem value="Pending for Verify">Pending for Verify</MenuItem>
                                              <MenuItem value="Verified">Verified</MenuItem>
                                              <MenuItem value="Rejected">Rejected</MenuItem>
                                            </Select>
                                          </Box>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Record Status</Typography>
                                            <Select fullWidth size="small" value={filters.recordStatus || 'All'} onChange={(e) => handleFilterChange('recordStatus', e.target.value)}>
                                              <MenuItem value="All">All Records</MenuItem>
                                              <MenuItem value="Active">Active</MenuItem>
                                              <MenuItem value="In Active">In Active</MenuItem>
                                            </Select>
                                          </Box>
                                        </>
                                      ) : (
                                        <>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Search in Type</Typography>
                                            <Select fullWidth size="small" value={filters.type || 'All'} onChange={(e) => handleFilterChange('type', e.target.value)}>
                                              <MenuItem value="All">All Types</MenuItem>
                                              <MenuItem value="Module">Modules</MenuItem>
                                              <MenuItem value="Page">Pages</MenuItem>
                                              <MenuItem value="Document">Documents</MenuItem>
                                            </Select>
                                          </Box>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Date Modified</Typography>
                                            <TextField fullWidth size="small" type="date" value={filters.date || ''} onChange={(e) => handleFilterChange('date', e.target.value)} InputLabelProps={{ shrink: true }} />
                                          </Box>
                                          <Box>
                                            <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>Status</Typography>
                                            <Select fullWidth size="small" value={filters.status || 'All'} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                              <MenuItem value="All">All Status</MenuItem>
                                              <MenuItem value="Active">Active</MenuItem>
                                              <MenuItem value="Pending">Pending</MenuItem>
                                            </Select>
                                          </Box>
                                        </>
                                      )}

                                      <Divider />
                                      
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button size="small" color="error" onClick={() => dispatch(setFilters({ type: 'All', date: '', status: 'All' }))}>Reset</Button>
                                        <Button size="small" variant="contained" onClick={popupState.close}>Done</Button>
                                      </Stack>
                                    </Stack>
                                  </Card>
                                </Transitions>
                              )}
                            </Popper>
                          </>
                        )}
                      </PopupState>
                    </Stack>
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Box>
    </>
  );
}

HeaderAvatar.propTypes = { children: PropTypes.node, ref: PropTypes.any, others: PropTypes.any };
MobileSearch.propTypes = { value: PropTypes.string, setValue: PropTypes.func, popupState: PropTypes.any, placeholder: PropTypes.string };
