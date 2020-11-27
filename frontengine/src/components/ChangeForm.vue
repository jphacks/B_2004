<template>
    <div>
    <b-button v-b-modal.modal-1>プロフィールの編集</b-button>
        <b-modal id="modal-1" title="プロフィールを編集">
            <label>
                <div id="id_face_imaeg">
                    <b-img :src="targetImage" class="image" width="160" height="160" alt="選択された画像"></b-img>
                </div>
                <div id="id_register_image">
                    <input v-on:change="selectedFile" type="file" name="file" accept="image/jpeg, image/png" class="filBtn"><br>
                </div>
            </label>
            <b-form-group
                id="input-group-1"
                label="名前:"
                label-for="input-1"
            >
                <b-form-input
                    id="input-1"
                    v-model="nameValue"
                    required
                    placeholder="Enter name"
                >
                </b-form-input>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
// import MyClient from '@/components/MyClient.vue'

export default {
  // components: {
  //  MyClient
  // },
  data () {
    return {
      nameValue: '現在の名前',
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

<style scoped>
/* Cssファイルはここへ配置する。 */
    .filBtn {
        display: none;
    }
</style>
