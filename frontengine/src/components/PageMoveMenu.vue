<template>
  <div>
    <b-dropdown split text="別項目に移動" class="m-2">
      <b-dropdown-item href="#"><router-link to="/">ホーム</router-link></b-dropdown-item>
      <b-dropdown-item href="#"><router-link to="/problemList">問題一覧</router-link></b-dropdown-item>
      <b-dropdown-item href="#"><router-link to="/myProfile">マイページ</router-link></b-dropdown-item>
      <b-dropdown-item href="#">追加予定</b-dropdown-item>
    </b-dropdown>
  </div>
</template>
