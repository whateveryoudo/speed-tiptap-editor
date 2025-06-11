<template>
    <div class="doc-wrapper" >
      <div class="img-wrap">
  <!-- <img src="@/assets/image/file_bg.svg" alt="" /> -->
      </div>
      <div class="text">
        <div class="t">{{ item.title }}</div> 
        <div class="sub">创建者：{{ item.createUser }}</div> 
        <div class="sub">阅读量：{{ item.views }}</div> 
        <div class="sub">访问时间：{{ dayjs(item.visitedAt).format('YYYY-MM-DD hh:mm:ss') }}</div> 
      </div>
      <div class="f-button"><arrow-right-outlined style="color: #00b69b" /></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import dayjs from 'dayjs'
  defineProps({
    item: {
      type: Object,
      default:() => ({})
    }
  })
  </script>
  
  <style lang="less" scoped>
  .doc-wrapper {
    width: 19%;
    height: 260px;
    border: 1px solid #eee;
    align-items: center;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.2s linear;
    cursor: pointer;
    margin-right: 10px;
    margin-top: 10px;
    .img-wrap {
      overflow: hidden;
      // width: 180px;
      // margin:10px 10px 0px 10px;
    }
    .f-button {
      // background-color: var(--ant-color-primary);
      width: 100%;
      height: 24px;
      text-align: right;
      padding: 0 10px;
      line-height: 24px;
    }
  
    img {
      width: 100%;
      // margin-left: -5px;
    }
    .text {
      width: 100%;
      padding: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .t {
        font-size: 14px;
        font-weight: bold;
      }
      .sub {
        font-size: 12px;
        color: rgb(139, 139, 139);
        font-weight: lighter;
      }
    }
  }
  .doc-wrapper:hover {
    box-shadow: 0 6px 12px 0 rgba(123, 123, 123, 0.12);
    translate: 0 -4px;
  }
  </style>