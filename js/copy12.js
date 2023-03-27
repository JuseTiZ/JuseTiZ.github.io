// 复制提醒
document.addEventListener("copy",function(e){
  new Vue({
    data:function(){
      this.$notify({
        title:"复制成功，Juse watching u...",
        message:"本站采用 CC 协议，若要转载请提一嘴原文链接哦😀~",
        position: 'top-left',
        offset: 50,
        showClose: false,
        type:"success"
      });
      return{visible:false}
    }
  })
})

/* F12按键提醒 */
document.onkeydown = function () {
  if (window.event && window.event.keyCode == 123) {
    new Vue({
      data:function(){
        this.$notify({
          title:"嚯嚯嚯让我看看你在干啥？",
          message:"原来是在扒源，给我留条底裤谢谢😳。",
          position: 'top-left',
          offset: 50,
          showClose: false,
          type:"warning"
        });
      }
    })
  }
};