const { palindrome } = require('../utils/for_testings')

test.skip(' palindrome of Javier', () => {
  const result = palindrome('Javier')

  expect(result).toBe('reivaJ')
})

test.skip('Palindrome of empy string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefine', () => {
  const result = palindrome()

  expect(result).toBeUndefined('')
})
