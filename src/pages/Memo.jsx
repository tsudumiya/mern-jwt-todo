import React, { useState } from 'react';
import { Box, Drawer, IconButton, List, ListItemButton, TextField, Typography } from '@mui/material';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeliteOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import memoApi from '../api/memoApi';
import { useSelector, useDispatch } from 'react-redux';
import { setMemo } from '../redux/features/memoSlice';
import EmojiPicker from '../components/common/EmojiPicker';

const Memo = () => {
    const { memoId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const memos = useSelector((state) => state.memo.value);

    useEffect(() => {
        const getMemo = async () => {
            try {
                const res = await memoApi.getOne(memoId);
                setTitle(res.title);
                setDescription(res.description);
                setIcon(res.icon);
            } catch (error) {
                console.log(error);
            }
        };
        getMemo();
    }, [memoId]);

    let timer;
    const timeout = 500;

    const updateTitle = async (e) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, { title: newTitle });
                const res = await memoApi.getAll();
                dispatch(setMemo(res));
                console.log('setMemo');
            } catch (error) {
                console.log(error);
            } finally {
            }
        }, timeout);
    };

    const updateDescription = async (e) => {
        clearTimeout(timer);
        const newDescription = e.target.value;
        setDescription(newDescription);

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, { description: newDescription });
            } catch (error) {
                console.log(error);
            }
        }, timeout);
    };

    const deleteMemo = async () => {
        try {
            const deletedMemo = await memoApi.delete(memoId);
            console.log(deletedMemo);

            const newMemos = memos.filter((e) => e._id !== memoId);
            dispatch(setMemo(newMemos));

            if (newMemos.length === 0) {
                navigate('/memo');
            } else {
                navigate(`/memo/${newMemos[0]._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onIconChange = async (newIcon) => {
        let temp = [...memos];
        const index = temp.findIndex((e) => e._id === memoId);
        temp[index] = { ...temp[index], icon: newIcon };
        setIcon(newIcon);
        dispatch(setMemo(temp));
        try {
            await memoApi.update(memoId, { icon: newIcon });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* <IconButton>
                    <StarBorderOutlinedIcon />
                </IconButton> */}
                <IconButton variant="outlined" color="error" onClick={deleteMemo}>
                    <DeliteOutlinedIcon />
                </IconButton>
            </Box>
            <Box sx={{ padding: '10px 50px' }}>
                <Box>
                    <EmojiPicker icon={icon} onChange={onIconChange} />
                    <TextField
                        onChange={updateTitle}
                        value={title}
                        placeholder="無題"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '.MuiOutlinedInput-input': { padding: 0 },
                            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '.MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' },
                        }}
                    />
                    <TextField
                        onChange={updateDescription}
                        value={description}
                        placeholder="追加"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '.MuiOutlinedInput-input': { padding: 0 },
                            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '.MuiOutlinedInput-root': { fontSize: '1rem' },
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Memo;
