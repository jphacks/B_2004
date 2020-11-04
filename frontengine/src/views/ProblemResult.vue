<template>
  <div class="problemResult">
    <h1>結果</h1>
    <h3>今回の結果はこちら</h3>
    <b-container class="bv-example-row">
      <b-row cols="2" cols-sm="1" cols-md="1" cols-lg="2">
        <b-col>
          <ul id="example-1">
            <ResultCard v-for="(item, index) in result" :key="index" :testCaseNumber="item.number" :judgment="item.message"/>
          </ul>
        </b-col>
        <b-col>
          <ul id="example-2">
            <OutputCard v-for="(item, index) in output" :key="index" :expectation="item.expectations" :yourAnswer="item.answer"/>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import firebase from 'firebase'
// import { mapActions, mapGetters } from 'vuex'
import ResultCard from '@/components/ResultCard.vue'
import OutputCard from '@/components/OutputCard.vue'

export default {
  name: 'ProblemResult',
  components: {
    ResultCard,
    OutputCard
  },
  data () {
    return {
      result: [
        { number: '1', message: '正解' },
        { number: '2', message: '正解' },
        { number: '3', message: '不正解' },
        { number: '4', message: '正解' },
        { number: '5', message: '不正解' },
        { number: '6', message: '不正解' },
        { number: '7', message: '正解' },
        { number: '8', message: '不正解' },
        { number: '9', message: '正解' },
        { number: '10', message: '正解' }
      ],
      output: [
        { expectations: 'hello', answer: 'hello' },
        { expectations: 'hello world', answer: 'helloworld' },
        { expectations: 'HELLO', answer: '' },
        { expectations: 'HELLO WORLD', answer: 'HELLOWORLD' },
        { expectations: 'Hello', answer: '' },
        { expectations: 'HelloWorld', answer: '' },
        { expectations: 'Helloworld', answer: 'Helloworld' },
        { expectations: 'HELLOworld', answer: '' },
        { expectations: 'helloWORLD', answer: 'helloWORLD' },
        { expectations: 'goodbye', answer: 'goodbye' }
      ]
    }
  }
}
</script>
