<template>
  <div class="pa-loader">
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<style lang="sass">
.pa-loader
  position: absolute
  z-index: 102
  left: 0
  top: 0
  width: 100%
  height: 100%
  background-color: rgb(0,0,0)
  background-color: rgba(0,0,0,0.4)

// adapted from https://loading.io/css/
.lds-ring
  display: inline-block
  position: relative
  width: 100%
  height: 100%

.lds-ring div
  box-sizing: border-box
  display: block
  top: 30%
  left: calc(50% - 82px)
  position: absolute
  width: 164px
  height: 164px
  margin: 8px
  border: 18px solid #fff
  border-radius: 50%
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
  border-color: #fff transparent transparent transparent

.lds-ring div:nth-child(1)
  animation-delay: -0.45s

.lds-ring div:nth-child(2)
  animation-delay: -0.3s

.lds-ring div:nth-child(3)
  animation-delay: -0.15s

@keyframes lds-ring
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)
</style>
