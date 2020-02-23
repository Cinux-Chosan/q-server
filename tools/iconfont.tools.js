function wait(time) {
  return new Promise(res => setTimeout(() => res(), time));
}

// 修复 iconfont 图标 symbol 名
[...document.querySelector(".project-iconlist").children[0].children].forEach(
  async (li, index) => {
    const name = li.querySelector(".icon-name").title;
    const code = li.querySelector(".icon-code.icon-code-show").title;
    if (code !== name) {
      li.querySelector('[title="编辑图标"]').click();
      await wait(1000);
      document.getElementById("J_edit_dialog_fontclass").value = name;
      document.querySelector('[mx-click="update()"]').click();
    }
  }
);

["DOC", "PPT", "MOV", "FLV", "GIF", "PSD", "TTF", "HTML", "SQL"].reduce(
  (prev, next) => `${prev}.${next.toLowerCase()}:${next.toLowerCase()},`,
  ""
);
