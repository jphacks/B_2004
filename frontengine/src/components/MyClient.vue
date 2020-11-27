<template>
<div>
    <br>
    <label>
    <div id="id_face_imaeg">
        <b-img :src="targetImage" class="image" width="160" height="160" alt="選択された画像"></b-img>
    </div>
    <div id="id_register_image">
        <input v-on:change="selectedFile" type="file" name="file" accept="image/jpeg, image/png" class="filBtn"><br>
    </div>
    </label>
</div>
</template>

<script>
// javascriptファイルをココへ。

export default {
  name: "MyClient",
  components: {
  },
  data: function () {
    return {
      targetImage: null
    }
  },
  methods: {
    getFileAsBase64: function (filePath) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = error => reject(error)
        reader.readAsDataURL(filePath)
        // ここまでで「resolve(e.target.result)」でbase64化された画像ファイルデータが返却される。
        // https://fujiten3.hatenablog.com/entry/2019/07/10/133132
      })
    },
    selectedFile: function (e) {
      let files = e.target.files
      e.preventDefault() // 標準のInputタグの動作をキャンセル
      // http://tech.aainc.co.jp/archives/10714
      // https://developer.mozilla.org/ja/docs/Web/API/File/Using_files_from_web_applications

      if (files && files.length > 0) { // 有効なFileオブジェクトが渡された時は、画像ファイルとして読み込みを実施
        this.getFileAsBase64(files[0])
          .then((imgDataBase64) => {
            this.targetImage = imgDataBase64
          })
        // ToDo: エラー処理
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Cssファイルはここへ配置する。 */
    .filBtn {
        display: none;
    }
</style>
