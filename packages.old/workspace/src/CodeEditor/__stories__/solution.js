function nthPrime(n) {
  const isPrime = v => {
    for (let i = 0, len = Math.sqrt(v); i <= len; i++) {
      if (v % i === 0) return false;
    }
    return true;
  };

  let x = 2;
  for (let i = 0; i < n; i++) {
    while (!isPrime(x)) x++;
  }
  return x;
}

export default nthPrime.toString();
