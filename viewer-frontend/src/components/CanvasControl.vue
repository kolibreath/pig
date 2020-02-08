<template>
  <div class="text-center">
    <v-bottom-sheet inset v-model="isPlaying">
      <!-- 模拟触发事件 -->
      <template v-slot:activator="{ on }">
        <!-- open player 点击的时候设置这个on是一个事件 点击的时候会传递-->
        <v-btn
          id="mock_click"
          color="red"
          dark
          v-on="on"
          class="mock"
        > 
         </v-btn>
      </template>

      <!-- main content -->
      <v-card
      class="mx-auto"
      max-width="600"
      tile
    >
      <v-toolbar
        flat
        dense
      >
      <!-- 迭代速度控制 -->
        <v-toolbar-title>
          <span class="subheading">迭代速度</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-row
          class="mb-4"
          justify="space-between"
        >
          <v-col class="text-left">
            <span
              class="display-3 font-weight-light"
              v-text="ticksLabels[bpm]"
            ></span>
            <span class="subheading font-weight-light mr-1">秒/轮</span>
            <v-fade-transition>
              <v-avatar
                v-if="isPlaying"
                :color="color"
                :style="{
                  animationDuration: animationDuration
                }"
                class="mb-1 v-avatar--metronome"
                size="12"
              ></v-avatar>
            </v-fade-transition>
          </v-col>
          <v-col class="text-right">
            <v-btn
              :color="color"
              dark
              depressed
              fab
              @click="toggle"
            >
              <v-icon large>
                {{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>


        <!-- 进度条调整的下标 -->
         <v-slider
          v-model="bpm"
          :tick-labels="ticksLabels"
          :max="3"
          step="1"
          ticks="always"
          tick-size="4"
        >
        <template v-slot:prepend>
            <v-icon
              :color="color"
              @click="decrement"
            >
              mdi-minus
            </v-icon>
          </template>

          <template v-slot:append>
            <v-icon
              :color="color"
              @click="increment"
            >
              mdi-plus
            </v-icon>
          </template>
        </v-slider>

      </v-card-text>
    </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import bus from "../bus/bus.js"
import $ from 'jquery'
export default{
  // bpm index
    data(){
        return {
            bpm: 0,
            interval: null,
            isPlaying: false,
            ticksLabels:['0.25','0.50','0.75','1.0']
        }
    },
    mounted(){
        this.activateCanvasControl()
       
    },
    methods:{
      //监听事件
          activateCanvasControl(){
            bus.$on('activateCanvasControl', res =>{
              $("#mock_click").trigger("click");
              this.isPlaying = false;
            })
          },
          decrement () {
            this.bpm--
          },
          increment () {
            this.bpm++
          },
          toggle () {
            this.isPlaying = !this.isPlaying
          }
    },
    beforeDestroy(){
        bus.$off('activateCanvasControl');
    },
    computed: {
      color () {
        if (this.bpm == 0) return 'indigo'
        if (this.bpm == 1) return 'teal'
        if (this.bpm == 2) return 'green'
        if (this.bpm == 3) return 'orange'
        return 'red'
      },
      //表示迭代时间
      animationDuration () {
        return `${0.5 / this.bpm}s`
      },
    }
}
</script>

<style>
.mock{
  visibility: hidden;
}

@keyframes metronome-example {
    from {
      transform: scale(.5);
    }

    to {
      transform: scale(1);
    }
  }

  .v-avatar--metronome {
    animation-name: metronome-example;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
</style>