<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
$bg_color: #001c27;

body {
  margin: 0;
  width: 100%;
  height: 100vh;
  background-color: $bg_color;
  overflow-x: hidden;
}
*{
  overflow-y: hidden;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*::-webkit-scrollbar {
  display: none
}
</style>

