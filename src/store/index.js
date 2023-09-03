import { Promise } from 'core-js';
import Vue from 'vue'
import Vuex from 'vuex'
const axios = require('axios');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        apiCityList: null,
        movieList: null,
        goodReviewMovie: null,
        HorPosters: [],
        userInfoList: null,
        userInfo: null,
    },
    getters: {
    },
    mutations: {
        setMovieList(state, data) {
            state.movieList = data
        },
        setHorPosters(state, data) {
            state.HorPosters = data
        },
        setApiCityList(state, data) {
            state.apiCityList = data
        },
        setGoodReviewMovie(state, data) {
            state.goodReviewMovie = data
        },
        // 接收vant组件确认后返回的city，把它转换保存为api适用的地址信息
        getAddress(state, city) {
            state.apiCityList.map(address => {
                // 匹配无论名字后面有没有市字都同样判断
                let nm2 = city.name.substring(0, city.name.length - 1);
                if (city.name == address.nm || nm2 == address.nm) {
                    state.userInfo.address = address;

                    for (let i = 0; i < state.userInfoList.data.length; i++) {
                        // 找到暂存里的用户并更新
                        if (state.userInfoList.data[i].number == state.userInfoList.logged) {
                            state.userInfoList.data[i] = state.userInfo
                            break;
                        }
                    }

                    window.localStorage.setItem("userInfoList", JSON.stringify(state.userInfoList))
                }
            });
        },
        // 获取储存中，登录的用户是哪个，然后从本地数据中取出该用户放入vuex
        getUserInfo(state) {
            if (window.localStorage.getItem("userInfoList")) {
                state.userInfoList = JSON.parse(window.localStorage.getItem("userInfoList"))
                let data = state.userInfoList.data
                let isHasUser = false
                for (let i = 0; i < data.length; i++) {
                    if (data[i].number == state.userInfoList.logged) {
                        isHasUser = true
                        state.userInfo = data[i]
                    }
                }
                if (!isHasUser) {
                    state.userInfo = {
                        number: null,
                        pass: '',
                        name: '请登录',
                        text: '请登录',
                        address: {
                            id: 1,
                            nm: '北京',
                            py: 'beijing'
                        },
                        tickets: []
                    }
                }
            }else{
                state.userInfo = {
                    number: null,
                    pass: '',
                    name: '请登录',
                    text: '请登录',
                    address: {
                        id: 1,
                        nm: '北京',
                        py: 'beijing'
                    },
                    tickets: []
                }
            }

        }
    },
    actions: {
        getMovieList(context) {
            if (!context.state.movieList) {
                return axios.get('https://apis.netstart.cn/maoyan/index/movieOnInfoList')
                    .then(res => {
                        context.commit('setMovieList', res.data.movieList)
                        // 通过热映电影列表的各个电影id寻找横板海报
                        let arr = []
                        res.data.movieList.map(movie => {
                            axios('https://apis.netstart.cn/maoyan/movie/detail', {
                                params: {
                                    movieId: movie.id
                                }
                            }).then(res => {
                                arr.push(
                                    {
                                        img: res.data.movie.videoImg,
                                        id: res.data.movie.id
                                    }
                                )
                            }).catch(err => {
                                console.log(err);
                            })
                        })
                        context.commit('setHorPosters', arr)

                        // console.log(res.data.movieList);
                        return res.data.movieList
                    }).catch(err => {
                        console.log(err);
                    })

            }
        },
        getApiCityList(context) {
            if (!context.state.apiCityList) {
                axios("https://apis.netstart.cn/maoyan/cities.json")
                    .then(res => {
                        context.commit('setApiCityList', res.data.cts)
                    }).catch(err => {
                        console.log(err);
                    });
            }
        },
        getGoodReviewMovie(context) {
            if (!context.state.goodReviewMovie) {
                axios.get('https://apis.netstart.cn/maoyan/index/topRatedMovies')
                    .then(res => {
                        context.commit('setGoodReviewMovie', res.data.movieList)
                    }).catch(err => {
                        console.log(err);
                    })
            }
        }
    },
    modules: {
    }
})
