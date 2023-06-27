import axiosClient from './axiosClient';

const memoApi = {
    create: () => axiosClient.post('memo'),
    getAll: () => axiosClient.get('memo'),
    getOne: (id) => axiosClient.get(`memo/${id}`),
    update: (id, params) => {
        //console.log(id); // 6374d2d48fc9fdeab162eab9
        //console.log(params); // {title: 'testだよ!'}
        axiosClient.put(`memo/${id}`, params);
    },
    delete: (id) => {
        axiosClient.delete(`memo/${id}`);
    },
};

export default memoApi;
