import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    filters: {
        type: 'All',
        date: '',
        status: 'All'
    }
};

const search = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action) {
            state.query = action.payload;
        },
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        }
    }
});

export default search.reducer;

export const { setQuery, setFilters } = search.actions;
