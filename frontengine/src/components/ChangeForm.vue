<template>
    <div>
    <b-button v-b-modal.modal-1>プロフィールの編集</b-button>
        <b-modal id="modal-1" title="プロフィールを編集">
        <MyClient/>
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
import MyClient from '@/components/MyClient.vue'

export default {
  components: {
    MyClient
  },
  data () {
    return {
      nameValue: '現在の名前'
    }
  }
}
</script>
