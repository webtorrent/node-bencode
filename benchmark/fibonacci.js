// run a constant benchmark suite before and after our tests
// so we can normalize performance across different CPUs

// bipbip/__benchmarks__/fibonacci.js

export function fibonacciSuite(name) {

  function loop(input) {
      let num = input
      let a = 1
      let b = 0
      let temp
      while (num >= 0) {
          temp = a
          a += b
          b = temp
          num -= 1
      }
      return b
  }

  function recursive(num) {
      if (num <= 1) return 1
      return recursive(num - 1) + recursive(num - 2)
  }

  function recmemo(num, memo = {}) {
      if (memo[num]) return memo[num]
      if (num <= 1) return 1
      memo[num] =
          recmemo(num - 1, memo) +
          recmemo(num - 2, memo)
      return memo[num]
  }

  suite(name, () => {
      const input = 20
      scenario('fibonacci loop', () => { loop(input) })
      scenario('fibonacci recursive', () => { recursive(input) })
      scenario('fibonacci recmemo', () => { recmemo(input) })
  })
}
