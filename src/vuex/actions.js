'use strict';

import * as api from  '../api'
import * as types from './types'
import marked from '../libs/markdown/marked'
import Notification from '../components/notification'
import Prism from '../libs/markdown/prism'

//loader
export const hideLoader = ({dispatch,router,_vm}, msg)=> {
  dispatch(types.HIDE_LOADER, msg);
};

export const showLoader = ({dispatch,router,_vm}, msg)=> {
  dispatch(types.SHOW_LOADER, msg);
};

//header
export const showHeader = ({dispatch,router,_vm})=> {
  dispatch(types.SHOW_HEADER)
};

export const hideHeader = ({dispatch,router,_vm})=> {
  dispatch(types.HIDE_HEADER)
};


export const setHeaderLimit = ({dispatch,router,_vm}, limit)=> {
  dispatch(types.SET_HEADER_LIMIT, limit)
};


//router
export const getArticleList = ({dispatch,router,_vm}, tag = null, limit = 10, page = 1)=> {
  dispatch(types.SHOW_LOADER);
  dispatch(types.SHOW_HEADER);
  var query = _vm.route.query;
  if (Object.keys(query).length) {
    tag = query.tag.split('/');
    if (tag.length === 2) {
      tag = tag[1];
    } else {
      Notification.error('未能识别的路径~2秒后将会跳转到文章列表!', 1.5, function () {
        router.go({
          name: "blog"
        });
      })
    }
  }
  api.BlogApi.getBlogList(limit, page, tag).then(response=> {
    if (response.ok) {
      response = response.data;
      if (response.data && response.success) {
        let list = response.data;
        dispatch(types.GET_ARTICLE_LIST, list, limit, page);
        dispatch(types.HIDE_LOADER);
      }
    }
  });
};
export const getArticleDetail = ({dispatch,router,_vm}, articleId, cb)=> {
  dispatch(types.SHOW_LOADER);
  dispatch(types.HIDE_HEADER);
  api.ArticleApi.getArticleDetail(articleId).then(response=> {
    if (response.ok) {
      response = response.data;
      if (response.data && response.success) {
        let article = response.data;
        article.content = marked(article.content);
        dispatch(types.GET_ARTICLE_DETAIL, article);
        _vm.$nextTick(()=> {
          Prism && Prism.highlightAll(false);
          dispatch(types.HIDE_LOADER);
        });
        cb && cb();
      } else {
        Notification.error('啊哦,没有找到该文章~2秒后将会跳转到文章列表!', 2, ()=> {
          router.go({
            name: "blog"
          })
        })
      }
    } else {
      Notification.error('啊哦,没有找到该文章~2秒后将会跳转到文章列表!', 2, ()=> {
        router.go({
          name: "blog"
        })
      })
    }
  }).catch(err=> {
    Notification.error('啊哦,没有找到该文章~2秒后将会跳转到文章列表!', 2, () => {
      router.go({
        name: "blog"
      })
    })
  });
};