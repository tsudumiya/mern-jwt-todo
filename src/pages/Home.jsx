import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import memoApi from '../api/memoApi';

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const createMemo = async () => {
        try {
            setLoading(true);
            const res = await memoApi.create();
            console.log(res);
            navigate(`/memo/${res._id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <LoadingButton
                variant="outlined"
                /* color="success" */
                onClick={() => createMemo()}
                loading={loading}
            >
                メモを作成
            </LoadingButton>
        </Box>
    );
};

export default Home;
