import request from "@req";
import { message } from "ant-design-vue";

export const isParentDir = file => file.path === "..";
export const isNull = value => value === null;
export const isUndefined = value => value === undefined;
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
      console.log("error", error);
    }
  }, -1);
  setTimeout(() => document.body.removeChild(iframe), 2000);
};

export const download = async downloadList => {
  downloadList = downloadList.map(item => {
    // 对多余字段进行过滤
    const { path, fullPath, isDir, basename } = item;
    return { path, fullPath, isDir, basename };
  });

  const downloadId = await request("/api/download", { downloadList });
  return createDownloadIframe(
    `/api/download?isDownload=&downloadId=${downloadId}`
  );
};

export const copyTextToClipBoard = text => {
  text = text.trim();
  const textarea = document.createElement("textarea"); //创建input对象
  const currentFocus = document.activeElement; //当前获得焦点的元素
  document.body.appendChild(textarea); //添加元素
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
