<template>
  <canvas id="canvas" style="width: 100%; height: 330px"></canvas>
</template>
<script lang="ts" setup>
  onMounted(() => {
    function draw(f: any) {
      var canvas = document.getElementById("canvas") as HTMLCanvasElement;
      var ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        //새로운 경로 만들기
        ctx.moveTo(0, 0);
        //시작위치 - 처음 점을 찍기
        ctx.lineTo(0, 100);
        //선그리기 - 다음점
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(260, 100);
        ctx.lineTo(260, 350);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.lineTo(300, 250);
        ctx.stroke();
      }
      console.log(f);
    }
  });
</script>
<style lang=""></style>
