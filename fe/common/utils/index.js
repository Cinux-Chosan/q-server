import path from "path";
import request from "@req";
import moment from "moment";
import debug from "@utils/debug";
import iconMap from "@icons/map";

let uniqueKey = 0;

export const getUniqueKey = () => uniqueKey++;
export const opKeys = ["metaKey", "ctrlKey", "altKey"];
export const isOpkeyPressed = evt => opKeys.find(key => evt[key]);
export const isParentDir = file => file.path === "..";
export const isNull = value => value === null;
export const isUndefined = value => value === undefined;
export const noop = () => {};
export const h = tag => document.createElement(tag);
export const RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (callback => window.setTimeout(callback, 1000 / 60));

/**
 *
 * @param {Function} fn 返回 true 则停止等待，返回 false 则继续等待，直到超时
 * @param {Number} timeout 超时时间，默认为 3000 ms，传入 -1 则禁用超时
 * @param {Number}} interval 每次检查 fn 返回值的中间间隔时间，单位 ms
 */
export const waitUntil = (fn, timeout = 3000, interval = 100) => {
  const infinity = timeout < 0;
  return new Promise((res, rej) => {
    (async () => {
      let ret = await fn();
      if (ret) return res();
      let intervalID = setInterval(async () => {
        ret = await fn();
        if (ret) {
          clearInterval(intervalID);
          res();
        } else if (!infinity) {
          timeout -= interval;
          if (timeout < 0) {
            clearInterval(intervalID);
            rej("wait 超时");
          }
        }
      }, interval);
    })();
  });
};

export const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const createDownloadIframe = async url => {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.className = "hidden";
  document.body.appendChild(iframe);
  await waitUntil(() => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const { readyState } = iframeDoc;
      return ["complete", "interactive"].includes(readyState);
    } catch (error) {
      isDev && debug.error("createDownloadIframe", error);
    }
  }, -1);
  setTimeout(() => document.body.removeChild(iframe), 6000);
};

export const formatDownload = downloadList => {
  return downloadList.map(item => item.fullPath || item);
};

/**
 * 下载文件列表
 * @param {Array} downloadList 需要下载的文件路径列表
 */
export const downloadWithGetPost = async downloadList => {
  downloadList = formatDownload(downloadList);
  const stamp = getUniqueKey();
  const downloadId = await request(`/api/download?${stamp}`, { downloadList });
  return createDownloadIframe(
    `/api/download?isDownload=&downloadId=${downloadId}&stamp=${stamp}`
  );
};

export const createInput = (name, value) => {
  return Object.assign(h("input"), { name, value });
};

/**
 * 下载文件列表
 * @param {Array} downloadList 需要下载的文件路径列表
 * 该下载方案不适合同时下载多个文件的情况，因为多个表单提交，前面的会被浏览器置为 canceled
 */
export const downloadWithFrom = downloadList => {
  downloadList = formatDownload(downloadList);
  const form = document.createElement("form");
  form.action = `/api/postDownload?${getUniqueKey()}`;
  form.method = "POST";
  form.className = "hidden";
  downloadList.forEach(fullPath => {
    form.append(createInput("downloadList", fullPath));
  });
  document.body.append(form);
  form.submit();
  setTimeout(() => {
    form.remove();
  });
};

export const download = async (downloadList, path, type = 1) => {
  type === 1
    ? downloadWithGetPost(downloadList, path)
    : downloadWithFrom(downloadList, path);
};

export const copyTextToClipBoard = text => {
  text = text.trim();
  const textarea = document.createElement("textarea"); //创建input对象
  const currentFocus = document.activeElement; //当前获得焦点的元素
  document.body.appendChild(textarea); //添加元素
  textarea.className = "outOfViewport";
  textarea.value = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
  } else {
    textarea.select();
  }
  try {
    const isSuccess = document.execCommand("copy"); //执行复制
    if (isSuccess) {
      return true;
    } else {
      throw new Error("拷贝失败");
    }
  } catch (error) {
    isDev && debug.error(error.message);
    throw error;
  } finally {
    document.body.removeChild(textarea); //删除元素
    currentFocus.focus();
  }
};

export const setValue = (obj, key, value) => {
  const segments = key.split(".");
  const lastButOneIndex = segments.length - 1;
  for (let i = 0; i < lastButOneIndex; i++) {
    obj = obj[segments[i]];
    if (!obj && typeof obj !== "object")
      throw new Error(
        `setValue 错误，obj.${segments.slice(0, i + 1).join(".")} 不存在`
      );
  }
  obj[segments[lastButOneIndex]] = value;
};

export const formatTime = time => {
  return moment(time).format("YYYY/MM/DD HH:mm:ss");
};

export const fileType = file => {
  if (file.isDir) return "dir";
  return iconMap[file.fileExt] || "file";
};

export const getHref = (file, router) => {
  const route = router.currentRoute;
  if (file.isDir) {
    const { query, ...rest } = route;
    const { dir = "/" } = query;
    const { href } = router.resolve({
      ...rest,
      query: { ...query, dir: path.join(dir, file.basename) }
    });
    return href;
  } else {
    return file.fullPath;
  }
};

/**
 * 获取点所在的文件对象，如果没有怎返回 null
 * @param {Point} point 点
 * @param {Array} fileList 文件列表
 */
export const getPointerOn = (point, fileList) =>
  fileList.find(({ domRect }) => domRect && domRect.isPointIn(point));

/**
 * 根据当前路径创建导航用面包屑
 * @param {String}} dir 当前目录路径，即 query.dir 参数
 */
export const creatBreadCrumbs = (dir = "/") => {
  let parent = "/";
  const rootObj = {
    name: "~",
    path: "/"
  };
  const breadcrumbs = dir.split("/").filter(item => item);
  const breadcrumbObjs = breadcrumbs.map(item => {
    parent = path.join(parent, item);
    return {
      name: item,
      path: parent
    };
  });
  return [rootObj, ...breadcrumbObjs];
};

/**
 * 单个文件上传
 * @param {File} file 上传的文件对象
 * @param {String} dir 上传的目录
 */
export const uploadFile = (file, dir = "/") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("dir", dir);
  return request("/api/upload", formData);
};
