// Este metodo le da la vuleta a la palabra (efecto espejo)
const palindrome = (string) => {
  return string
    .split('') // De esta forma lo convertimos en
    .reverse() // le damos la vuelta
    .join('') // volvemos ajuntar el array y lo convertimos en un string
}

// calculamos la media
const average = array => {
  let sum = 0
  array.forEach(num => { sum += num })

  return sum / array.length
}

module.exports = {
  palindrome,
  average

}
