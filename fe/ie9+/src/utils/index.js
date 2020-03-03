import path from "path";
import request from "@req";
import moment from "moment";
import router from "@router";
import debug from "@utils/debug";
import iconMap from "@icons/map";
import { message } from "ant-design-vue";

export const opKeys = ["metaKey", "ctrlKey", "altKey"];
export const isOpkeyPressed = evt => opKeys.find(key => evt[key]);
export const isParentDir = file => file.path === "..";
export const isNull = value => value === null;
export const isUndefined = value => value === undefined;
export const noop = () => { };
export const wait = (fn, timeout = 3000, interval = 100) => {
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

export const createDownloadIframe = async url => {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.className = "hidden";
  document.body.appendChild(iframe);
  await wait(() => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const { readyState } = iframeDoc;
      return ["complete", "interactive"].includes(readyState);
    } catch (error) {
      isDev && debug.error("createDownloadIframe", error);
    }
  }, -1);
  // setTimeout(() => document.body.removeChild(iframe), 20000);
};

export const download = async (downloadList, path) => {
  downloadList = downloadList.map(item => {
    // 对多余字段进行过滤
    const { path, fullPath, isDir, basename } = item;
    return { path, fullPath, isDir, basename };
  });
  const downloadId = await request("/api/download", { downloadList, path });
  return createDownloadIframe(`/api/download?isDownload=&downloadId=${downloadId}`);
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
    isSuccess ? message.success("拷贝成功") : message.error("拷贝失败");
    return isSuccess;
  } catch (error) {
    message.error(`拷贝失败：${error.message}`);
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
      throw new Error(`setValue 错误，obj.${segments.slice(0, i + 1).join(".")} 不存在`);
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

export const getHref = file => {
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
export const getPointerOn = (point, fileList) => fileList.find(({ domRect }) => domRect && domRect.isPointIn(point))